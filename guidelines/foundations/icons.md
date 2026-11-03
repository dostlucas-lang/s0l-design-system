# Icons

S0L uses Hugeicons (free set) drawn with the Figma 1.8 stroke.

```tsx
import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@s0l/design-system"

<HugeiconsIcon icon={Search01Icon} className="size-5 text-icon-secondary" />
```

- Always render icons through `HugeiconsIcon` from `@s0l/design-system`, never
  from `@hugeicons/react` (wrong stroke width).
- Find icons by name in `@hugeicons/core-free-icons`: names end in `Icon` and
  often have a number (`ArrowRight01Icon`, `Delete02Icon`, `UserIcon`).
- Sizes: `size-4` (16px), `size-5` (20px), `size-6` (24px).
- Color with `text-icon-*` tokens (see [color](./color.md)).
- Components take icons as props (`icon={Search01Icon}`) or as children with
  `data-icon="inline-start"` / `"inline-end"` in `Button`; check the
  component file.
