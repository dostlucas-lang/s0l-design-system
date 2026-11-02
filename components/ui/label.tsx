"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { figmaIcon, HugeiconsIcon } from "@/components/ui/icon"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Mirrors the Figma .Label, .Label Read Only and .Label Disabled components,
// which are one component here: `state` picks the colors. The Input components
// render this Label through InputLabel.

// Figma's Info isn't drawn like the Hugeicons one.
const InfoIcon = figmaIcon(
  "M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
)

const labelVariants = cva("flex items-center gap-1 text-label-small", {
  variants: {
    state: {
      default: "text-text-primary",
      "read-only": "text-text-read-only",
      disabled: "text-text-disabled",
    },
  },
  defaultVariants: {
    state: "default",
  },
})

type LabelState = NonNullable<VariantProps<typeof labelVariants>["state"]>

const requirementColor: Record<LabelState, string> = {
  default: "text-text-secondary",
  "read-only": "text-text-read-only",
  disabled: "text-text-disabled",
}

const infoColor: Record<LabelState, string> = {
  default: "text-icon-primary",
  "read-only": "text-icon-read-only",
  disabled: "text-icon-disabled",
}

type LabelProps = Omit<React.ComponentProps<"label">, "children"> & {
  /** The text of the label. */
  label: React.ReactNode
  state?: LabelState
  /** Text after the label, like "(obrigatório)" or "(opcional)". */
  requirement?: React.ReactNode
  /** Shows the Info icon next to the label with this content in a tooltip. */
  info?: React.ReactNode
}

function Label({
  label,
  state = "default",
  requirement,
  info,
  className,
  ...props
}: LabelProps) {
  return (
    <div
      data-slot="label"
      data-state={state}
      className={cn(labelVariants({ state }), className)}
    >
      <label {...props}>{label}</label>
      {requirement && (
        <span data-slot="label-requirement" className={requirementColor[state]}>
          {requirement}
        </span>
      )}
      {info && (
        // The provider opens it right away, without Base UI's default delay.
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              aria-label="Info"
              className={cn(
                "inline-flex rounded-xs outline-none focus-visible:outline-2 focus-visible:outline-border-accent-strong focus-visible:outline-solid",
                infoColor[state]
              )}
            >
              <HugeiconsIcon icon={InfoIcon} className="size-4" />
            </TooltipTrigger>
            <TooltipContent>{info}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}

export { Label, labelVariants, type LabelProps, type LabelState }
