# Layout

## Spacing

Use Tailwind's spacing scale (`p-4`, `gap-6`…). It matches the S0L space
tokens:

| S0L token | Value | Tailwind |
| --- | --- | --- |
| space-100 | 2px | `0.5` |
| space-200 | 4px | `1` |
| space-300 | 8px | `2` |
| space-400 | 12px | `3` |
| space-500 | 16px | `4` |
| space-600 | 24px | `6` |
| space-700 | 32px | `8` |
| space-800 | 40px | `10` |
| space-900 | 48px | `12` |
| space-1000 | 56px | `14` |
| space-1100 | 64px | `16` |
| space-1200 | 80px | `20` |
| space-1300 | 96px | `24` |
| space-1400 | 112px | `28` |

Use only these steps: no `p-5`, `gap-7` or arbitrary values.

## Radius

`rounded-none`, `rounded-xs`, `rounded-sm`, `rounded-md`, `rounded-lg`,
`rounded-xl`, `rounded-full` are the S0L border radius tokens. Components
already have theirs; use these only on your own containers.

## Shadow

`shadow-xs` … `shadow-xl` are the S0L elevations. Use `shadow-sm` for raised
cards, `shadow-lg` for floating panels; overlays from the package
(`Modal`, `Popover`, `Dropdown`, `Toast`) already have theirs.

## Page structure

- Page background: `bg-background-primary`. Sections that need separation:
  `bg-background-secondary`. Cards: use `Card`.
- Lay out with flex and grid (`flex flex-col gap-6`,
  `grid grid-cols-1 gap-4 md:grid-cols-3`).
- Mobile screens: `BottomBar` for main navigation, `BottomSheet` instead of
  `Modal`, `Drawer` for side panels.
