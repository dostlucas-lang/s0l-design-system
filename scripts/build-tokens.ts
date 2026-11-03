// Generates styles/tokens.css from tokens/s0l.tokens.json (the Figma variables snapshot).
// Run with `npm run tokens`.

import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

import {
  cssVar,
  getCollection,
  isColor,
  modeValues,
  parseAlias,
  resolve,
  sizeKeys,
  slug,
  valueToCss,
  type Collection,
  type TokenFile,
} from "../tokens/lib.ts"

const root = path.resolve(import.meta.dirname, "..")
const source = path.join(root, "tokens/s0l.tokens.json")
const output = path.join(root, "styles/tokens.css")

const file: TokenFile = JSON.parse(readFileSync(source, "utf8"))

function declarations(collection: Collection, modeIndex: number) {
  return Object.keys(collection.variables).map((name) => {
    const value = modeValues(collection, name)[modeIndex]
    const ref = { collection: collection.name, path: name }
    return `  ${cssVar(ref)}: ${valueToCss(name, value)};`
  })
}

function block(selectors: string[], lines: string[]) {
  return `${selectors.join(",\n")} {\n${lines.join("\n")}\n}`
}

// Fail fast on two Figma variables collapsing into the same CSS name.
function assertUniqueNames() {
  const seen = new Map<string, string>()

  for (const collection of file.collections) {
    for (const name of Object.keys(collection.variables)) {
      const variable = cssVar({ collection: collection.name, path: name })
      const id = `${collection.name}:${name}`
      const previous = seen.get(variable)

      if (previous) {
        throw new Error(`${id} and ${previous} both map to ${variable}`)
      }

      seen.set(variable, id)
    }
  }
}

// Every alias must point at an existing variable.
function assertAliases() {
  for (const collection of file.collections) {
    for (const name of Object.keys(collection.variables)) {
      collection.modes.forEach((_, index) =>
        resolve(
          file,
          { collection: collection.name, path: name },
          {
            [collection.name]: index,
          }
        )
      )
    }
  }
}

function primitives() {
  const collection = getCollection(file, "Primitives")
  return `/* Primitives — raw values */\n${block([":root"], declarations(collection, 0))}`
}

function device() {
  const collection = getCollection(file, "Device")
  return `/* Device · ${collection.modes[0]} — responsive type scale */\n${block([":root"], declarations(collection, 0))}`
}

// Each Accent mode is a data-accent value; the first mode is the default.
function accent() {
  const collection = getCollection(file, "Accent")

  const blocks = collection.modes.map((mode, index) => {
    const selector = `[data-accent="${slug(mode)}"]`
    const selectors = index === 0 ? [":root", selector] : [selector]
    return block(selectors, declarations(collection, index))
  })

  return `/* Accent — set data-accent="${collection.modes.map(slug).join(" | ")}" on any element */\n${blocks.join("\n\n")}`
}

// Mode tokens alias Accent tokens, so they are redeclared on every data-accent
// scope; otherwise they would keep the values resolved at :root.
function mode() {
  const collection = getCollection(file, "Mode")
  const [light, dark] = collection.modes

  return [
    `/* Mode · ${light} / ${dark} — semantic tokens */`,
    block([":root", ".light", "[data-accent]"], declarations(collection, 0)),
    "",
    block(
      [".dark", ".dark [data-accent]", ".dark[data-accent]"],
      declarations(collection, 1)
    ),
  ].join("\n")
}

function colorBridge(collectionName: string) {
  const collection = getCollection(file, collectionName)

  return Object.keys(collection.variables)
    .filter((name) => {
      const { value } = resolve(file, {
        collection: collectionName,
        path: name,
      })
      return isColor(value)
    })
    .map((name) => {
      const ref = { collection: collectionName, path: name }
      return `  --color-${slug(name)}: var(${cssVar(ref)});`
    })
}

function radiusBridge() {
  const collection = getCollection(file, "Primitives")

  return Object.keys(collection.variables)
    .filter((name) => name.startsWith("Border/Radius/"))
    .map((name) => {
      const key = sizeKeys[name.split("/").pop()!]
      const ref = { collection: "Primitives", path: name }
      return `  --radius-${key}: var(${cssVar(ref)});`
    })
}

function fontBridge() {
  const collection = getCollection(file, "Primitives")

  return Object.keys(collection.variables)
    .filter((name) => name.startsWith("Text/Font Family/"))
    .map((name) => {
      const ref = { collection: "Primitives", path: name }
      return `  --font-${slug(name.split("/").pop()!)}: var(${cssVar(ref)});`
    })
}

function textStyleBridge() {
  return Object.entries(file.styles.text).flatMap(([name, style]) => {
    const key = `--text-${slug(name)}`
    const size = parseAlias(style.fontSize)!
    const weight = parseAlias(style.fontWeight)!

    return [
      `  ${key}: var(${cssVar(size)});`,
      `  ${key}--line-height: ${style.lineHeight};`,
      `  ${key}--letter-spacing: ${style.letterSpacing}em;`,
      `  ${key}--font-weight: var(${cssVar(weight)});`,
    ]
  })
}

function shadowBridge() {
  return Object.entries(file.styles.effect).map(([name, style]) => {
    const key = sizeKeys[name.split("/").pop()!]
    const color = `var(${cssVar(parseAlias(style.color)!)})`
    const layers = style.layers.map(
      (layer) =>
        `${layer.x}px ${layer.y}px ${layer.blur}px ${layer.spread}px ${color}`
    )
    return `  --shadow-${key}: ${layers.join(", ")};`
  })
}

function tailwindBridge() {
  return [
    "/* Tailwind bridge — exposes the tokens as utilities (bg-background-surface, text-text-secondary, rounded-lg, text-heading-large, shadow-md…) */",
    "@theme inline {",
    ...fontBridge(),
    "",
    ...colorBridge("Primitives"),
    "",
    ...colorBridge("Mode"),
    "",
    ...radiusBridge(),
    "",
    ...textStyleBridge(),
    "",
    ...shadowBridge(),
    "}",
  ].join("\n")
}

assertUniqueNames()
assertAliases()

const css = [
  `/*\n * Generated by scripts/build-tokens.ts from tokens/s0l.tokens.json — do not edit by hand.\n * Source: ${file.$source.file} (${file.$source.url}), synced ${file.$source.syncedAt}.\n */`,
  primitives(),
  device(),
  accent(),
  mode(),
  tailwindBridge(),
].join("\n\n")

writeFileSync(output, `${css}\n`)

const counts = file.collections
  .map((c) => `${c.name} ${Object.keys(c.variables).length}`)
  .join(", ")

console.log(`Wrote ${path.relative(root, output)} (${counts})`)
