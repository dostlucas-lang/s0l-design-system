"use client"

import * as React from "react"
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons"

import { HugeiconsIcon } from "@/components/ui/icon"
import { InputAction } from "@/components/ui/input-base"
import { InputText, type InputTextProps } from "@/components/ui/input-text"

// Mirrors the Figma Input Password component: Input Text with Button View in
// the Action Inset slot, which toggles between hidden and visible characters.
type InputPasswordProps = Omit<InputTextProps, "type" | "action"> & {
  /** Accessible name of Button View while the password is hidden. */
  showPasswordLabel?: string
  /** Accessible name of Button View while the password is visible. */
  hidePasswordLabel?: string
}

function InputPassword({
  showPasswordLabel = "Show password",
  hidePasswordLabel = "Hide password",
  disabled,
  ...props
}: InputPasswordProps) {
  const [visible, setVisible] = React.useState(false)

  return (
    <InputText
      type={visible ? "text" : "password"}
      autoComplete="current-password"
      disabled={disabled}
      action={
        <InputAction
          aria-label={visible ? hidePasswordLabel : showPasswordLabel}
          aria-pressed={visible}
          disabled={disabled}
          data-slot="input-password-view"
          onClick={() => setVisible((current) => !current)}
        >
          <HugeiconsIcon icon={visible ? ViewOffSlashIcon : ViewIcon} />
        </InputAction>
      }
      {...props}
    />
  )
}

export { InputPassword, type InputPasswordProps }
