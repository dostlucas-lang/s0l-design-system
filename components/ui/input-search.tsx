"use client"

import { Search01Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { InputText, type InputTextProps } from "@/components/ui/input-text"

// Mirrors the Figma Input Search component: Input Text with the Search icon,
// no label and no error state. The browser's own clear button is hidden so
// only Button Clear shows. With no visible label, the field is named by
// `aria-label`, which defaults to the placeholder.
type InputSearchProps = Omit<
  InputTextProps,
  "type" | "icon" | "label" | "requirement" | "info" | "error" | "prefix"
>

function InputSearch({
  className,
  placeholder = "Search",
  "aria-label": ariaLabel,
  ...props
}: InputSearchProps) {
  return (
    <InputText
      type="search"
      aria-label={
        ariaLabel ?? (props["aria-labelledby"] ? undefined : placeholder)
      }
      icon={Search01Icon}
      placeholder={placeholder}
      data-variant="search"
      className={cn(
        "[&_input::-webkit-search-cancel-button]:appearance-none",
        className
      )}
      {...props}
    />
  )
}

export { InputSearch, type InputSearchProps }
