// Builds the CSS of the published package into dist/ (after `npm run build:lib`).
// Run with `npm run build:css`.
//
// - styles.css: compiled and self-contained (Tailwind + S0L theme + the
//   utilities the components use), for apps without Tailwind.
// - theme.css, tokens.css, shadcn.css: the Tailwind v4 sources, for apps that
//   use Tailwind v4 (like Figma Make). theme.css gets an @source for the
//   compiled components, so Tailwind in the app generates their classes.
// - fonts.css: the @fontsource imports, resolved by the app's bundler.
// - s0l.tokens.json: the Figma variables snapshot.

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

import tailwind from "@tailwindcss/postcss"
import postcss from "postcss"

const root = path.resolve(import.meta.dirname, "..")
const styles = path.join(root, "styles")
const dist = path.join(root, "dist")

mkdirSync(dist, { recursive: true })

// styles.css
const entry = path.join(styles, "build.css")
const result = await postcss([
  tailwind({ base: root, optimize: false }),
]).process(readFileSync(entry, "utf8"), {
  from: entry,
  to: path.join(dist, "styles.css"),
})
writeFileSync(
  path.join(dist, "styles.css"),
  `/* @lucasdost/design-system — compiled styles (Tailwind CSS v4 + S0L theme). */\n${result.css}`
)

// Tailwind sources
for (const file of ["tokens.css", "shadcn.css", "fonts.css"]) {
  copyFileSync(path.join(styles, file), path.join(dist, file))
}

const theme = readFileSync(path.join(styles, "theme.css"), "utf8")
writeFileSync(
  path.join(dist, "theme.css"),
  `${theme}\n/* Classes used by the compiled components in this package. */\n@source "./components";\n`
)

copyFileSync(
  path.join(root, "tokens/s0l.tokens.json"),
  path.join(dist, "s0l.tokens.json")
)

const size = (file: string) =>
  `${(readFileSync(path.join(dist, file)).length / 1024).toFixed(1)} kB`
console.log(
  `dist/styles.css ${size("styles.css")}, dist/theme.css ${size("theme.css")}`
)
