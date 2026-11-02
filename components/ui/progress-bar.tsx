"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@/lib/utils"

// Mirrors the Figma Progress Bar and Progress Bar Label components:
// - Bar: a 10px pill track in Background/Disabled/Soft, 240px wide, with the
//   .Progress Bar Fill as wide as `value` (Figma Value=0…100).
// - Color (.Progress Bar Fill): Brand Gradient (Progress Bar/Gradient/Start →
//   End) or a Chart color, 1 to 9.
// - Label Position: Top / Bottom (labels 4px from the bar, Left and Right at
//   each end) or Side (12px on each side of the bar).
// - Show Label Left / Show Label Right: which of the two labels show.
// - Labels: Body/Small in Text/Primary.
const fillColors = {
  "brand-gradient":
    "bg-linear-to-r from-progress-bar-gradient-start to-progress-bar-gradient-end",
  "1": "bg-chart-1",
  "2": "bg-chart-2",
  "3": "bg-chart-3",
  "4": "bg-chart-4",
  "5": "bg-chart-5",
  "6": "bg-chart-6",
  "7": "bg-chart-7",
  "8": "bg-chart-8",
  "9": "bg-chart-9",
} as const

type ProgressBarColor = keyof typeof fillColors

type ProgressBarProps = Omit<
  ProgressPrimitive.Root.Props,
  "children" | "color"
> & {
  /** Figma "Color": Brand Gradient or Chart/1 to Chart/9. */
  color?: ProgressBarColor
  /** Figma "Label Left": the label at the start of the bar. */
  labelLeft?: React.ReactNode
  /** Figma "Label Right": the label at the end of the bar. */
  labelRight?: React.ReactNode
  /** Figma "Label Position": above, below or beside the bar. */
  labelPosition?: "top" | "bottom" | "side"
  /** Figma "Show Label Left". */
  showLabelLeft?: boolean
  /** Figma "Show Label Right". */
  showLabelRight?: boolean
}

const labelClassName = "text-body-small whitespace-nowrap text-text-primary"

function ProgressBar({
  className,
  labelLeft,
  labelRight,
  labelPosition = "top",
  showLabelLeft = true,
  showLabelRight = true,
  color = "brand-gradient",
  ...props
}: ProgressBarProps) {
  const side = labelPosition === "side"
  const hasLabelLeft = showLabelLeft && labelLeft != null
  const hasLabelRight = showLabelRight && labelRight != null
  const hasLabels = hasLabelLeft || hasLabelRight

  const bar = (
    <ProgressPrimitive.Track
      data-slot="progress-bar-track"
      className={cn(
        "relative h-2.5 overflow-hidden rounded-full bg-background-disabled-soft",
        // Side: 240px like Figma, growing when the root is made wider.
        side ? "min-w-60 flex-1" : "w-full"
      )}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-bar-fill"
        data-color={color}
        className={cn(
          "h-full rounded-full transition-[width] duration-300",
          fillColors[color]
        )}
      />
    </ProgressPrimitive.Track>
  )

  const labels = hasLabels && !side && (
    <div
      data-slot="progress-bar-labels"
      className={cn(
        "flex w-full items-center",
        hasLabelLeft ? "justify-between" : "justify-end"
      )}
    >
      {hasLabelLeft && (
        <span data-slot="progress-bar-label-left" className={labelClassName}>
          {labelLeft}
        </span>
      )}
      {hasLabelRight && (
        <span data-slot="progress-bar-label-right" className={labelClassName}>
          {labelRight}
        </span>
      )}
    </div>
  )

  return (
    <ProgressPrimitive.Root
      data-slot="progress-bar"
      data-label-position={hasLabels ? labelPosition : undefined}
      className={cn(
        side ? "flex w-fit items-center gap-3" : "flex w-60 flex-col gap-1",
        className
      )}
      {...props}
    >
      {side ? (
        <>
          {hasLabelLeft && (
            <span
              data-slot="progress-bar-label-left"
              className={cn(labelClassName, "text-right")}
            >
              {labelLeft}
            </span>
          )}
          {bar}
          {hasLabelRight && (
            <span
              data-slot="progress-bar-label-right"
              className={labelClassName}
            >
              {labelRight}
            </span>
          )}
        </>
      ) : labelPosition === "bottom" ? (
        <>
          {bar}
          {labels}
        </>
      ) : (
        <>
          {labels}
          {bar}
        </>
      )}
    </ProgressPrimitive.Root>
  )
}

export { ProgressBar, type ProgressBarColor, type ProgressBarProps }
