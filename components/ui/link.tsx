"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Mirrors the Figma Link component: Color (Neutral / Accent, named Brand in
// Figma / Danger / Inverse) × Size (Small / Medium) × State (Default / Hover /
// Disabled), with Icon Left and Icon Right. Hover underlines the label; Focus is the
// 3px Border/Accent/Strong ring 2px away, with Border/Radius/Small. Renders
// an <a>; pass `render` for a router link (e.g. Next's <Link>).
const linkVariants = cva(
  "group/link inline-flex w-fit items-center justify-center rounded-sm whitespace-nowrap outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-border-accent-strong focus-visible:outline-solid [&_svg]:shrink-0",
  {
    variants: {
      color: {
        neutral: "text-text-primary [&_svg]:text-icon-primary",
        accent: "text-text-accent-display [&_svg]:text-icon-accent-display",
        danger: "text-text-danger-display [&_svg]:text-icon-danger-display",
        inverse: "text-text-inverse [&_svg]:text-icon-inverse",
      },
      size: {
        sm: "min-h-4 gap-1 text-label-small [&_svg:not([class*='size-'])]:size-4",
        md: "min-h-5 gap-1.5 text-label-medium [&_svg:not([class*='size-'])]:size-5",
      },
      disabled: {
        false: "cursor-pointer",
        true: "pointer-events-none",
      },
    },
    compoundVariants: [
      // State=Disabled: Text / Icon Disabled, or the Inverse Disabled pair.
      {
        disabled: true,
        color: ["neutral", "accent", "danger"],
        className: "text-text-disabled [&_svg]:text-icon-disabled",
      },
      {
        disabled: true,
        color: "inverse",
        className:
          "text-text-inverse-disabled [&_svg]:text-icon-inverse-disabled",
      },
    ],
    defaultVariants: {
      color: "neutral",
      size: "md",
      disabled: false,
    },
  }
)

type LinkProps = Omit<useRender.ComponentProps<"a">, "color"> &
  VariantProps<typeof linkVariants> & {
    /** Figma Icon Left. */
    iconLeft?: React.ReactNode
    /** Figma Icon Right. */
    iconRight?: React.ReactNode
  }

function Link({
  className,
  color = "neutral",
  size = "md",
  disabled = false,
  iconLeft,
  iconRight,
  href,
  children,
  render,
  ...props
}: LinkProps) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(linkVariants({ color, size, disabled }), className),
        // Disabled: no destination and out of the tab order.
        href: disabled ? undefined : href,
        "aria-disabled": disabled || undefined,
        tabIndex: disabled ? -1 : undefined,
        children: (
          <>
            {iconLeft}
            {/* Hover: the label is underlined from the font's metrics. */}
            <span
              data-slot="link-label"
              className="decoration-from-font [text-underline-position:from-font] group-hover/link:underline"
            >
              {children}
            </span>
            {iconRight}
          </>
        ),
      },
      props
    ),
    render,
    state: {
      slot: "link",
      color,
      size,
      disabled,
    },
  })
}

export { Link, linkVariants, type LinkProps }
