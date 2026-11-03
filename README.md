# @s0l/design-system

React components, design tokens and a Tailwind CSS v4 theme for the
[[S0L] DESIGN SYSTEM](https://www.figma.com/design/kwq7CHuZ7LHDCjTQojAisa/-S0L--DESIGN-SYSTEM)
Figma file. Built for Vite apps and [Figma Make](https://help.figma.com/hc/en-us/articles/43602872461079-Bring-your-design-system-package-to-a-Make-kit) kits.

## Use it in an app

```bash
npm install @s0l/design-system
```

Requires React 19. With Tailwind CSS v4 (Figma Make, Vite + Tailwind), in the
main CSS file:

```css
@import "tailwindcss";
@import "@s0l/design-system/theme.css";
```

Without Tailwind, import the precompiled CSS instead:

```ts
import "@s0l/design-system/styles.css"
```

In both cases, load the fonts once in the app entry and use the components:

```tsx
import "@s0l/design-system/fonts.css"
import { Button, ThemeProvider } from "@s0l/design-system"

export function App() {
  return (
    <ThemeProvider>
      <Button>Get started</Button>
    </ThemeProvider>
  )
}
```

[guidelines/](./guidelines/Guidelines.md) explains the setup, the tokens and
every component; Figma Make reads it from the package.

### Package entry points

| Import | Content |
| --- | --- |
| `@s0l/design-system` | Every component, `ThemeProvider`, `useTheme`, `cn`. |
| `@s0l/design-system/tokens` | The Figma variables as data, with helpers. |
| `@s0l/design-system/tokens.json` | The raw Figma variables snapshot. |
| `@s0l/design-system/theme.css` | Tailwind v4 theme: tokens as utilities, base styles, component classes. |
| `@s0l/design-system/styles.css` | Precompiled CSS for apps without Tailwind. |
| `@s0l/design-system/tokens.css` | Only the `--s0l-*` CSS variables. |
| `@s0l/design-system/fonts.css` | Barlow, Inter and Geist Mono (@fontsource). |

## Develop

Node 22.18 or later (the scripts in `scripts/` are TypeScript run by Node).

```bash
npm install
npm run storybook        # http://localhost:6006
npm run build            # the package, in dist/
npm run check:package    # publint + Are The Types Wrong
```

### Storybook

Tokens and components are documented and tested in Storybook. Use the toolbar
to switch between light and dark mode and between the Accent modes. Stories
live in `stories/`: `foundations/` for the tokens page and `components/` for
one file per component in `components/ui`.

```bash
npm run build-storybook  # static build in storybook-static/
```

### Tokens

`tokens/s0l.tokens.json` is a snapshot of the Figma variables.
`npm run tokens` generates `styles/tokens.css` from it: one CSS variable per
Figma variable (`--s0l-*`) plus the Tailwind utilities. The shadcn variables in
`styles/theme.css` are aliases of these tokens.

### Styles

| File | Role |
| --- | --- |
| `styles/theme.css` | The S0L theme (published as `theme.css`). |
| `styles/tokens.css` | Generated from the Figma variables. |
| `styles/shadcn.css` | Vendored copy of `shadcn/tailwind.css`. |
| `styles/fonts.css` | The @fontsource imports. |
| `styles/globals.css` | Storybook entry: Tailwind + fonts + theme. |
| `styles/build.css` | Entry of the precompiled `styles.css`. |

### Adding a component

```bash
npx shadcn@latest add button
```

This places the component in `components/ui`; restyle it with the S0L tokens
to match Figma. Then:

1. Export it from `src/index.ts` (`npm run build` fails when one is missing).
2. Add `stories/components/<name>.stories.tsx` with controls for its props and
   Figma variants (see `button.stories.tsx`), with a `docs.description.component`.
3. Run `npm run guidelines`: `guidelines/components/<name>.md` is generated
   from the comments of the component and its story.

### Publishing

1. Bump `version` in `package.json` (semver: a removed or renamed prop,
   variant or token is a major change).
2. `npm publish` runs the build and the package checks first
   (`prepublishOnly`). The GitHub workflow `publish.yml` does the same when a
   release is published.
