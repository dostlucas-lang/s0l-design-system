import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Mirrors the Figma Badge component: Show Label × Color (Neutral / Accent,
// named Brand in Figma / Info / Success / Warning / Danger / Inverse /
// On Color). With a label it's a 16px pill with a 12px Medium count; without
// one it's an 8px dot centered in a 16px box. Badge Object is BadgeObject.
const badgeVariants = cva("inline-flex shrink-0 items-center justify-center", {
  variants: {
    color: {
      neutral: "",
      accent: "",
      info: "",
      success: "",
      warning: "",
      danger: "",
      inverse: "",
      "on-color": "",
    },
    showLabel: {
      true: "min-h-4 min-w-4 rounded-full px-1 text-[length:var(--s0l-text-font-size-100)] leading-none font-medium whitespace-nowrap",
      // The dot is drawn by ::before, 8px in the middle of the 16px box.
      false:
        "size-4 before:size-2 before:rounded-full before:bg-(--badge-dot) before:content-['']",
    },
  },
  compoundVariants: [
    // Show Label=True.
    {
      showLabel: true,
      color: "neutral",
      className: "bg-background-disabled-soft text-text-secondary",
    },
    {
      showLabel: true,
      color: "accent",
      className: "bg-background-accent-strong text-text-on-color",
    },
    {
      showLabel: true,
      color: "inverse",
      className: "bg-background-primary text-text-primary",
    },
    {
      showLabel: true,
      color: "on-color",
      className: "bg-background-white text-text-on-white",
    },
    // Show Label=False: the dot color.
    {
      showLabel: false,
      color: "neutral",
      className: "[--badge-dot:var(--s0l-background-secondary)]",
    },
    {
      showLabel: false,
      color: "accent",
      className: "[--badge-dot:var(--s0l-icon-accent-display)]",
    },
    {
      showLabel: false,
      color: "info",
      className: "[--badge-dot:var(--s0l-icon-info-display)]",
    },
    {
      showLabel: false,
      color: "success",
      className: "[--badge-dot:var(--s0l-icon-success-display)]",
    },
    {
      showLabel: false,
      color: "warning",
      className: "[--badge-dot:var(--s0l-icon-warning-display)]",
    },
    {
      showLabel: false,
      color: "danger",
      className: "[--badge-dot:var(--s0l-icon-danger-display)]",
    },
    {
      showLabel: false,
      color: "inverse",
      className: "[--badge-dot:var(--s0l-background-primary)]",
    },
    {
      showLabel: false,
      color: "on-color",
      className: "[--badge-dot:var(--s0l-background-white)]",
    },
  ],
  defaultVariants: {
    color: "accent",
    showLabel: true,
  },
})

// Figma only draws these as dots, so they never take a count.
const dotOnlyColors = ["info", "success", "warning", "danger"] as const

type BadgeColor = NonNullable<VariantProps<typeof badgeVariants>["color"]>
type DotOnlyColor = (typeof dotOnlyColors)[number]

type BadgeProps = Omit<React.ComponentProps<"span">, "color" | "children"> &
  (
    | {
        color?: Exclude<BadgeColor, DotOnlyColor>
        /** Figma Show Label: the count. Leave it out for the dot. */
        children?: React.ReactNode
      }
    | {
        /** Info / Success / Warning / Danger: dot only, as in Figma. */
        color: DotOnlyColor
        children?: never
      }
  )

const isDotOnly = (color: BadgeColor): color is DotOnlyColor =>
  (dotOnlyColors as readonly string[]).includes(color)

function Badge({
  className,
  color = "accent",
  children,
  ...props
}: BadgeProps) {
  // A count on a dot-only color is dropped, even past the types.
  const showLabel = !isDotOnly(color) && children != null && children !== false

  return (
    <span
      data-slot="badge"
      data-color={color}
      // A bare dot is decoration unless it's given a name.
      aria-hidden={!showLabel && !props["aria-label"] ? true : undefined}
      className={cn(badgeVariants({ color, showLabel }), className)}
      {...props}
    >
      {showLabel && children}
    </span>
  )
}

// Figma Badge Object: any element (the Slot) with the Badge on its top-right
// corner.
function BadgeObject({
  className,
  badge,
  children,
  ...props
}: React.ComponentProps<"span"> & {
  /** The Badge on the corner. */
  badge: React.ReactNode
}) {
  return (
    <span
      data-slot="badge-object"
      className={cn("relative inline-flex w-fit items-center", className)}
      {...props}
    >
      {children}
      <span
        data-slot="badge-object-badge"
        className="absolute top-0 right-0 flex"
      >
        {badge}
      </span>
    </span>
  )
}

export { Badge, BadgeObject, badgeVariants, type BadgeProps }
