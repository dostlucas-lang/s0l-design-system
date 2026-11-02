"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { Cancel01Icon } from "@hugeicons/core-free-icons"

import { HugeiconsIcon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

// Mirrors the Figma Tag component: Size (Small / Medium) × Color (Neutral /
// Accent / Info / Success / Warning / Danger) × Emphasis (Soft / Strong) ×
// State (Default / Disabled) × Icon Only, with Show Icon and Dismissible.
// The label is Label/Small; the icons are 16px and take --tag-icon, the Icon
// token of each color.
const tagVariants = cva(
  "group/tag inline-flex w-fit shrink-0 items-center rounded-full border text-label-small whitespace-nowrap [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      size: {
        sm: "min-h-6",
        md: "min-h-8",
      },
      color: {
        neutral: "",
        accent: "",
        info: "",
        success: "",
        warning: "",
        danger: "",
      },
      emphasis: {
        // Soft: Background, Border and Text / Icon of the color.
        soft: "",
        // Strong: the Strong background, no border, On Color text and icons.
        strong:
          "border-transparent text-text-on-color [--tag-icon:var(--s0l-icon-on-color)]",
      },
      iconOnly: {
        true: "justify-center",
        false: "px-1.5",
      },
      disabled: {
        true: "pointer-events-none",
        false: "",
      },
    },
    compoundVariants: [
      { size: "sm", iconOnly: true, className: "min-w-6" },
      { size: "md", iconOnly: true, className: "min-w-8" },
      {
        emphasis: "soft",
        color: "neutral",
        className:
          "border-border-primary bg-background-surface text-text-primary [--tag-icon:var(--s0l-icon-primary)]",
      },
      {
        emphasis: "soft",
        color: "accent",
        className:
          "border-border-accent-soft bg-background-accent-soft text-text-accent-standard [--tag-icon:var(--s0l-icon-accent-standard)]",
      },
      {
        emphasis: "soft",
        color: "info",
        className:
          "border-border-info-soft bg-background-info-soft text-text-info-standard [--tag-icon:var(--s0l-icon-info-standard)]",
      },
      {
        emphasis: "soft",
        color: "success",
        className:
          "border-border-success-soft bg-background-success-soft text-text-success-standard [--tag-icon:var(--s0l-icon-success-standard)]",
      },
      {
        emphasis: "soft",
        color: "warning",
        className:
          "border-border-warning-soft bg-background-warning-soft text-text-warning-standard [--tag-icon:var(--s0l-icon-warning-standard)]",
      },
      {
        emphasis: "soft",
        color: "danger",
        className:
          "border-border-danger-soft bg-background-danger-soft text-text-danger-standard [--tag-icon:var(--s0l-icon-danger-standard)]",
      },
      {
        emphasis: "strong",
        color: "neutral",
        className:
          "bg-background-inverse-default text-text-inverse [--tag-icon:var(--s0l-icon-inverse)]",
      },
      {
        emphasis: "strong",
        color: "accent",
        className: "bg-background-accent-strong",
      },
      {
        emphasis: "strong",
        color: "info",
        className: "bg-background-info-strong",
      },
      {
        emphasis: "strong",
        color: "success",
        className: "bg-background-success-strong",
      },
      {
        emphasis: "strong",
        color: "warning",
        className: "bg-background-warning-strong",
      },
      {
        emphasis: "strong",
        color: "danger",
        className: "bg-background-danger-strong",
      },
      // State=Disabled replaces the color: Disabled/Soft or Disabled/Strong
      // with Text / Icon Disabled. Kept last so it wins over every Color.
      {
        emphasis: "soft",
        disabled: true,
        className:
          "border-border-disabled-soft bg-background-disabled-soft text-text-disabled [--tag-icon:var(--s0l-icon-disabled)]",
      },
      {
        emphasis: "strong",
        disabled: true,
        className:
          "bg-background-disabled-strong text-text-disabled [--tag-icon:var(--s0l-icon-disabled)]",
      },
    ],
    defaultVariants: {
      size: "sm",
      color: "neutral",
      emphasis: "soft",
      iconOnly: false,
      disabled: false,
    },
  }
)

type TagProps = Omit<useRender.ComponentProps<"span">, "color"> &
  Omit<VariantProps<typeof tagVariants>, "iconOnly"> & {
    /** Figma Show Icon: the 16px leading icon (the only content with Icon Only). */
    icon?: React.ReactNode
    /** Figma Icon Only: shows just the icon in a circle. Give it an `aria-label`. */
    iconOnly?: boolean
    /** Figma Dismissible: shows the X, which calls this when pressed. */
    onDismiss?: (event: React.MouseEvent<HTMLButtonElement>) => void
    /** Accessible name of the X. */
    dismissLabel?: string
  }

function Tag({
  className,
  size = "sm",
  color = "neutral",
  emphasis = "soft",
  disabled = false,
  icon,
  iconOnly = false,
  onDismiss,
  dismissLabel = "Remove",
  children,
  render,
  ...props
}: TagProps) {
  const content = iconOnly ? (
    <span data-slot="tag-icon" className="flex text-(--tag-icon)">
      {icon}
    </span>
  ) : (
    <>
      {icon && (
        <span data-slot="tag-icon" className="flex pl-0.5 text-(--tag-icon)">
          {icon}
        </span>
      )}
      <span data-slot="tag-label" className="px-1.5">
        {children}
      </span>
      {onDismiss && (
        // Figma Dismiss: the 16px X with 2px on its right.
        <span className="flex pr-0.5">
          <button
            type="button"
            data-slot="tag-dismiss"
            aria-label={dismissLabel}
            disabled={disabled || undefined}
            onClick={onDismiss}
            className="flex rounded-full text-(--tag-icon) outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-accent-strong focus-visible:outline-solid"
          >
            <HugeiconsIcon icon={Cancel01Icon} />
          </button>
        </span>
      )}
    </>
  )

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(
          tagVariants({ size, color, emphasis, iconOnly, disabled }),
          className
        ),
        "aria-disabled": disabled || undefined,
        children: content,
      },
      props
    ),
    render,
    state: {
      slot: "tag",
      size,
      color,
      emphasis,
      disabled,
    },
  })
}

export { Tag, tagVariants, type TagProps }
