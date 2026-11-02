"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon, type IconSvgElement } from "@/components/ui/icon"

// Mirrors the Figma Bottom Bar: a Background/Surface pill with Shadow/Large
// and 8px padding, holding 2, 3 or 4 .Bottom Bar Button items side by side
// (Figma Items=2 / 3 / 4). It only draws the bar: pin it to the bottom of the
// screen where it's used.
function BottomBar({
  className,
  "aria-label": ariaLabel = "Main",
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="bottom-bar"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center rounded-full bg-background-surface p-2 shadow-lg",
        className
      )}
      {...props}
    />
  )
}

// Figma .Bottom Bar Button: an 88 × 64 pill with the 24px icon over the
// Label/X-Small label, 4px apart, 8px side padding.
// - Pressed is Background/Pressed. It shows on hover and press; `data-pressed`
//   forces it.
// - Active (the current page) is Background/Accent/Hover with the icon and
//   label in Accent Standard.
// - Disabled is Icon/Disabled and Text/Disabled.
// - Focus is the 3px Border/Accent/Strong ring, 2px away from the pill.
const bottomBarItemClassName =
  "group/bottom-bar-item relative flex h-16 w-22 shrink-0 flex-col items-center justify-center gap-1 rounded-full px-2 text-text-secondary outline-none select-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-border-accent-strong focus-visible:outline-solid not-data-active:hover:bg-background-pressed not-data-active:active:bg-background-pressed not-data-active:data-pressed:bg-background-pressed data-active:bg-background-accent-hover data-active:text-text-accent-standard data-disabled:pointer-events-none data-disabled:text-text-disabled"

type BottomBarItemProps = Omit<
  useRender.ComponentProps<"button">,
  "children"
> & {
  /** Figma Icon: any Hugeicons icon, 24px. */
  icon: IconSvgElement
  /** Figma Label: Label/X-Small, cut with an ellipsis past one line. */
  label: React.ReactNode
  /** Figma State=Active: the current page (sets `aria-current="page"`). */
  active?: boolean
  /** Figma State=Disabled. */
  disabled?: boolean
  /**
   * Figma Show Badge: the count in an Accent Badge on the top right. Hidden
   * while disabled, as in Figma.
   */
  badge?: React.ReactNode
}

/**
 * One destination of the Bottom Bar. Renders a `<button>`; pass `render`
 * (an `<a>` or a Next.js `<Link>`) to navigate instead.
 */
function BottomBarItem({
  className,
  icon,
  label,
  active = false,
  disabled = false,
  badge,
  render,
  ...props
}: BottomBarItemProps) {
  const isButton = render == null
  // Figma State=Disabled has no Badge.
  const showBadge = badge != null && typeof badge !== "boolean" && !disabled

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(bottomBarItemClassName, className),
        "aria-current": active ? "page" : undefined,
        ...(isButton
          ? { type: "button", disabled }
          : // A link can't be disabled: take it out of the tab order instead.
            disabled && { "aria-disabled": true, tabIndex: -1 }),
        children: (
          <>
            <HugeiconsIcon
              data-slot="bottom-bar-item-icon"
              icon={icon}
              aria-hidden="true"
              className="size-6 shrink-0 text-icon-secondary group-data-disabled/bottom-bar-item:text-icon-disabled group-data-active/bottom-bar-item:text-icon-accent-standard"
            />
            <span
              data-slot="bottom-bar-item-label"
              className="w-full truncate text-center text-[length:var(--s0l-text-font-size-100)] leading-[1.5] font-medium"
            >
              {label}
            </span>
            {showBadge && (
              <Badge
                data-slot="bottom-bar-item-badge"
                color="accent"
                className="absolute top-0 right-0"
              >
                {badge}
              </Badge>
            )}
          </>
        ),
      },
      props
    ),
    render,
    state: {
      slot: "bottom-bar-item",
      active,
      disabled,
    },
  })
}

export { BottomBar, BottomBarItem, type BottomBarItemProps }
