"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@/components/ui/icon"
import {
  ListItemTrendIcon,
  type ListItemTrend,
} from "@/components/ui/list-item"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Mirrors the Figma Stats component: Size (Small / Medium / Large) sets the
// value's Heading style; the rest is the same in every size.
// - Label: Label/Small in Text/Primary, with the 16px Info icon (Icon/Primary)
//   8px after it.
// - Value: Text/Primary, with the .Stats Trend 8px after it.
// - Description: Body/Small in Text/Secondary.
// - The rows are 4px apart.
const statsValueVariants = cva("text-text-primary", {
  variants: {
    size: {
      sm: "text-heading-medium",
      md: "text-heading-large",
      lg: "text-heading-x-large",
    },
  },
  defaultVariants: {
    size: "sm",
  },
})

type StatsProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof statsValueVariants> & {
    /** Figma Value: the number, in the Heading style of the size. */
    value: React.ReactNode
    /** Figma Show Label: Label/Small in Text/Primary. */
    label?: React.ReactNode
    /**
     * Figma Show Info Icon: the tooltip text. Shows the Info icon after the
     * label, which opens it on hover and focus.
     */
    info?: React.ReactNode
    /** Figma Show Description: Body/Small in Text/Secondary. */
    description?: React.ReactNode
    /** Figma Show Trend: the direction (Figma Negative=False / True). */
    trend?: ListItemTrend
    /** Figma Trend Value: the change next to the trend icon, e.g. "12%". */
    trendValue?: React.ReactNode
  }

// `showX && value` passes `false` when off: like null, it renders nothing.
function isShown(node: React.ReactNode) {
  return node != null && typeof node !== "boolean"
}

function Stats({
  className,
  size = "sm",
  value,
  label,
  info,
  description,
  trend,
  trendValue,
  ...props
}: StatsProps) {
  return (
    <div
      data-slot="stats"
      data-size={size}
      className={cn("flex flex-col gap-1", className)}
      {...props}
    >
      {(isShown(label) || isShown(info)) && (
        <div className="flex items-center gap-2">
          {isShown(label) && (
            <span
              data-slot="stats-label"
              className="text-label-small text-text-primary"
            >
              {label}
            </span>
          )}
          {isShown(info) && (
            <Tooltip>
              <TooltipTrigger
                data-slot="stats-info"
                aria-label="More information"
                className="flex shrink-0 rounded-full text-icon-primary outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-border-accent-strong focus-visible:outline-solid"
              >
                <HugeiconsIcon
                  icon={InformationCircleIcon}
                  aria-hidden="true"
                  className="size-4"
                />
              </TooltipTrigger>
              <TooltipContent>{info}</TooltipContent>
            </Tooltip>
          )}
        </div>
      )}
      <div className="flex items-start gap-2">
        <span data-slot="stats-value" className={statsValueVariants({ size })}>
          {value}
        </span>
        {/* Figma .Stats Trend: 4px from the top and bottom, so it lines up
            with the value's first line. */}
        {trend && (
          <span
            data-slot="stats-trend"
            data-trend={trend}
            className={cn(
              "flex items-center gap-1 py-1 text-label-small",
              trend === "positive"
                ? "text-text-success-standard"
                : "text-text-danger-standard"
            )}
          >
            <ListItemTrendIcon
              data-slot="stats-trend-icon"
              trend={trend}
              className="size-4"
            />
            {trendValue}
          </span>
        )}
      </div>
      {isShown(description) && (
        <p
          data-slot="stats-description"
          className="text-body-small text-text-secondary"
        >
          {description}
        </p>
      )}
    </div>
  )
}

export { Stats, statsValueVariants, type StatsProps }
