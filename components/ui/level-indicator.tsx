"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Mirrors the three levels of the Figma Level Indicator:
// - Level Indicator Group: Count (1 to 10 items, 4px apart) × Color. Items are
//   16px tall with the Small radius. Active items take the Icon/*/Display color,
//   the others Background/Disabled/Soft.
// - Level Indicator: Size (item width: Small 6px, Medium 16px, Large 28px) and
//   the groups 12px apart. Groups=1, 2 and 3 are one, two or three children.
// - Level Indicator Label: Body/Small text around the indicator, 4px away on the
//   Top and Bottom positions, 12px on the Side ones.
// - Narrower than Figma, the groups and the side labels break into lines and the
//   items shrink.
const levelIndicatorItemVariants = cva(
  "h-4 min-w-0 rounded-sm bg-background-disabled-soft",
  {
    variants: {
      size: {
        small: "w-1.5",
        medium: "w-4",
        large: "w-7",
      },
      color: {
        accent: "data-active:bg-icon-accent-display",
        info: "data-active:bg-icon-info-display",
        success: "data-active:bg-icon-success-display",
        warning: "data-active:bg-icon-warning-display",
        danger: "data-active:bg-icon-danger-display",
      },
    },
    defaultVariants: {
      size: "medium",
      color: "accent",
    },
  }
)

type LevelIndicatorItemVariants = VariantProps<
  typeof levelIndicatorItemVariants
>

type LevelIndicatorSize = NonNullable<LevelIndicatorItemVariants["size"]>

const LevelIndicatorSizeContext =
  React.createContext<LevelIndicatorSize>("medium")

type LevelIndicatorGroupProps = Omit<React.ComponentProps<"div">, "color"> &
  Pick<LevelIndicatorItemVariants, "color"> & {
    /** Figma Count: the number of items, 1 to 10. */
    count?: number
    /** How many items are active, from the first one. */
    active?: number
  }

function LevelIndicatorGroup({
  count = 3,
  active = 1,
  color = "accent",
  className,
  "aria-label": ariaLabel = "Level",
  ...props
}: LevelIndicatorGroupProps) {
  const size = React.useContext(LevelIndicatorSizeContext)
  const activeItems = Math.min(Math.max(active, 0), count)

  return (
    <div
      role="meter"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={count}
      aria-valuenow={activeItems}
      data-slot="level-indicator-group"
      data-color={color}
      className={cn("flex w-fit max-w-full items-center gap-1", className)}
      {...props}
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          data-slot="level-indicator-item"
          data-active={index < activeItems || undefined}
          className={levelIndicatorItemVariants({ size, color })}
        />
      ))}
    </div>
  )
}

type LevelIndicatorProps = React.ComponentProps<"div"> & {
  /** The item width of every group. */
  size?: LevelIndicatorSize
}

function LevelIndicator({
  size = "medium",
  className,
  ...props
}: LevelIndicatorProps) {
  return (
    <LevelIndicatorSizeContext.Provider value={size}>
      <div
        data-slot="level-indicator"
        data-size={size}
        className={cn(
          "flex w-fit max-w-full flex-wrap items-center gap-3",
          className
        )}
        {...props}
      />
    </LevelIndicatorSizeContext.Provider>
  )
}

type LevelIndicatorLabelPosition = "top" | "bottom" | "side"

type LevelIndicatorLabelProps = React.ComponentProps<"div"> & {
  /** Figma Label Position: where the labels sit around the indicator. */
  labelPosition?: LevelIndicatorLabelPosition
  /** Figma Show Label Left. */
  showLabelLeft?: boolean
  /** Figma Show Label Right. */
  showLabelRight?: boolean
  /** The text on the left of the indicator. */
  labelLeft?: React.ReactNode
  /** The text on the right of the indicator. */
  labelRight?: React.ReactNode
  /** The `LevelIndicator`. */
  children: React.ReactNode
}

function LevelIndicatorLabel({
  labelPosition = "top",
  showLabelLeft = true,
  showLabelRight = true,
  labelLeft,
  labelRight,
  children,
  className,
  ...props
}: LevelIndicatorLabelProps) {
  const id = React.useId()

  const left = showLabelLeft && labelLeft != null && (
    <p
      id={`${id}-left`}
      data-slot="level-indicator-label-left"
      className="min-w-0 text-body-small text-text-primary"
    >
      {labelLeft}
    </p>
  )
  const right = showLabelRight && labelRight != null && (
    <p
      id={`${id}-right`}
      data-slot="level-indicator-label-right"
      className="ml-auto min-w-0 text-body-small text-text-primary"
    >
      {labelRight}
    </p>
  )
  const labels = (left || right) && (
    <div className="flex w-full gap-3">
      {left}
      {right}
    </div>
  )
  const labelIds = [left && `${id}-left`, right && `${id}-right`]
    .filter(Boolean)
    .join(" ")

  return (
    <div
      role={labelIds ? "group" : undefined}
      aria-labelledby={labelIds || undefined}
      data-slot="level-indicator-label"
      data-position={labelPosition}
      className={cn(
        "flex w-fit max-w-full",
        labelPosition === "side"
          ? "flex-wrap items-center gap-x-3 gap-y-1"
          : "flex-col gap-1",
        className
      )}
      {...props}
    >
      {labelPosition === "side" ? (
        <>
          {left}
          {children}
          {right}
        </>
      ) : labelPosition === "top" ? (
        <>
          {labels}
          {children}
        </>
      ) : (
        <>
          {children}
          {labels}
        </>
      )}
    </div>
  )
}

export {
  LevelIndicator,
  LevelIndicatorGroup,
  LevelIndicatorLabel,
  type LevelIndicatorGroupProps,
  type LevelIndicatorLabelPosition,
  type LevelIndicatorLabelProps,
  type LevelIndicatorProps,
}
