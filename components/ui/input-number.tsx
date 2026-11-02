"use client"

import * as React from "react"
import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field"
import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons"

import { HugeiconsIcon, type IconSvgElement } from "@/components/ui/icon"
import { cn } from "@/lib/utils"
import {
  InputAction,
  InputLabel,
  InputMessage,
  InputRoot,
  inputControlClassName,
  inputFieldClassName,
  inputIconClassName,
  useInputBase,
  type InputBaseProps,
} from "@/components/ui/input-base"

// Mirrors the Figma Input Number component: State (Default / Hover / Active /
// Disabled / Read Only) × Filled × Error. It shares the label, field, Focus
// ring and messages with Input Text; instead of Button Clear the field ends
// with Button Minus and Button Plus (ghost, 32px, 4px apart). Built on the
// Base UI NumberField, so Arrow Up / Down, min, max and step work too.
type InputNumberProps = Omit<
  NumberFieldPrimitive.Root.Props,
  "className" | "render"
> &
  Omit<InputBaseProps, "clearable" | "clearLabel" | "onClear"> & {
    /** Classes for the root, around the label, field and messages. */
    className?: string
    /** Leading 20px icon. */
    icon?: IconSvgElement
    /** Text shown while empty. */
    placeholder?: string
    /** Accessible name of Button Minus. */
    decrementLabel?: string
    /** Accessible name of Button Plus. */
    incrementLabel?: string
  }

// Read Only keeps the buttons in Icon/Read Only, not the disabled color.
const actionClassName =
  "group-data-[state=read-only]/input:data-disabled:text-icon-read-only"

function InputNumber({
  className,
  fieldClassName,
  label,
  requirement,
  info,
  helpText,
  error,
  icon,
  placeholder,
  decrementLabel = "Decrease",
  incrementLabel = "Increase",
  id,
  value,
  defaultValue,
  onValueChange,
  disabled,
  readOnly,
  ...props
}: InputNumberProps) {
  const base = useInputBase({
    id,
    value: value === undefined ? undefined : (value ?? ""),
    defaultValue,
    disabled,
    readOnly,
    error,
    helpText,
  })
  // The buttons can't change a Read Only value and leave the tab order.
  const buttonProps = {
    disabled: disabled || readOnly,
    ...(readOnly && { tabIndex: -1 }),
  }

  return (
    <InputRoot
      data-slot="input-number"
      state={base.state}
      invalid={base.invalid}
      filled={base.filled}
      className={className}
    >
      <InputLabel
        state={base.state}
        htmlFor={base.inputId}
        label={label}
        requirement={requirement}
        info={info}
      />
      <NumberFieldPrimitive.Root
        id={base.inputId}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        readOnly={readOnly}
        onValueChange={(next, details) => {
          base.trackFilled(next == null ? "" : String(next))
          onValueChange?.(next, details)
        }}
        className="w-full"
        {...props}
      >
        <NumberFieldPrimitive.Group
          data-slot="input-number-field"
          className={cn(
            inputFieldClassName,
            "flex min-h-10 items-center",
            fieldClassName
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3 self-stretch px-3">
            {icon && (
              <HugeiconsIcon
                icon={icon}
                data-slot="input-number-icon"
                className={inputIconClassName}
              />
            )}
            <NumberFieldPrimitive.Input
              data-slot="input-number-input"
              placeholder={placeholder}
              {...(readOnly && { tabIndex: -1 })}
              aria-invalid={base.invalid || undefined}
              aria-describedby={base.messageId}
              className={cn(
                inputControlClassName,
                "h-6 w-full min-w-0 truncate"
              )}
            />
          </div>
          {/* Buttons: 4px apart; 3px + the 1px border = the 4px inset. */}
          <div className="flex shrink-0 items-center gap-1 self-stretch pr-[3px]">
            <NumberFieldPrimitive.Decrement
              data-slot="input-number-decrement"
              {...buttonProps}
              render={
                <InputAction
                  aria-label={decrementLabel}
                  className={actionClassName}
                />
              }
            >
              <HugeiconsIcon icon={MinusSignIcon} />
            </NumberFieldPrimitive.Decrement>
            <NumberFieldPrimitive.Increment
              data-slot="input-number-increment"
              {...buttonProps}
              render={
                <InputAction
                  aria-label={incrementLabel}
                  className={actionClassName}
                />
              }
            >
              <HugeiconsIcon icon={PlusSignIcon} />
            </NumberFieldPrimitive.Increment>
          </div>
        </NumberFieldPrimitive.Group>
      </NumberFieldPrimitive.Root>
      <InputMessage id={base.messageId} error={Boolean(error)}>
        {base.message}
      </InputMessage>
    </InputRoot>
  )
}

export { InputNumber, type InputNumberProps }
