"use client"

import * as React from "react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@/components/ui/icon"
import { Label } from "@/components/ui/label"

// Pieces shared by the Figma Input components (Input Text, Input Number,
// Input Search, Input Password, Input Area): Field, Button Clear and
// Text Help / Text Error, plus the Label component. The root carries data-state (default / disabled / read-only),
// data-invalid and data-filled for the `group/input` variants below.
//
// The field draws its hover overlay with ::after under the content, like the
// stacked fills in Figma, and the Focus / Focus Error ring as an outline 2px
// away from the border. Read Only can't be edited, so it has no Focus and
// leaves the tab order.

type InputBaseProps = {
  /** The .Label above the field. */
  label?: React.ReactNode
  /** Text after the label, like "(obrigatório)" or "(opcional)". */
  requirement?: React.ReactNode
  /** Shows the Info icon next to the label with this content in a tooltip. */
  info?: React.ReactNode
  /** Text Help below the field. Hidden while an error is shown. */
  helpText?: React.ReactNode
  /** Error=True: paints the Focus Error ring and shows this as Text Error. */
  error?: React.ReactNode
  /** Shows Button Clear while the field is filled. */
  clearable?: boolean
  /** Accessible name of Button Clear. */
  clearLabel?: string
  onClear?: () => void
  /** Classes for the bordered field, the root takes `className`. */
  fieldClassName?: string
}

type InputState = "default" | "disabled" | "read-only"

function useInputBase({
  id,
  value,
  defaultValue,
  disabled,
  readOnly,
  error,
  helpText,
  ariaInvalid,
}: {
  id?: string
  value?: unknown
  defaultValue?: unknown
  disabled?: boolean
  readOnly?: boolean
  error?: React.ReactNode
  helpText?: React.ReactNode
  ariaInvalid?: React.AriaAttributes["aria-invalid"]
}) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const message = error || helpText

  const [uncontrolledFilled, setUncontrolledFilled] = React.useState(
    () => defaultValue != null && String(defaultValue) !== ""
  )
  const filled =
    value !== undefined
      ? value != null && String(value) !== ""
      : uncontrolledFilled

  const state: InputState = disabled
    ? "disabled"
    : readOnly
      ? "read-only"
      : "default"

  return {
    inputId,
    messageId: message ? `${inputId}-message` : undefined,
    message,
    filled,
    // Only tracks uncontrolled inputs; controlled ones follow `value`.
    trackFilled: (next: string) => {
      if (value === undefined) setUncontrolledFilled(next !== "")
    },
    invalid:
      Boolean(error) ||
      (ariaInvalid !== undefined &&
        ariaInvalid !== false &&
        ariaInvalid !== "false"),
    state,
    showClear: filled && state === "default",
  }
}

// Sets the value through the native setter so React sees an input event and
// fires onChange, for both controlled and uncontrolled fields.
function clearControl(control: HTMLInputElement | HTMLTextAreaElement) {
  const prototype =
    control instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype
  Object.getOwnPropertyDescriptor(prototype, "value")?.set?.call(control, "")
  control.dispatchEvent(new Event("input", { bubbles: true }))
  control.focus()
}

function InputRoot({
  state,
  invalid,
  filled,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  state: InputState
  invalid: boolean
  filled: boolean
}) {
  return (
    <div
      data-state={state}
      data-invalid={invalid || undefined}
      data-filled={filled || undefined}
      className={cn("group/input flex w-full flex-col gap-2", className)}
      {...props}
    />
  )
}

function InputLabel({
  htmlFor,
  state,
  label,
  requirement,
  info,
}: Pick<InputBaseProps, "label" | "requirement" | "info"> & {
  htmlFor: string
  state: InputState
}) {
  if (!label) return null
  return (
    <Label
      htmlFor={htmlFor}
      label={label}
      state={state}
      requirement={requirement}
      info={info}
    />
  )
}

const inputFieldClassName = cn(
  "relative isolate w-full rounded-md border border-border-primary bg-background-surface transition-colors after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:transition-colors",
  "group-data-[state=default]/input:not-focus-within:hover:after:bg-background-hover",
  "outline-offset-2 outline-border-accent-strong group-data-invalid/input:outline-3 group-data-invalid/input:outline-border-danger-strong group-data-invalid/input:outline-solid group-data-[state=default]/input:focus-within:outline-3 group-data-[state=default]/input:focus-within:outline-solid",
  "group-data-[state=disabled]/input:border-border-disabled-soft group-data-[state=read-only]/input:border-border-disabled-soft"
)

// Text, placeholder and caret colors of the native control per state.
const inputControlClassName =
  "bg-transparent text-body-medium text-text-primary caret-icon-primary outline-none placeholder:text-text-secondary read-only:text-text-read-only disabled:cursor-not-allowed disabled:text-text-disabled disabled:placeholder:text-text-disabled"

// The Leading Icon. Button Clear and the Action Inset use Icon/Primary instead.
const inputIconClassName =
  "size-5 shrink-0 text-icon-secondary group-data-[state=disabled]/input:text-icon-disabled group-data-[state=read-only]/input:text-icon-read-only"

// Icon-only ghost Button sized for the Action Inset slot.
function InputAction({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      size="sm"
      iconOnly
      data-slot="input-action"
      className={cn(
        "text-icon-primary group-data-[state=read-only]/input:text-icon-read-only",
        className
      )}
      {...props}
    />
  )
}

function InputClearButton({
  label = "Clear",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children"> & {
  label?: string
}) {
  return (
    <InputAction aria-label={label} data-slot="input-clear" {...props}>
      <HugeiconsIcon icon={Cancel01Icon} />
    </InputAction>
  )
}

function InputMessage({
  id,
  error,
  children,
}: {
  id?: string
  error?: boolean
  children?: React.ReactNode
}) {
  if (!children) return null
  return (
    <p
      id={id}
      data-slot={error ? "input-error" : "input-help"}
      className={cn(
        "text-body-small",
        error
          ? "text-text-danger-standard"
          : "text-text-secondary group-data-[state=disabled]/input:text-text-disabled"
      )}
    >
      {children}
    </p>
  )
}

export {
  InputAction,
  InputClearButton,
  InputLabel,
  InputMessage,
  InputRoot,
  clearControl,
  inputControlClassName,
  inputFieldClassName,
  inputIconClassName,
  useInputBase,
  type InputBaseProps,
  type InputState,
}
