"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

// Mirrors the Figma Toggle Switch component:
// - State: Default, Read Only (`readOnly`), Disabled (`disabled`)
// - Active (`checked`)
// - Show Label / Label Position / Description as props
// Default is a 44 × 24px pill with a 3px inset: Background/Disabled/Strong
// off, Background/Accent/Strong on, and an 18px Icon/On Color button with the
// Shadows/X-Small shadow. Read Only and Disabled are outlined instead (2px
// Icon/Read Only or Icon/Disabled) with a 14px button in the same color.
// Neither can be changed, so they have no Focus and leave the tab order.
function ToggleSwitchControl({
  className,
  ...props
}: SwitchPrimitive.Root.Props) {
  const isStatic = props.readOnly || props.disabled
  return (
    <SwitchPrimitive.Root
      data-slot="toggle-switch"
      // Only when static: an explicit undefined would drop Base UI's tabIndex.
      {...(isStatic && { tabIndex: -1 })}
      className={cn(
        "group/toggle-switch relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-background-disabled-strong p-[3px] transition-colors outline-none not-data-readonly:not-data-disabled:data-checked:bg-background-accent-strong",
        "not-data-readonly:not-data-disabled:focus-visible:outline-3 not-data-readonly:not-data-disabled:focus-visible:outline-offset-2 not-data-readonly:not-data-disabled:focus-visible:outline-border-accent-strong not-data-readonly:not-data-disabled:focus-visible:outline-solid",
        "data-readonly:border-2 data-readonly:border-icon-read-only data-readonly:bg-transparent",
        "data-disabled:cursor-not-allowed data-disabled:border-2 data-disabled:border-icon-disabled data-disabled:bg-transparent",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="toggle-switch-button"
        className={cn(
          "pointer-events-none block size-[18px] rounded-full bg-icon-on-color shadow-[0_1px_2px_0_rgb(10_13_20/0.03)] transition-transform data-checked:translate-x-5",
          "group-data-readonly/toggle-switch:size-3.5 group-data-readonly/toggle-switch:bg-icon-read-only group-data-readonly/toggle-switch:shadow-none",
          "group-data-disabled/toggle-switch:size-3.5 group-data-disabled/toggle-switch:bg-icon-disabled group-data-disabled/toggle-switch:shadow-none"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

function ToggleSwitch({
  label,
  description,
  labelPosition = "right",
  className,
  ...props
}: SwitchPrimitive.Root.Props & {
  /** Figma "Label" (Show Label). Without it only the toggle renders. */
  label?: React.ReactNode
  /** Figma "Description" (Show Description). */
  description?: React.ReactNode
  /** Figma "Label Position". */
  labelPosition?: "right" | "left"
}) {
  if (!label) {
    return <ToggleSwitchControl className={className} {...props} />
  }

  const textColor = props.disabled
    ? "text-text-disabled"
    : props.readOnly
      ? "text-text-read-only"
      : undefined

  const text = (
    <span className="flex min-w-0 flex-col">
      <span
        data-slot="toggle-switch-label"
        className={cn("text-body-medium text-text-primary", textColor)}
      >
        {label}
      </span>
      {description && (
        <span
          data-slot="toggle-switch-description"
          className={cn("text-body-small text-text-secondary", textColor)}
        >
          {description}
        </span>
      )}
    </span>
  )

  return (
    <label
      data-slot="toggle-switch-field"
      className={cn(
        "inline-flex items-start gap-3",
        props.disabled
          ? "cursor-not-allowed"
          : props.readOnly
            ? "cursor-default"
            : "cursor-pointer",
        className
      )}
    >
      {labelPosition === "left" && text}
      <ToggleSwitchControl {...props} />
      {labelPosition === "right" && text}
    </label>
  )
}

export { ToggleSwitch }
