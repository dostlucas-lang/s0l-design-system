// Shared by scripts/build-tokens.ts (CSS generation) and the Storybook tokens page.
// Keep it free of non-erasable TypeScript so Node can run it directly.

export type TokenValue = string | number

export type Collection = {
  name: string
  modes: string[]
  variables: Record<string, TokenValue | TokenValue[]>
}

export type TextStyle = {
  fontFamily: string
  fontSize: string
  fontWeight: string
  lineHeight: number
  letterSpacing: number
}

export type EffectStyle = {
  color: string
  layers: { x: number; y: number; blur: number; spread: number }[]
}

export type TokenFile = {
  $source: { file: string; url: string; syncedAt: string }
  collections: Collection[]
  styles: {
    text: Record<string, TextStyle>
    effect: Record<string, EffectStyle>
  }
}

export type TokenRef = { collection: string; path: string }

const PREFIX = "s0l"

const ALIAS = /^\{([^:]+):(.+)\}$/

// Figma size names → Tailwind scale keys, used for radius and shadows.
export const sizeKeys: Record<string, string> = {
  None: "none",
  "X-Small": "xs",
  Small: "sm",
  Medium: "md",
  Large: "lg",
  "X-Large": "xl",
  Pill: "full",
  Focus: "focus",
}

export function slug(path: string) {
  return path
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

// Accent variables only feed the Mode collection, so they get their own namespace.
export function cssVar(ref: TokenRef) {
  const scope = ref.collection === "Accent" ? "accent-" : ""
  return `--${PREFIX}-${scope}${slug(ref.path)}`
}

export function parseAlias(value: TokenValue): TokenRef | null {
  if (typeof value !== "string") {
    return null
  }

  const match = value.match(ALIAS)
  return match ? { collection: match[1], path: match[2] } : null
}

export function modeValues(collection: Collection, path: string) {
  const value = collection.variables[path]
  return Array.isArray(value) ? value : [value]
}

export function getCollection(file: TokenFile, name: string) {
  const collection = file.collections.find((c) => c.name === name)

  if (!collection) {
    throw new Error(`Unknown collection "${name}"`)
  }

  return collection
}

export function isColor(value: TokenValue) {
  return typeof value === "string" && value.startsWith("#")
}

// Figma stores numbers as px. Sizes become rem so they follow the user's font size.
function numberToCss(path: string, value: number) {
  if (path.includes("Font Weight")) {
    return String(value)
  }

  if (path.startsWith("Border/Width") || path === "Border/Radius/Pill") {
    return `${value}px`
  }

  return value === 0 ? "0" : `${value / 16}rem`
}

// next/font exposes each family as --font-<family>; the quoted name is a fallback.
function fontFamilyToCss(family: string) {
  return `var(--font-${slug(family)}), "${family}", sans-serif`
}

export function valueToCss(path: string, value: TokenValue) {
  const alias = parseAlias(value)

  if (alias) {
    return `var(${cssVar(alias)})`
  }

  if (typeof value === "number") {
    return numberToCss(path, value)
  }

  if (path.includes("Font Family")) {
    return fontFamilyToCss(value)
  }

  return value
}

// Follows an alias chain down to a literal. `modes` picks the mode index per
// collection (defaults to the first mode); the chain lists every hop.
export function resolve(
  file: TokenFile,
  ref: TokenRef,
  modes: Record<string, number> = {}
): { value: TokenValue; chain: TokenRef[] } {
  const chain: TokenRef[] = []
  let current = ref

  for (;;) {
    const collection = getCollection(file, current.collection)
    const values = modeValues(collection, current.path)

    if (values[0] === undefined) {
      throw new Error(
        `Unknown variable "${current.collection}:${current.path}"`
      )
    }

    const value = values[modes[current.collection] ?? 0] ?? values[0]
    const alias = parseAlias(value)

    if (!alias) {
      return { value, chain }
    }

    chain.push(alias)
    current = alias
  }
}
