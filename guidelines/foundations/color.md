# Color

S0L colors are semantic tokens. Each one has a light and a dark value and
follows the Accent mode, so a screen built with them works in every mode.
Tailwind utilities take the token name: `bg-<token>`, `text-<token>`,
`border-<token>`, `ring-<token>`, `fill-<token>`…

## Background (`bg-background-*`)

| Token | Use for |
| --- | --- |
| `background-primary` | The page. |
| `background-secondary` | Secondary areas: side panels, page sections, wells. |
| `background-surface` | Raised surfaces: cards, panels, sheets. |
| `background-hover`, `background-pressed` | Overlays for hover and pressed states. |
| `background-overlay` | Behind modals and sheets (use `Backdrop`). |
| `background-accent-soft` / `-strong` | Accent highlight / accent fill. |
| `background-{info,success,warning,danger}-soft` / `-strong` | Status highlight / status fill. |
| `background-inverse-default` | Dark-on-light (or light-on-dark) blocks. |
| `background-disabled-soft` / `-strong` | Disabled controls. |

## Text (`text-text-*`)

| Token | Use for |
| --- | --- |
| `text-primary` | Body text and titles. |
| `text-secondary` | Supporting text, captions, placeholders. |
| `text-on-color` | Text on an accent or status `-strong` fill. |
| `text-inverse` | Text on `background-inverse-default`. |
| `text-accent-standard` / `-display` | Accent text: small / large (headings, numbers). |
| `text-{info,success,warning,danger}-standard` / `-display` | Status text. |
| `text-disabled`, `text-read-only` | Disabled and read-only values. |

## Border (`border-border-*`)

| Token | Use for |
| --- | --- |
| `border-secondary` | Default dividers and card outlines (the default `border` color). |
| `border-primary` | Input outlines. |
| `border-strong` | Emphasized outlines. |
| `border-accent-strong` | Focus and selected outlines. |
| `border-{info,success,warning,danger}-soft` / `-strong` | Status outlines. |

## Icon (`text-icon-*`)

Same roles as text: `icon-primary`, `icon-secondary`, `icon-on-color`,
`icon-inverse`, `icon-accent-standard`, `icon-{status}-standard`,
`icon-disabled`. Icons take `currentColor`, so set the icon color with
`text-icon-*` on the icon or its parent.

## Charts

`chart-1` … `chart-5` (and the `--chart-*` variables) for data series. Use the
`ChartBar`, `ChartLine` and `ChartDonut` components, which already use them.

## Rules

- Do: `bg-background-surface text-text-primary border-border-secondary`.
- Don't: `bg-white text-gray-900 border-gray-200` (breaks dark mode and the
  Accent modes).
- Don't use the raw palette (`brand-primary-600`, `gray-100`, `red-500`…) in
  screens; it exists for the semantic tokens. Use the semantic token for the role.
- Put `text-on-color` on `-strong` fills and `text-primary` on `-soft` fills.
