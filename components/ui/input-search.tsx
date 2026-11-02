"use client"

import { Search01Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { InputText, type InputTextProps } from "@/components/ui/input-text"

// Mirrors the Figma Input Search component: Input Text with the Search icon,
// no label and no error state. The browser's own clear button is hidden so
// only Button Clear shows.
type InputSearchProps = Omit<
  InputTextProps,
  "type" | "icon" | "label" | "requirement" | "info" | "error" | "prefix"
>

function InputSearch({
  className,
  placeholder = "Search",
  ...props
}: InputSearchProps) {
  return (
    <InputText
      type="search"
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
