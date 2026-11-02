import { CommandIcon } from "@hugeicons/core-free-icons"
import { cva, type VariantProps } from "class-variance-authority"

import { HugeiconsIcon, type IconSvgElement } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

// Mirrors the Figma Icon Colors component: Color × Container, with the Icon
// swappable for any Hugeicons icon.
const iconColorsVariants = cva(
  "inline-flex shrink-0 items-center justify-center [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      color: {
        accent: "text-icon-accent-standard",
        info: "text-icon-info-standard",
        success: "text-icon-success-standard",
        warning: "text-icon-warning-standard",
        danger: "text-icon-danger-standard",
      },
      container: {
        true: "min-h-10 min-w-10 rounded-md",
        false: "",
      },
    },
    compoundVariants: [
      {
        color: "accent",
        container: true,
        className: "bg-background-accent-soft",
      },
      { color: "info", container: true, className: "bg-background-info-soft" },
      {
        color: "success",
        container: true,
        className: "bg-background-success-soft",
      },
      {
        color: "warning",
        container: true,
        className: "bg-background-warning-soft",
      },
      {
        color: "danger",
        container: true,
        className: "bg-background-danger-soft",
      },
    ],
    defaultVariants: {
      color: "accent",
      container: false,
    },
  }
)

function IconColors({
  className,
  color = "accent",
  container = false,
  icon = CommandIcon,
  ...props
}: Omit<React.ComponentProps<"span">, "color"> &
  VariantProps<typeof iconColorsVariants> & {
    icon?: IconSvgElement
  }) {
  return (
    <span
      data-slot="icon-colors"
      data-color={color}
      data-container={container ? "" : undefined}
      className={cn(iconColorsVariants({ color, container }), className)}
      {...props}
    >
      <HugeiconsIcon icon={icon} aria-hidden="true" />
    </span>
  )
}

export { IconColors, iconColorsVariants }
