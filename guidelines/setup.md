# Setup

## Install

```bash
npm install @lucasdost/design-system
```

It needs React 19 (`react` and `react-dom` ^19). Its other dependencies
(Base UI, Hugeicons, fonts…) install with it.

## CSS

### App with Tailwind CSS v4 (Figma Make, Vite + Tailwind)

In the main CSS file, after Tailwind:

```css
@import "tailwindcss";
@import "@lucasdost/design-system/theme.css";
```

`theme.css` adds the S0L tokens as Tailwind utilities (`bg-background-primary`,
`text-heading-large`…), the base styles, and tells Tailwind to generate the
classes the components use.

### App without Tailwind

```ts
import "@lucasdost/design-system/styles.css"
```

`styles.css` is precompiled: Tailwind's base reset, the S0L theme and every
class the components use. Only the components are styled; S0L utilities you
write yourself are not generated (that needs `theme.css`).

### Fonts

In the app entry (for example `src/main.tsx`), for both setups:

```ts
import "@lucasdost/design-system/fonts.css"
```

It loads Barlow (primary), Inter (secondary) and Geist Mono, self-hosted.

## Providers

Wrap the app once:

```tsx
import { ThemeProvider, Toaster, TooltipProvider } from "@lucasdost/design-system"

export function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <Toaster>{/* routes / screens */}</Toaster>
      </TooltipProvider>
    </ThemeProvider>
  )
}
```

- `ThemeProvider` manages Light/Dark mode (the `.dark` class on `<html>`); see
  [theming](./foundations/theming.md). Use `useTheme()` to read or change it.
- `Toaster` shows the toasts sent with `toast.add({ title, description, type })`.
- `TooltipProvider` shares the open delay between tooltips.

## Imports

Everything is a named export of the package root:

```tsx
import { Button, Card, InputText, cn } from "@lucasdost/design-system"
```

- `cn(...)` merges class names and knows the S0L text styles.
- Design tokens as data: `import { tokens } from "@lucasdost/design-system/tokens"`.
