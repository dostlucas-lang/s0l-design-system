"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group"
import { MinusSignIcon, Tick02Icon } from "@hugeicons/core-free-icons"

import { HugeiconsIcon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

// Mirrors the Figma Checkbox component:
// - State: Default, Read Only (`readOnly`), Disabled (`disabled`)
// - Active (`checked`) and Indeterminate (`indeterminate`)
// - Show Label / Label Position / Description / Nested as props
// The accent fill only applies to an interactive box; Read Only and Disabled
// keep an outlined box with a tinted mark. Read Only can't be changed, so it
// has no Focus and leaves the tab order.
function CheckboxBox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      // Only when read-only: an explicit undefined would drop Base UI's tabIndex.
      {...(props.readOnly && { tabIndex: -1 })}
      className={cn(
        "group/checkbox relative flex size-6 shrink-0 items-center justify-center rounded-sm border-2 border-icon-secondary outline-none not-data-readonly:focus-visible:outline-3 not-data-readonly:focus-visible:outline-offset-2 not-data-readonly:focus-visible:outline-border-accent-strong not-data-readonly:focus-visible:outline-solid",
        "not-data-readonly:not-data-disabled:data-checked:border-transparent not-data-readonly:not-data-disabled:data-checked:bg-background-accent-strong not-data-readonly:not-data-disabled:data-checked:text-icon-on-color",
        "not-data-readonly:not-data-disabled:data-indeterminate:border-transparent not-data-readonly:not-data-disabled:data-indeterminate:bg-background-accent-strong not-data-readonly:not-data-disabled:data-indeterminate:text-icon-on-color",
        "data-readonly:border-icon-read-only data-readonly:text-icon-read-only",
        "data-disabled:cursor-not-allowed data-disabled:border-icon-disabled data-disabled:text-icon-disabled",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center"
      >
        <HugeiconsIcon
          icon={Tick02Icon}
          size={16}
          strokeWidth={2.4}
          absoluteStrokeWidth
          className="group-data-indeterminate/checkbox:hidden"
        />
        <HugeiconsIcon
          icon={MinusSignIcon}
          size={16}
          strokeWidth={2.4}
          absoluteStrokeWidth
          className="hidden group-data-indeterminate/checkbox:block"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

function Checkbox({
  label,
  description,
  labelPosition = "right",
  nested = false,
  showNestIndicator = true,
  className,
  ...props
}: CheckboxPrimitive.Root.Props & {
  /** Figma "Label" (Show Label). Without it only the box renders. */
  label?: React.ReactNode
  /** Figma "Description" (Show Description). */
  description?: React.ReactNode
  /** Figma "Label Position". */
  labelPosition?: "right" | "left"
  /** Figma "Nested": indents the checkbox under a parent one. */
  nested?: boolean
  /** Figma "Show Nest Indicator": the └ connector of a nested checkbox. */
  showNestIndicator?: boolean
}) {
  if (!label && !nested) {
    return <CheckboxBox className={className} {...props} />
  }

  const textColor = props.disabled
    ? "text-text-disabled"
    : props.readOnly
      ? "text-text-read-only"
      : undefined

  const text = label && (
    <span className="flex min-w-0 flex-col">
      <span
        data-slot="checkbox-label"
        className={cn("text-body-medium text-text-primary", textColor)}
      >
        {label}
      </span>
      {description && (
        <span
          data-slot="checkbox-description"
          className={cn("text-body-small text-text-secondary", textColor)}
        >
          {description}
        </span>
      )}
    </span>
  )

  return (
    <label
      data-slot="checkbox-field"
      className={cn(
        "inline-flex items-start gap-3",
        props.disabled ? "cursor-not-allowed" : "cursor-pointer",
        className
      )}
    >
      {nested && (
        <span
          data-slot="checkbox-nest"
          aria-hidden="true"
          className="relative w-8 shrink-0 self-stretch"
        >
          {showNestIndicator && (
            <span className="absolute top-0 left-5 h-[13px] w-2 border-b border-l border-border-primary" />
          )}
        </span>
      )}
      {labelPosition === "left" && text}
      <CheckboxBox {...props} />
      {labelPosition === "right" && text}
    </label>
  )
}

// Mirrors the Figma Checkbox Group: label, checkboxes (Direction) and help text.
function CheckboxGroup({
  label,
  helpText,
  direction = "vertical",
  className,
  children,
  ...props
}: CheckboxGroupPrimitive.Props & {
  /** Group label (Figma .Label). */
  label?: React.ReactNode
  /** Figma "Show Text Help". */
  helpText?: React.ReactNode
  /** Figma "Direction". */
  direction?: "vertical" | "horizontal"
}) {
  const labelId = React.useId()

  return (
    <CheckboxGroupPrimitive
      data-slot="checkbox-group"
      data-direction={direction}
      aria-labelledby={label ? labelId : undefined}
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      {label && (
        <div id={labelId} className="text-label-small text-text-primary">
          {label}
        </div>
      )}
      <div
        className={cn(
          "flex gap-4",
          direction === "vertical" ? "flex-col items-start" : "flex-wrap"
        )}
      >
        {children}
      </div>
      {helpText && (
        <p className="text-label-small text-text-secondary">{helpText}</p>
      )}
    </CheckboxGroupPrimitive>
  )
}

export { Checkbox, CheckboxGroup }
