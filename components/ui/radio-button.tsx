"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

// Mirrors the Figma Radio Button component:
// - State: Default, Read Only (`readOnly`), Disabled (`disabled`)
// - Active (`checked`, from the group value)
// - Show Label / Label Position / Description as props
// The accent fill only applies to an interactive radio; Read Only and
// Disabled keep an outlined circle with a tinted bullet. Neither can be
// changed, so they have no Focus and leave the tab order, whether the state
// comes from the radio or from its group.
const RadioGroupStaticContext = React.createContext(false)

function RadioButtonCircle({ className, ...props }: RadioPrimitive.Root.Props) {
  const groupStatic = React.useContext(RadioGroupStaticContext)
  return (
    <RadioPrimitive.Root
      data-slot="radio-button"
      // Only when static: an explicit undefined would drop Base UI's tabIndex.
      {...((props.readOnly || props.disabled || groupStatic) && {
        tabIndex: -1,
      })}
      className={cn(
        "group/radio-button relative flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-icon-secondary outline-none not-data-readonly:not-data-disabled:focus-visible:outline-3 not-data-readonly:not-data-disabled:focus-visible:outline-offset-2 not-data-readonly:not-data-disabled:focus-visible:outline-border-accent-strong not-data-readonly:not-data-disabled:focus-visible:outline-solid",
        "not-data-readonly:not-data-disabled:data-checked:border-transparent not-data-readonly:not-data-disabled:data-checked:bg-background-accent-strong not-data-readonly:not-data-disabled:data-checked:text-icon-on-color",
        "data-readonly:border-icon-read-only data-readonly:text-icon-read-only",
        "data-disabled:cursor-not-allowed data-disabled:border-icon-disabled data-disabled:text-icon-disabled",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-button-indicator"
        className="size-2 rounded-full bg-current"
      />
    </RadioPrimitive.Root>
  )
}

function RadioButton({
  label,
  description,
  labelPosition = "right",
  className,
  ...props
}: RadioPrimitive.Root.Props & {
  /** Figma "Label" (Show Label). Without it only the circle renders. */
  label?: React.ReactNode
  /** Figma "Description" (Show Description). */
  description?: React.ReactNode
  /** Figma "Label Position". */
  labelPosition?: "right" | "left"
}) {
  if (!label) {
    return <RadioButtonCircle className={className} {...props} />
  }

  // Read Only and Disabled also come from the group, so the text follows the
  // radio's data attributes instead of its props.
  const text = (
    <span className="flex min-w-0 flex-col">
      <span
        data-slot="radio-button-label"
        className="text-body-medium text-text-primary group-has-data-readonly/radio-button-field:text-text-read-only group-has-data-disabled/radio-button-field:text-text-disabled"
      >
        {label}
      </span>
      {description && (
        <span
          data-slot="radio-button-description"
          className="text-body-small text-text-secondary group-has-data-readonly/radio-button-field:text-text-read-only group-has-data-disabled/radio-button-field:text-text-disabled"
        >
          {description}
        </span>
      )}
    </span>
  )

  return (
    <label
      data-slot="radio-button-field"
      className={cn(
        "group/radio-button-field inline-flex cursor-pointer items-start gap-3 has-data-readonly:cursor-default has-data-disabled:cursor-not-allowed",
        className
      )}
    >
      {labelPosition === "left" && text}
      <RadioButtonCircle {...props} />
      {labelPosition === "right" && text}
    </label>
  )
}

// Mirrors the Figma Radio Group: label, radio buttons (Direction) and help
// text, 16px apart.
function RadioGroup({
  label,
  helpText,
  direction = "vertical",
  className,
  children,
  ...props
}: RadioGroupPrimitive.Props & {
  /** Group label (Figma .Label). */
  label?: React.ReactNode
  /** Figma "Show Text Help". */
  helpText?: React.ReactNode
  /** Figma "Direction". */
  direction?: "vertical" | "horizontal"
}) {
  const labelId = React.useId()

  return (
    <RadioGroupStaticContext.Provider
      value={Boolean(props.readOnly || props.disabled)}
    >
      <RadioGroupPrimitive
        data-slot="radio-group"
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
      </RadioGroupPrimitive>
    </RadioGroupStaticContext.Provider>
  )
}

export { RadioButton, RadioGroup }
