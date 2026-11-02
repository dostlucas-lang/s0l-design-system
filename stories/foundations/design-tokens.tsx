import globalsCss from "@/app/globals.css?raw"
import { cn } from "@/lib/utils"
import { tokens } from "@/tokens/data"
import {
  cssVar,
  getCollection,
  isColor,
  parseAlias,
  resolve,
  sizeKeys,
  slug,
  type TokenRef,
  type TokenValue,
} from "@/tokens/lib"
import { TokenSection } from "./token-section"

type SwatchKind = "fill" | "text" | "border"

// Literal classes so Tailwind generates them (template strings are not scanned).
const shadowClasses: Record<string, string> = {
  "X-Small": "shadow-xs",
  Small: "shadow-sm",
  Medium: "shadow-md",
  Large: "shadow-lg",
  "X-Large": "shadow-xl",
}

const checkerboard = {
  backgroundImage: "repeating-conic-gradient(#d4d4d8 0 25%, #ffffff 0 50%)",
  backgroundSize: "8px 8px",
}

const primitives = getCollection(tokens, "Primitives")
const device = getCollection(tokens, "Device")
const accent = getCollection(tokens, "Accent")
const mode = getCollection(tokens, "Mode")

function varOf(collection: string, path: string) {
  return cssVar({ collection, path })
}

function px(value: TokenValue) {
  return typeof value === "number" ? `${value}px` : String(value)
}

// "Primitives:Gray/900" reads as "Gray/900"; other collections keep a prefix.
function describe(ref: TokenRef | undefined, value: TokenValue) {
  if (!ref) {
    return String(value)
  }

  return ref.collection === "Primitives"
    ? ref.path
    : `${ref.collection} · ${ref.path}`
}

function swatchKind(path: string): SwatchKind {
  const leaf = path.split("/").pop()

  if (
    path.startsWith("Text/") ||
    path.startsWith("Icon/") ||
    path.startsWith("Toast/Icon/") ||
    leaf === "Label" ||
    leaf === "Icon"
  ) {
    return "text"
  }

  if (path.startsWith("Border/") || leaf === "Border") {
    return "border"
  }

  return "fill"
}

// Foreground tokens meant for a specific surface are previewed on that surface.
function surfaceFor(path: string) {
  const button = path.match(/^Button\/Primary\/(\w+)\/(Label|Icon)$/)

  if (button) {
    return varOf("Mode", `Button/Primary/${button[1]}/Background`)
  }

  if (path.includes("Inverse")) {
    return varOf("Mode", "Background/Inverse/Default")
  }

  if (path.includes("On Color")) {
    return varOf("Mode", "Background/Accent/Strong")
  }

  if (path.includes("On White")) {
    return varOf("Mode", "Background/White")
  }

  return varOf("Mode", "Background/Primary")
}

const utilityPrefix: Record<SwatchKind, string> = {
  fill: "bg",
  text: "text",
  border: "border",
}

function groupBy<T>(items: T[], key: (item: T) => string) {
  const groups = new Map<string, T[]>()

  for (const item of items) {
    const name = key(item)
    groups.set(name, [...(groups.get(name) ?? []), item])
  }

  return [...groups]
}

function TokenName({ children }: { children: React.ReactNode }) {
  return <code className="font-mono text-xs">{children}</code>
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="w-full max-w-3xl text-sm text-muted-foreground">{children}</p>
  )
}

// Renders a token live from CSS inside a forced light or dark scope, so it
// follows the current accent and any change to app/tokens.css.
function ThemedSwatch({
  theme,
  variable,
  kind,
  surface = "--s0l-background-primary",
}: {
  theme: "light" | "dark"
  variable: string
  kind: SwatchKind
  surface?: string
}) {
  return (
    <div
      className={cn(
        theme,
        "flex h-10 flex-1 items-center justify-center rounded-md border p-1"
      )}
      style={{ background: `var(${surface})` }}
      title={`${theme}: var(${variable})`}
    >
      {kind === "fill" && (
        <div
          className="size-full rounded-sm"
          style={{ background: `var(${variable})` }}
        />
      )}
      {kind === "text" && (
        <span
          className="text-lg font-semibold"
          style={{ color: `var(${variable})` }}
        >
          Aa
        </span>
      )}
      {kind === "border" && (
        <div
          className="size-full rounded-sm"
          style={{ border: `2px solid var(${variable})` }}
        />
      )}
    </div>
  )
}

