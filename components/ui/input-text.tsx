"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { HugeiconsIcon, type IconSvgElement } from "@/components/ui/icon"
import { cn } from "@/lib/utils"
import {
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
} from "@/components/ui/input-base"

// Mirrors the Figma Input Text component: State (Default / Hover / Active /
// Disabled / Read Only) × Filled × Error. Hover, Active (focus) and Filled come
// from the browser; Disabled, Read Only and Error from props. Input Search and
// Input Password are built on top of this component.
type InputTextProps = Omit<InputPrimitive.Props, "prefix" | "className"> &
  InputBaseProps & {
    /** Classes for the root, around the label, field and messages. */
    className?: string
    /** Leading 20px icon. */
    icon?: IconSvgElement
    /** Text before the value, like "R$" or "https://". */
    prefix?: React.ReactNode
    /** Action Inset: trailing slot for an `InputAction`. */
    action?: React.ReactNode
  }

function InputText({
  className,
  fieldClassName,
  label,
  requirement,
  info,
  helpText,
  error,
  icon,
  prefix,
  clearable = true,
  clearLabel,
  onClear,
  action,
  id,
  value,
  defaultValue,
  disabled,
  readOnly,
  onChange,
  ref,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  ...props
}: InputTextProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const base = useInputBase({
    id,
    value,
    defaultValue,
    disabled,
    readOnly,
    error,
    helpText,
    ariaInvalid,
  })
  const showClear = clearable && base.showClear

  const setRefs = (node: HTMLInputElement | null) => {
    inputRef.current = node
    if (typeof ref === "function") ref(node)
    else if (ref) ref.current = node
  }

  return (
    <InputRoot
      data-slot="input-text"
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
      <div
        data-slot="input-text-field"
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
              data-slot="input-text-icon"
              className={inputIconClassName}
            />
          )}
          <div className="flex min-w-0 flex-1 items-center gap-1 text-body-medium">
            {prefix && (
              <span
                data-slot="input-text-prefix"
                className="shrink-0 text-text-secondary group-data-[state=disabled]/input:text-text-disabled group-data-[state=read-only]/input:text-text-read-only"
              >
                {prefix}
              </span>
            )}
            <InputPrimitive
              ref={setRefs}
              id={base.inputId}
              data-slot="input-text-input"
              value={value}
              defaultValue={defaultValue}
              disabled={disabled}
              readOnly={readOnly}
              tabIndex={readOnly ? -1 : undefined}
              aria-invalid={base.invalid || undefined}
              aria-describedby={
                cn(ariaDescribedBy, base.messageId) || undefined
              }
              onChange={(event) => {
                base.trackFilled(event.currentTarget.value)
                onChange?.(event)
              }}
              className={cn(
                inputControlClassName,
                "h-6 w-full min-w-0 truncate"
              )}
              {...props}
            />
          </div>
        </div>
        {(showClear || action) && (
          // 3px + the 1px border = the 4px Action Inset padding in Figma.
          <div className="flex shrink-0 items-center self-stretch pr-[3px]">
            {showClear && (
              <InputClearButton
                label={clearLabel}
                onClick={() => {
                  if (!inputRef.current) return
                  clearControl(inputRef.current)
                  onClear?.()
                }}
              />
            )}
            {action}
          </div>
        )}
      </div>
      <InputMessage id={base.messageId} error={Boolean(error)}>
        {base.message}
      </InputMessage>
    </InputRoot>
  )
}

export { InputText, type InputTextProps }
