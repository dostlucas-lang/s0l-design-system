"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusSignIcon } from "@hugeicons/core-free-icons"

import { HugeiconsIcon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"
import {
  InputLabel,
  InputMessage,
  InputRoot,
  useInputBase,
  type InputBaseProps,
} from "@/components/ui/input-base"

// Mirrors the Figma Input OTP component: Filled × Error, with one .Input OTP
// Item per character (56px square, 16px apart). The Active item shows the
// Focus ring 2px away from its border and the .Type Indicator caret; Error
// paints the Focus Error ring on every item. Label, Text Help and Text Error
// come from the shared Input pieces, as do the Disabled and Read Only colors.
type InputOTPProps = Omit<
  React.ComponentProps<typeof OTPInput>,
  "render" | "children" | "className"
> &
  Pick<
    InputBaseProps,
    "label" | "requirement" | "info" | "helpText" | "error"
  > & {
    /** Classes for the root, around the label, items and messages. */
    className?: string
    /** Custom groups and items; one group with `maxLength` items by default. */
    children?: React.ReactNode
  }

function InputOTP({
  className,
  containerClassName,
  label,
  requirement,
  info,
  helpText,
  error,
  id,
  value,
  defaultValue,
  disabled,
  readOnly,
  maxLength,
  children,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  ...props
}: InputOTPProps) {
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

  return (
    <InputRoot
      data-slot="input-otp"
      state={base.state}
      invalid={base.invalid}
      filled={base.filled}
      className={cn("w-fit", className)}
    >
      <InputLabel
        state={base.state}
        htmlFor={base.inputId}
        label={label}
        requirement={requirement}
        info={info}
      />
      <OTPInput
        id={base.inputId}
        data-slot="input-otp-input"
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        readOnly={readOnly}
        tabIndex={readOnly ? -1 : undefined}
        maxLength={maxLength}
        aria-invalid={base.invalid || undefined}
        aria-describedby={cn(ariaDescribedBy, base.messageId) || undefined}
        spellCheck={false}
        containerClassName={cn(
          "flex items-center gap-4 has-disabled:cursor-not-allowed",
          containerClassName
        )}
        className="disabled:cursor-not-allowed"
        {...props}
      >
        {children ?? (
          <InputOTPGroup>
            {Array.from({ length: maxLength }, (_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        )}
      </OTPInput>
      <InputMessage id={base.messageId} error={Boolean(error)}>
        {base.message}
      </InputMessage>
    </InputRoot>
  )
}

// Figma "Inputs": items 16px apart.
function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-4", className)}
      {...props}
    />
  )
}

// Figma .Input OTP Item: State (Default / Active) × Filled × Error.
function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      data-filled={char != null || undefined}
      className={cn(
        "relative flex size-14 items-center justify-center rounded-md border border-border-primary bg-background-surface text-body-medium text-text-primary transition-colors",
        "outline-offset-2 outline-border-accent-strong group-data-invalid/input:outline-3 group-data-invalid/input:outline-border-danger-strong group-data-invalid/input:outline-solid group-data-[state=default]/input:data-[active=true]:outline-3 group-data-[state=default]/input:data-[active=true]:outline-solid",
        "group-data-[state=disabled]/input:border-border-disabled-soft group-data-[state=disabled]/input:text-text-disabled group-data-[state=read-only]/input:border-border-disabled-soft group-data-[state=read-only]/input:text-text-read-only",
        className
      )}
      {...props}
    >
      {char}
      {/* .Type Indicator: 1.5px × 16px, after the character when filled. */}
      {isActive && (
        <span
          aria-hidden
          data-slot="input-otp-caret"
          className="h-4 w-[1.5px] animate-caret-blink bg-icon-primary"
        />
      )}
    </div>
  )
}

// Not in the Figma component: splits the items into groups, like 123–456.
function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center text-icon-secondary group-data-[state=disabled]/input:text-icon-disabled [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <HugeiconsIcon icon={MinusSignIcon} />
    </div>
  )
}

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  type InputOTPProps,
}
