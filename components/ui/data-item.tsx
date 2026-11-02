"use client"

import * as React from "react"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@/components/ui/icon"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Mirrors the Figma Data Item: a read-only value under the input .Label, with
// up to three Button Ghost actions after it and the .Text Help below, the
// three rows touching (no gap).
// - .Label: Label/Small in Text/Primary; the Info icon (Icon/Primary, 16px)
//   4px after it opens `labelInfo` in a Tooltip.
// - Field: the value in Body/Medium, Text/Primary, with 4px above and below
//   (32px tall with the buttons), and the buttons 8px after it, 8px apart.
// - .Text Help: Body/Small in Text/Secondary.

type DataItemProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Figma .Label: Label/Small in Text/Primary. */
  label?: React.ReactNode
  /** Figma .Label Show Icon Info: the tooltip text of the Info icon. */
  labelInfo?: React.ReactNode
  /** Figma Value: Body/Medium in Text/Primary; wraps when long. */
  value: React.ReactNode
  /**
   * Figma Show Buttons (with Show Button 2 / 3): one to three
   * `<DataItemAction>`, 8px apart.
   */
  actions?: React.ReactNode
  /** Figma .Text Help: Body/Small in Text/Secondary. */
  helpText?: React.ReactNode
}

// `showX && <X />` passes `false` when off: like null, it renders nothing.
function isShown(node: React.ReactNode) {
  return node != null && typeof node !== "boolean"
}

function DataItem({
  className,
  label,
  labelInfo,
  value,
  actions,
  helpText,
  ...props
}: DataItemProps) {
  const labelId = React.useId()
  const hasLabel = isShown(label)

  return (
    <div
      data-slot="data-item"
      role="group"
      aria-labelledby={hasLabel ? labelId : undefined}
      className={cn("flex w-full flex-col", className)}
      {...props}
    >
      {(hasLabel || isShown(labelInfo)) && (
        <div
          data-slot="data-item-label"
          className="flex items-center gap-1 text-label-small text-text-primary"
        >
          {hasLabel && <span id={labelId}>{label}</span>}
          {isShown(labelInfo) && (
            <Tooltip>
              <TooltipTrigger
                aria-label="Info"
                className="inline-flex rounded-xs text-icon-primary outline-none focus-visible:outline-2 focus-visible:outline-border-accent-strong focus-visible:outline-solid"
              >
                <HugeiconsIcon
                  icon={InformationCircleIcon}
                  aria-hidden="true"
                  className="size-4"
                />
              </TooltipTrigger>
              <TooltipContent>{labelInfo}</TooltipContent>
            </Tooltip>
          )}
        </div>
      )}
      <div data-slot="data-item-field" className="flex items-center gap-2">
        <div
          data-slot="data-item-value"
          className="min-w-0 flex-1 py-1 text-body-medium wrap-break-word text-text-primary"
        >
          {value}
        </div>
        {isShown(actions) && (
          <div
            data-slot="data-item-actions"
            className="flex shrink-0 items-center gap-2"
          >
            {actions}
          </div>
        )}
      </div>
      {isShown(helpText) && (
        <p
          data-slot="data-item-help"
          className="text-body-small text-text-secondary"
        >
          {helpText}
        </p>
      )}
    </div>
  )
}

/**
 * Figma Data Item Button: a Small icon-only Button Ghost (32px, 16px icon).
 * Give it an `aria-label`.
 */
function DataItemAction(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="data-item-action"
      variant="ghost"
      size="sm"
      iconOnly
      {...props}
    />
  )
}

export { DataItem, DataItemAction, type DataItemProps }
