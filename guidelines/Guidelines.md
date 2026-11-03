# S0L Design System

`@lucasdost/design-system` is the S0L design system in code: 59 React components, the
S0L design tokens (the variables of the [S0L] DESIGN SYSTEM Figma file) and a
Tailwind CSS v4 theme built from them. Build every screen with these
components and tokens.

## Read first

1. [setup.md](./setup.md): install, CSS imports and providers. Do this once per app.
2. [components/overview.md](./components/overview.md): the catalog. Then open
   the file of each component you use (`components/<name>.md`).

## Foundations

Read the one you need before styling anything outside a component:

| File | When to read it |
| --- | --- |
| [foundations/color.md](./foundations/color.md) | Any color: text, background, border, icon. |
| [foundations/typography.md](./foundations/typography.md) | Any text that is not inside a component. |
| [foundations/layout.md](./foundations/layout.md) | Spacing, radius, shadows, page layout. |
| [foundations/theming.md](./foundations/theming.md) | Light/Dark mode and the Accent modes. |
| [foundations/icons.md](./foundations/icons.md) | Any icon. |

## Rules

- Use a component from `@lucasdost/design-system` whenever one exists. Do not
  rebuild buttons, inputs, cards, modals, tables or menus with plain HTML.
- Use only the S0L token utilities for color, typography, radius and shadow
  (`bg-background-primary`, `text-text-secondary`, `text-heading-large`,
  `rounded-lg`, `shadow-md`). Do not use Tailwind's default palette
  (`bg-blue-500`, `text-gray-700`) or arbitrary values (`bg-[#6530f7]`,
  `text-[15px]`).
- Do not override a component's colors, typography or radius with
  `className`. Use its props and variants; use `className` only for layout.
- Every screen must work in light and dark mode: use semantic tokens, never
  `bg-white`, `text-black` or fixed hex colors.
- Import icons from `@hugeicons/core-free-icons` and render them with
  `HugeiconsIcon` from `@lucasdost/design-system`.