function CollectionSummary() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {tokens.collections.map((collection) => (
        <div
          key={collection.name}
          className="flex flex-col gap-1 rounded-lg border bg-card p-4"
        >
          <p className="font-medium">{collection.name}</p>
          <p className="text-2xl font-semibold">
            {Object.keys(collection.variables).length}
          </p>
          <p className="text-xs text-muted-foreground">
            {collection.modes.length} mode
            {collection.modes.length > 1 && "s"}: {collection.modes.join(", ")}
          </p>
        </div>
      ))}
    </div>
  )
}

function SemanticColors() {
  const names = Object.keys(mode.variables)
  const [light, dark] = mode.modes

  return groupBy(names, (name) => name.split("/")[0]).map(([group, items]) => (
    <TokenSection key={group} title={`Mode · ${group}`}>
      <div className="grid w-full gap-2 lg:grid-cols-2">
        {items.map((name) => {
          const ref = { collection: "Mode", path: name }
          const variable = cssVar(ref)
          const kind = swatchKind(name)
          const [lightRef, darkRef] = [0, 1].map(
            (index) => resolve(tokens, ref, { Mode: index }).chain[0]
          )
          const [lightValue, darkValue] = [0, 1].map(
            (index) => resolve(tokens, ref, { Mode: index }).value
          )

          return (
            <div
              key={name}
              className="flex items-center gap-3 rounded-lg border p-2"
              title={variable}
            >
              <div className="flex w-24 shrink-0 gap-1">
                <ThemedSwatch
                  theme="light"
                  variable={variable}
                  kind={kind}
                  surface={surfaceFor(name)}
                />
                <ThemedSwatch
                  theme="dark"
                  variable={variable}
                  kind={kind}
                  surface={surfaceFor(name)}
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="truncate text-sm font-medium">{name}</p>
                <p className="truncate font-mono text-xs text-muted-foreground">
                  {utilityPrefix[kind]}-{slug(name)}
                </p>
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  {light}: {describe(lightRef, lightValue)} · {dark}:{" "}
                  {describe(darkRef, darkValue)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </TokenSection>
  ))
}

function AccentMatrix() {
  const names = Object.keys(accent.variables)

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-separate border-spacing-1 text-xs">
        <thead>
          <tr>
            <th className="text-left font-mono font-normal text-muted-foreground">
              Variable
            </th>
            {accent.modes.map((name) => (
              <th key={name} className="font-medium">
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {names.map((name) => (
            <tr key={name}>
              <td
                className="pr-2 font-mono whitespace-nowrap"
                title={varOf("Accent", name)}
              >
                {name}
              </td>
              {accent.modes.map((modeName, index) => {
                const { value, chain } = resolve(
                  tokens,
                  { collection: "Accent", path: name },
                  { Accent: index }
                )

                return (
                  <td key={modeName}>
                    <div
                      className="h-7 min-w-10 rounded-sm"
                      style={checkerboard}
                      title={`${chain[0]?.path} · ${value}`}
                    >
                      <div
                        className="size-full rounded-sm"
                        style={{ background: String(value) }}
                      />
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PrimitiveColors() {
  const colors = Object.entries(primitives.variables).filter(([, value]) =>
    isColor(value as TokenValue)
  )

  const groups = groupBy(colors, ([name]) =>
    name.includes("/") ? name.slice(0, name.lastIndexOf("/")) : "Base"
  )

  return (
    <div className="flex w-full flex-col gap-5">
      {groups.map(([group, items]) => (
        <div key={group} className="flex flex-col gap-2">
          <p className="text-sm font-medium">{group}</p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-11">
            {items.map(([name, value]) => (
              <div
                key={name}
                className="flex min-w-0 flex-col gap-1"
                title={`${varOf("Primitives", name)} · bg-${slug(name)}`}
              >
                <div className="h-10 rounded-md border" style={checkerboard}>
                  <div
                    className="size-full rounded-[inherit]"
                    style={{ background: String(value) }}
                  />
                </div>
                <span className="font-mono text-[11px]">
                  {name.split("/").pop()}
                </span>
                <span className="truncate font-mono text-[10px] text-muted-foreground">
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function primitivesStartingWith(prefix: string) {
  return Object.entries(primitives.variables)
    .filter(([name]) => name.startsWith(prefix))
    .map(([name, value]) => ({
      name,
      leaf: name.slice(prefix.length),
      value: value as TokenValue,
      variable: varOf("Primitives", name),
    }))
}

function Spacing() {
  return (
    <div className="flex w-full flex-col gap-2">
      {primitivesStartingWith("Space/").map((space) => (
        <div key={space.name} className="flex items-center gap-4">
          <span className="w-12 font-mono text-xs">{space.leaf}</span>
          <div
            className="h-3 shrink-0 rounded-sm bg-primary"
            style={{ width: `var(${space.variable})` }}
          />
          <span className="font-mono text-xs text-muted-foreground">
            {px(space.value)} · {space.variable} · Tailwind{" "}
            {Number(space.value) / 4}
          </span>
        </div>
      ))}
    </div>
  )
}

function Radius() {
  return (
    <div className="flex flex-wrap gap-6">
      {primitivesStartingWith("Border/Radius/").map((radius) => (
        <div key={radius.name} className="flex flex-col items-center gap-2">
          <div
            className="size-16 border-2 border-primary bg-primary/10"
            style={{ borderRadius: `var(${radius.variable})` }}
          />
          <span className="text-sm font-medium">{radius.leaf}</span>
          <span className="font-mono text-xs">
            rounded-{sizeKeys[radius.leaf]}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            {px(radius.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

function BorderWidths() {
  return (
    <div className="flex flex-wrap gap-6">
      {primitivesStartingWith("Border/Width/").map((width) => (
        <div key={width.name} className="flex flex-col items-center gap-2">
          <div
            className="size-16 rounded-md border-solid border-foreground"
            style={{ borderWidth: `var(${width.variable})` }}
          />
          <span className="text-sm font-medium">{width.leaf}</span>
          <span className="font-mono text-[11px] text-muted-foreground">
            {px(width.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

function FontFamilies() {
  return (
    <div className="flex w-full flex-col divide-y">
      {primitivesStartingWith("Text/Font Family/").map((family) => (
        <div
          key={family.name}
          className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between"
        >
          <span
            className="text-2xl"
            style={{ fontFamily: `var(${family.variable})` }}
          >
            The quick brown fox jumps over the lazy dog
          </span>
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            {family.leaf} · {String(family.value)} · font-{slug(family.leaf)}
          </span>
        </div>
      ))}
    </div>
  )
}

function FontWeights() {
  return (
    <div className="flex flex-wrap gap-6">
      {primitivesStartingWith("Text/Font Weight/").map((weight) => (
        <div key={weight.name} className="flex flex-col gap-1">
          <span
            className="text-2xl"
            style={{ fontWeight: `var(${weight.variable})` }}
          >
            Aa
          </span>
          <span className="text-xs font-medium">{weight.leaf}</span>
          <span className="font-mono text-[11px] text-muted-foreground">
            {String(weight.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

function FontSizes() {
  // Device tokens alias the primitive sizes; show which ones use each size.
  const usedBy = new Map<string, string[]>()

  for (const name of Object.keys(device.variables)) {
    const target = parseAlias(device.variables[name] as TokenValue)?.path

    if (target) {
      usedBy.set(target, [...(usedBy.get(target) ?? []), name])
    }
  }

  return (
    <div className="flex w-full flex-col divide-y">
      {primitivesStartingWith("Text/Font Size/").map((size) => (
        <div
          key={size.name}
          className="flex flex-col gap-1 py-2 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
        >
          <span
            className="truncate"
            style={{ fontSize: `var(${size.variable})` }}
          >
            Design system
          </span>
          <span className="shrink-0 font-mono text-xs text-muted-foreground sm:text-right">
            {size.leaf} · {px(size.value)}
            {usedBy.has(size.name) && (
              <>
                <br />
                Device:{" "}
                {usedBy
                  .get(size.name)!
                  .map((name) => name.replace("/Font Size", ""))
                  .join(", ")}
              </>
            )}
          </span>
        </div>
      ))}
    </div>
  )
}

function TextStyles() {
  return (
    <div className="flex w-full flex-col divide-y">
      {Object.entries(tokens.styles.text).map(([name, style]) => {
        const size = parseAlias(style.fontSize)!
        const weight = parseAlias(style.fontWeight)!
        const family = parseAlias(style.fontFamily)!

        return (
          <div
            key={name}
            className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
          >
            <span
              className="truncate"
              style={{
                fontFamily: `var(${cssVar(family)})`,
                fontSize: `var(${cssVar(size)})`,
                fontWeight: `var(${cssVar(weight)})`,
                lineHeight: style.lineHeight,
              }}
            >
              {name}
            </span>
            <span className="shrink-0 font-mono text-xs text-muted-foreground sm:text-right">
              text-{slug(name)}
              <br />
              {px(resolve(tokens, size).value)} ·{" "}
              {String(resolve(tokens, weight).value)} · {style.lineHeight * 100}
              %
            </span>
          </div>
        )
      })}
    </div>
  )
}

function Shadows() {
  return (
    <div className="flex flex-wrap gap-6">
      {Object.entries(tokens.styles.effect).map(([name, style]) => {
        const leaf = name.split("/").pop()!

        return (
          <div key={name} className="flex flex-col items-center gap-2">
            <div
              className={cn(shadowClasses[leaf], "size-24 rounded-lg bg-card")}
            />
            <span className="text-sm font-medium">{leaf}</span>
            <span className="font-mono text-xs">{shadowClasses[leaf]}</span>
            <span className="font-mono text-[11px] text-muted-foreground">
              {style.layers
                .map((l) => `${l.y}/${l.blur}/${l.spread}`)
                .join(" + ")}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// The shadcn layer in globals.css aliases every shadcn variable to an S0L token.
function readShadcnAliases() {
  const block =
    globalsCss.match(
      /:root,\s*\.light,\s*\.dark,\s*\[data-accent\]\s*\{([^}]*)\}/
    )?.[1] ?? ""

  return [...block.matchAll(/--([\w-]+):\s*var\((--[\w-]+)\);/g)].map(
    ([, name, token]) => ({ name, token })
  )
}

function ShadcnMapping() {
  return (
    <div className="grid w-full gap-2 lg:grid-cols-2">
      {readShadcnAliases()
        .filter(({ name }) => name !== "radius")
        .map(({ name, token }) => (
          <div
            key={name}
            className="flex items-center gap-3 rounded-lg border p-2"
          >
            <div className="flex w-24 shrink-0 gap-1">
              <ThemedSwatch theme="light" variable={`--${name}`} kind="fill" />
              <ThemedSwatch theme="dark" variable={`--${name}`} kind="fill" />
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <TokenName>--{name}</TokenName>
              <span className="truncate font-mono text-xs text-muted-foreground">
                → {token}
              </span>
            </div>
          </div>
        ))}
    </div>
  )
}

export function DesignTokens() {
  return (
    <>
      <Note>
        Tokens mirror the variable collections of the{" "}
        <a
          href={tokens.$source.url}
          className="underline underline-offset-3 hover:text-foreground"
        >
          {tokens.$source.file}
        </a>{" "}
        Figma file (synced {tokens.$source.syncedAt}). The snapshot lives in{" "}
        <TokenName>tokens/s0l.tokens.json</TokenName>;{" "}
        <TokenName>npm run tokens</TokenName> generates{" "}
        <TokenName>app/tokens.css</TokenName> with one CSS variable per Figma
        variable (<TokenName>--s0l-*</TokenName>), keeping aliases as{" "}
        <TokenName>var()</TokenName> references, plus the Tailwind utilities.
        shadcn variables in <TokenName>app/globals.css</TokenName> are aliases
        of these tokens.
      </Note>

      <TokenSection title="Collections">
        <CollectionSummary />
      </TokenSection>

      <TokenSection title="Accent">
        <div className="flex w-full flex-col gap-4">
          <Note>
            Each Accent mode is a <TokenName>data-accent</TokenName> value. Set
            it on <TokenName>&lt;html&gt;</TokenName> or any element to re-theme
            that subtree; Mode tokens that alias Accent (and shadcn colors like{" "}
            <TokenName>--primary</TokenName>) follow. Pick one in the Accent
            menu of the Storybook toolbar to re-theme every story.
          </Note>
          <AccentMatrix />
        </div>
      </TokenSection>

      <SemanticColors />

      <TokenSection title="Primitives · Colors">
        <PrimitiveColors />
      </TokenSection>

      <TokenSection title="Primitives · Space">
        <div className="flex w-full flex-col gap-3">
          <Note>
            Every step is a multiple of Tailwind&apos;s 4px spacing unit, so
            Space/500 (16px) is <TokenName>p-4</TokenName>,{" "}
            <TokenName>gap-4</TokenName>…
          </Note>
          <Spacing />
        </div>
      </TokenSection>

      <TokenSection title="Primitives · Border radius">
        <Radius />
      </TokenSection>

      <TokenSection title="Primitives · Border width">
        <BorderWidths />
      </TokenSection>

      <TokenSection title="Primitives · Font families">
        <FontFamilies />
      </TokenSection>

      <TokenSection title="Primitives · Font weights">
        <FontWeights />
      </TokenSection>

      <TokenSection title="Primitives · Font sizes">
        <FontSizes />
      </TokenSection>

      <TokenSection title="Text styles">
        <TextStyles />
      </TokenSection>

      <TokenSection title="Effect styles">
        <Shadows />
      </TokenSection>

      <TokenSection title="shadcn mapping">
        <ShadcnMapping />
      </TokenSection>
    </>
  )
}
