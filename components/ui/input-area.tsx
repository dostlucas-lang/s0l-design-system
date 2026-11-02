"use client"

import * as React from "react"

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

// Mirrors the Figma Input Area component: State (Default / Hover / Active /
// Disabled / Read Only) × Filled × Error, plus Resizable. It shares the label,
// field, Focus ring and messages with Input Text.
//
// The <textarea> fills the whole field so the browser's resize grip sits in the
// field corner. Its padding reserves room for the icon, Button Clear and the
// Resize Area, minus the 1px border Figma draws inside the frame. The native
// grip is hidden in WebKit/Blink and the Figma Resize Handle is drawn on top,
// tinted with the border token.
type InputAreaProps = React.ComponentProps<"textarea"> &
  InputBaseProps & {
    /** Leading 20px icon. */
    icon?: IconSvgElement
    /** Lets the user resize the field vertically and shows the Resize Handle. */
    resizable?: boolean
  }

function InputArea({
  className,
  fieldClassName,
  label,
  requirement,
  info,
  helpText,
  error,
  icon,
  resizable = true,
  clearable = true,
  clearLabel,
  onClear,
  id,
  value,
  defaultValue,
  disabled,
  readOnly,
  onChange,
  ref,
  rows = 1,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  ...props
}: InputAreaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
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

  const setRefs = (node: HTMLTextAreaElement | null) => {
    textareaRef.current = node
    if (typeof ref === "function") ref(node)
    else if (ref) ref.current = node
  }

  return (
    <InputRoot
      data-slot="input-area"
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
        data-slot="input-area-field"
        className={cn(inputFieldClassName, "flex", fieldClassName)}
      >
        {icon && (
          <HugeiconsIcon
            icon={icon}
            data-slot="input-area-icon"
            className={cn(
              inputIconClassName,
              "pointer-events-none absolute top-[9px] left-[11px]"
            )}
          />
        )}
        <textarea
          ref={setRefs}
          id={base.inputId}
          data-slot="input-area-control"
          rows={rows}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          readOnly={readOnly}
          tabIndex={readOnly ? -1 : undefined}
          aria-invalid={base.invalid || undefined}
          aria-describedby={cn(ariaDescribedBy, base.messageId) || undefined}
          onChange={(event) => {
            base.trackFilled(event.currentTarget.value)
            onChange?.(event)
          }}
          className={cn(
            inputControlClassName,
            // Figma: 10px top and bottom around the text, 12px on the sides.
            "block field-sizing-content w-full min-w-0 resize-none rounded-[inherit] py-[9px] pr-[11px] pl-[11px]",
            icon && "pl-[43px]",
            // Button Clear: 32px + 4px inset + 12px gap to the text.
            showClear && "pr-[47px]",
            // Resize Area: 4px padding around the 12px handle.
            resizable &&
              "pb-[29px] not-disabled:resize-y [&::-webkit-resizer]:bg-transparent"
          )}
          {...props}
        />
        {showClear && (
          <InputClearButton
            label={clearLabel}
            className="absolute top-[3px] right-[3px]"
            onClick={() => {
              if (!textareaRef.current) return
              clearControl(textareaRef.current)
              onClear?.()
            }}
          />
        )}
        {resizable && (
          <span
            aria-hidden
            data-slot="input-area-resize-handle"
            className="pointer-events-none absolute right-[2.5px] bottom-[2.5px] size-[13px] bg-border-primary mask-[url(/icons/resize-handle.svg)] mask-no-repeat group-data-[state=disabled]/input:bg-border-disabled-soft group-data-[state=read-only]/input:bg-border-disabled-soft"
          />
        )}
      </div>
      <InputMessage id={base.messageId} error={Boolean(error)}>
        {base.message}
      </InputMessage>
    </InputRoot>
  )
}

export { InputArea, type InputAreaProps }
