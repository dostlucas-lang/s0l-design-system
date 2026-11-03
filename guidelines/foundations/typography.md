# Typography

The Figma text styles are Tailwind utilities that set size, line height,
weight and letter spacing together. Combine one of them with a text color.

| Utility | Use for |
| --- | --- |
| `text-heading-x-large` | Page title on large screens, hero numbers. |
| `text-heading-large` | Page title. |
| `text-heading-medium` | Section title. |
| `text-heading-small` | Card and panel titles. |
| `text-body-large` | Lead paragraphs. |
| `text-body-medium` | Default body text. |
| `text-body-small` | Captions, helper text, metadata. |
| `text-label-large` / `-medium` / `-small` | Short UI text: labels, tabs, table headers, values. |

Families:

- `font-primary` (Barlow) is the default for everything (`font-sans`).
- `font-secondary` (Inter) only where the Figma file uses it.
- `font-mono` (Geist Mono) for code and keyboard keys (`Kbd`).

## Rules

- Always use a text style utility; never `text-sm`, `text-2xl`, `font-bold`
  or arbitrary sizes.
- Pair it with a color token: `text-heading-medium text-text-primary`,
  `text-body-small text-text-secondary`.
- One `text-heading-large` per screen. Don't skip levels for visual effect.
- Use `cn()` from the package to merge classes: it keeps both the text style
  and the text color.
