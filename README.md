# s0l design system

Next.js + shadcn/ui components styled with the tokens of the
[[S0L] DESIGN SYSTEM](https://www.figma.com/design/kwq7CHuZ7LHDCjTQojAisa/-S0L--DESIGN-SYSTEM)
Figma file.

## Storybook

Tokens and components are documented and tested in Storybook:

```bash
npm run storybook        # http://localhost:6006
npm run build-storybook  # static build in storybook-static/
```

Use the toolbar to switch between light and dark mode and between the Accent
modes. Stories live in `stories/`: `foundations/` for the tokens page and
`components/` for one file per component in `components/ui`.

When you add a component, add a `stories/components/<name>.stories.tsx` with
controls for its props and Figma variants (see `button.stories.tsx`).

## Tokens

`tokens/s0l.tokens.json` is a snapshot of the Figma variables.
`npm run tokens` generates `app/tokens.css` from it: one CSS variable per Figma
variable (`--s0l-*`) plus the Tailwind utilities. shadcn variables in
`app/globals.css` are aliases of these tokens.

## Adding shadcn components

```bash
npx shadcn@latest add button
```

This places the component in `components/ui`; then restyle it with the S0L
tokens to match Figma.
