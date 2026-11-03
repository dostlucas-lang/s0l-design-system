// Generates guidelines/components/<name>.md and guidelines/components/overview.md
// from components/ui: the Figma notes at the top of each file, its exports, its
// cva variants and the documented props. Figma Make reads these files from the
// package (see guidelines/Guidelines.md). Run with `npm run guidelines`.
//
// The files are generated: edit the comments in the component instead, or the
// hand-written guidelines (Guidelines.md, setup.md, foundations/).

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

import ts from "typescript"

const root = path.resolve(import.meta.dirname, "..")
const sourceDir = path.join(root, "components/ui")
const storiesDir = path.join(root, "stories/components")
const outDir = path.join(root, "guidelines/components")

type Prop = { name: string; type: string; optional: boolean; doc: string }
type Variant = { name: string; options: string[]; default?: string }
type ComponentDoc = {
  file: string
  title: string
  summary: string
  notes: string[]
  exports: string[]
  variants: Map<string, Variant[]>
  props: Map<string, Prop[]>
  description: string
  example: string
}

function title(file: string) {
  return file
    .replace(/\.tsx$/, "")
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ")
}

function text(node: ts.Node, source: ts.SourceFile) {
  return node.getText(source).replace(/\s+/g, " ").trim()
}

function jsDoc(node: ts.Node) {
  return ts
    .getJSDocCommentsAndTags(node)
    .filter(ts.isJSDoc)
    .map((doc) => ts.getTextOfJSDocComment(doc.comment) ?? "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
}

// From the Storybook file of the component: the docs description and the JSX
// that the default `render` returns, as a usage example.
function storyDocs(file: string) {
  const storyFile = path.join(
    storiesDir,
    file.replace(/\.tsx$/, ".stories.tsx")
  )
  let sourceText: string
  try {
    sourceText = readFileSync(storyFile, "utf8")
  } catch {
    return { description: "", example: "" }
  }
  const source = ts.createSourceFile(
    storyFile,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )

  let description = ""
  let example = ""

  function visit(node: ts.Node) {
    if (
      !description &&
      ts.isPropertyAssignment(node) &&
      node.name.getText(source) === "component" &&
      ts.isPropertyAssignment(node.parent.parent) &&
      node.parent.parent.name.getText(source) === "description"
    ) {
      const value = node.initializer
      if (ts.isStringLiteralLike(value)) description = value.text
    }

    const isRender =
      (ts.isPropertyAssignment(node) &&
        node.name.getText(source) === "render") ||
      (ts.isMethodDeclaration(node) && node.name.getText(source) === "render")
    if (!example && isRender) {
      const fn = ts.isMethodDeclaration(node) ? node : node.initializer
      const body =
        ts.isArrowFunction(fn) ||
        ts.isFunctionExpression(fn) ||
        ts.isMethodDeclaration(fn)
          ? fn.body
          : undefined
      let jsx: ts.Node | undefined
      if (body && !ts.isBlock(body)) {
        jsx = body
      } else if (body) {
        const returns = body.statements.filter(ts.isReturnStatement)
        jsx = returns[returns.length - 1]?.expression
      }
      if (jsx) {
        while (ts.isParenthesizedExpression(jsx)) jsx = jsx.expression
        const start = source.getLineAndCharacterOfPosition(jsx.getStart(source))
        const indent =
          source.text.split("\n")[start.line].match(/^\s*/)?.[0].length ?? 0
        example = jsx
          .getText(source)
          .split("\n")
          .map((line, index) =>
            index === 0
              ? line
              : line.slice(
                  Math.min(indent, line.match(/^\s*/)?.[0].length ?? 0)
                )
          )
          .join("\n")
      }
    }

    ts.forEachChild(node, visit)
  }
  visit(source)

  return { description, example }
}

// The `//` comment block right before the first statement after the imports:
// the Figma notes of the component.
function leadingNotes(source: ts.SourceFile) {
  const first = source.statements.find(
    (statement) =>
      !ts.isImportDeclaration(statement) &&
      !(
        ts.isExpressionStatement(statement) &&
        ts.isStringLiteral(statement.expression)
      )
  )
  if (!first) return []

  const ranges = ts.getLeadingCommentRanges(source.text, first.getFullStart())
  if (!ranges) return []

  const lines = ranges
    .map((range) => source.text.slice(range.pos, range.end))
    .flatMap((comment) =>
      comment
        .replace(/^\/\*\*?|\*\/$/g, "")
        .split("\n")
        .map((line) => line.replace(/^\s*(\/\/|\*)\s?/, "").trimEnd())
    )

  // Paragraphs: a line starting with "- " is a list item, others join up.
  const paragraphs: string[] = []
  for (const line of lines) {
    if (!line.trim()) {
      paragraphs.push("")
    } else if (line.startsWith("- ") || paragraphs.length === 0) {
      paragraphs.push(line)
    } else {
      const last = paragraphs.length - 1
      paragraphs[last] = paragraphs[last]
        ? `${paragraphs[last]} ${line.trim()}`
        : line
    }
  }
  return paragraphs.filter(Boolean)
}

function propsOf(type: ts.TypeNode, source: ts.SourceFile): Prop[] {
  if (ts.isIntersectionTypeNode(type)) {
    return type.types.flatMap((part) => propsOf(part, source))
  }
  if (ts.isParenthesizedTypeNode(type)) {
    return propsOf(type.type, source)
  }
  if (!ts.isTypeLiteralNode(type)) return []

  return type.members.flatMap((member) => {
    if (!ts.isPropertySignature(member) || !member.type) return []
    return [
      {
        name: member.name.getText(source),
        type: text(member.type, source),
        optional: Boolean(member.questionToken),
        doc: jsDoc(member),
      },
    ]
  })
}

function variantsOf(call: ts.CallExpression, source: ts.SourceFile): Variant[] {
  const config = call.arguments[1]
  if (!config || !ts.isObjectLiteralExpression(config)) return []

  const property = (name: string) =>
    config.properties.find(
      (prop): prop is ts.PropertyAssignment =>
        ts.isPropertyAssignment(prop) && prop.name.getText(source) === name
    )?.initializer

  const variants = property("variants")
  const defaults = property("defaultVariants")
  if (!variants || !ts.isObjectLiteralExpression(variants)) return []

  const defaultOf = (name: string) => {
    if (!defaults || !ts.isObjectLiteralExpression(defaults)) return undefined
    const prop = defaults.properties.find(
      (p): p is ts.PropertyAssignment =>
        ts.isPropertyAssignment(p) && p.name.getText(source) === name
    )
    return prop
      ? prop.initializer.getText(source).replace(/^"|"$/g, "")
      : undefined
  }

  return variants.properties.flatMap((prop) => {
    if (
      !ts.isPropertyAssignment(prop) ||
      !ts.isObjectLiteralExpression(prop.initializer)
    ) {
      return []
    }
    const name = prop.name.getText(source).replace(/^"|"$/g, "")
    return [
      {
        name,
        options: prop.initializer.properties.map((option) =>
          (option.name?.getText(source) ?? "").replace(/^"|"$/g, "")
        ),
        default: defaultOf(name),
      },
    ]
  })
}

function document(file: string): ComponentDoc {
  const sourceText = readFileSync(path.join(sourceDir, file), "utf8")
  const source = ts.createSourceFile(
    file,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )

  const doc: ComponentDoc = {
    file,
    title: title(file),
    summary: "",
    notes: leadingNotes(source),
    exports: [],
    variants: new Map(),
    props: new Map(),
    ...storyDocs(file),
  }

  const functionDocs = new Map<string, string>()

  function visit(node: ts.Node) {
    if (
      ts.isExportDeclaration(node) &&
      node.exportClause &&
      ts.isNamedExports(node.exportClause)
    ) {
      for (const element of node.exportClause.elements) {
        doc.exports.push(
          `${element.isTypeOnly ? "type " : ""}${element.name.text}`
        )
      }
    }

    if (ts.isTypeAliasDeclaration(node) && /Props$/.test(node.name.text)) {
      const props = propsOf(node.type, source).filter((prop) => prop.doc)
      if (props.length) doc.props.set(node.name.text, props)
    }

    if (
      ts.isFunctionDeclaration(node) &&
      node.name &&
      /^[A-Z]/.test(node.name.text)
    ) {
      const description = jsDoc(node)
      if (description) functionDocs.set(node.name.text, description)
      const param = node.parameters[0]
      if (param?.type && !ts.isTypeReferenceNode(param.type)) {
        const props = propsOf(param.type, source).filter((prop) => prop.doc)
        if (props.length) doc.props.set(node.name.text, props)
      }
    }

    if (
      ts.isVariableDeclaration(node) &&
      node.initializer &&
      ts.isCallExpression(node.initializer) &&
      node.initializer.expression.getText(source) === "cva"
    ) {
      const variants = variantsOf(node.initializer, source)
      if (variants.length) doc.variants.set(node.name.getText(source), variants)
    }

    ts.forEachChild(node, visit)
  }
  visit(source)

  // Function JSDoc (when there is one) becomes a "Parts" note.
  const parts = [...functionDocs].map(
    ([name, description]) => `- \`${name}\`: ${description}`
  )
  if (parts.length) doc.notes.push("", "Parts:", ...parts)

  const firstNote =
    doc.notes.find((note) => note && !note.startsWith("- ")) ?? ""
  doc.summary = (doc.description || firstNote).split(/(?<=\.)\s/)[0] ?? ""
  return doc
}

function markdown(doc: ComponentDoc) {
  const values = doc.exports.filter((name) => !name.startsWith("type "))
  const types = doc.exports
    .filter((name) => name.startsWith("type "))
    .map((name) => name.slice(5))
  const main = values.find((name) => /^[A-Z]/.test(name)) ?? values[0]

  const lines = [
    `<!-- Generated by scripts/build-guidelines.ts from components/ui/${doc.file}. Do not edit. -->`,
    "",
    `# ${doc.title}`,
    "",
    "```tsx",
    `import { ${values.join(", ")} } from "@lucasdost/design-system"`,
    "```",
    "",
  ]

  if (doc.description) {
    lines.push(doc.description, "")
  }

  if (doc.example) {
    lines.push(
      "## Example",
      "",
      "From the Storybook story; names like `args` or `label` are the story controls.",
      "",
      "```tsx",
      doc.example,
      "```",
      ""
    )
  }

  if (doc.notes.length) {
    lines.push("## Figma notes", "")
    for (const note of doc.notes) lines.push(note)
    lines.push("")
  }

  if (doc.variants.size) {
    lines.push("## Variants", "")
    for (const [name, variants] of doc.variants) {
      lines.push(`\`${name}\` (cva):`, "")
      lines.push("| Prop | Options | Default |", "| --- | --- | --- |")
      for (const variant of variants) {
        lines.push(
          `| \`${variant.name}\` | ${variant.options.map((o) => `\`${o}\``).join(", ")} | ${variant.default ? `\`${variant.default}\`` : "—"} |`
        )
      }
      lines.push("")
    }
  }

  if (doc.props.size) {
    lines.push("## Props", "")
    lines.push(
      "Documented props only; every component also accepts the props of the element or Base UI part it renders (`className`, events, ARIA…).",
      ""
    )
    for (const [name, props] of doc.props) {
      lines.push(`\`${name}\`:`, "")
      lines.push("| Prop | Type | Description |", "| --- | --- | --- |")
      for (const prop of props) {
        const type = prop.type.replace(/\|/g, "\\|")
        lines.push(
          `| \`${prop.name}${prop.optional ? "?" : ""}\` | \`${type}\` | ${prop.doc} |`
        )
      }
      lines.push("")
    }
  }

  if (types.length) {
    lines.push(
      "## Types",
      "",
      types.map((name) => `\`${name}\``).join(", "),
      ""
    )
  }

  lines.push(
    "## Rules",
    "",
    `- Import \`${main}\` from \`@lucasdost/design-system\`. Do not rebuild it with plain HTML and Tailwind classes.`,
    "- Style it through its props and variants first. Use `className` only for layout (margin, width, grid placement), never to change its colors, typography or radius.",
    "- Colors come from the S0L tokens; see [color](../foundations/color.md).",
    ""
  )

  return lines.join("\n")
}

const docs = readdirSync(sourceDir)
  .filter((file) => file.endsWith(".tsx"))
  .sort()
  .map(document)

mkdirSync(outDir, { recursive: true })
for (const doc of docs) {
  writeFileSync(
    path.join(outDir, doc.file.replace(/\.tsx$/, ".md")),
    markdown(doc)
  )
}

const overview = [
  "<!-- Generated by scripts/build-guidelines.ts. Do not edit. -->",
  "",
  "# Components",
  "",
  "Every component is a named export of `@lucasdost/design-system`. Read the file of a component before using it: it lists its parts, variants and props.",
  "",
  "| Component | What it is | File | Exports |",
  "| --- | --- | --- | --- |",
  ...docs.map((doc) => {
    const name = doc.file.replace(/\.tsx$/, "")
    const values = doc.exports.filter(
      (e) => !e.startsWith("type ") && /^[A-Z]/.test(e)
    )
    return `| ${doc.title} | ${doc.summary.replace(/\|/g, "\\|")} | [${name}.md](./${name}.md) | ${values.map((v) => `\`${v}\``).join(", ")} |`
  }),
  "",
]
writeFileSync(path.join(outDir, "overview.md"), overview.join("\n"))

console.log(`guidelines/components: ${docs.length} components`)
