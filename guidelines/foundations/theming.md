# Theming

S0L has two independent sets of modes. Every color token follows both.

## Light / Dark

The `.dark` class on an element (normally `<html>`) switches everything inside
it to the dark values. `ThemeProvider` from the package manages it:

```tsx
import { ThemeProvider, useTheme } from "@lucasdost/design-system"

<ThemeProvider defaultTheme="system">{children}</ThemeProvider>

const { resolvedTheme, setTheme } = useTheme()
setTheme(resolvedTheme === "dark" ? "light" : "dark")
```

`<ThemeProvider hotkey>` also toggles the mode with the `d` key.

## Accent

`data-accent` on any element sets the accent color inside it:
`brand` (default), `orange`, `pink`, `fuchsia`, `purple`, `indigo`, `cyan`,
`teal`, `lime`.

```tsx
<html data-accent="teal">  {/* the whole app */}
<section data-accent="orange">  {/* only this section */}
```

The accent changes the `*-accent-*` tokens (primary buttons, focus rings,
selected states, accent text).

## Rules

- Never hard-code a mode: no `bg-white`, `text-black`, `dark:` overrides with
  palette colors. The tokens already switch.
- Choose one accent per product or brand area; don't mix accents on one screen
  unless the design asks for it.
