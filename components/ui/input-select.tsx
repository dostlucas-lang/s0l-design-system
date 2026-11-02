"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons"

import { HugeiconsIcon, type IconSvgElement } from "@/components/ui/icon"
import { cn } from "@/lib/utils"
import {
  DropdownItemCheck,
  DropdownItemIcon,
  DropdownItemText,
  dropdownBodyClassName,
  dropdownItemClassName,
  dropdownPopupClassName,
  type DropdownItemContentProps,
} from "@/components/ui/dropdown"
import {
  InputClearButton,
  InputLabel,
  InputMessage,
  InputRoot,
  inputFieldClassName,
  inputIconClassName,
  useInputBase,
  type InputBaseProps,
} from "@/components/ui/input-base"

// Mirrors the Figma Input Select component: State (Default / Hover / Active /
// Disabled / Read Only) × Filled × Error. It shares the label, field, Focus
// ring and messages with Input Text; Active is the open list, shown with the
// Focus ring and Chevron Up. The list itself is the Figma Dropdown with
// .Dropdown Item Single rows.
//
// The trigger fills the field so the whole field opens the list. Button Clear
// can't live inside the trigger button, so it sits on top of a spacer that
// keeps the value clear of it.
type InputSelectProps<Value> = Omit<
  SelectPrimitive.Root.Props<Value>,
  "multiple" | "onValueChange" | "children"
> &
  InputBaseProps & {
    /** Classes for the root, around the label, field and messages. */
    className?: string
    /** Text shown while nothing is selected. */
    placeholder?: React.ReactNode
    /** Leading 20px icon. */
    icon?: IconSvgElement
    /** Text before the value, like "R$" or "+55". */
    prefix?: React.ReactNode
    onValueChange?: (value: Value | null) => void
    /** The options: `InputSelectItem`, `InputSelectGroup`... */
    children?: React.ReactNode
    /** Props for the list popup. */
    contentProps?: InputSelectContentProps
    /** Accessible name of the field, when it has no `label`. */
    "aria-label"?: string
  }

function InputSelect<Value>({
  className,
  fieldClassName,
  label,
  requirement,
  info,
  helpText,
  error,
  icon,
  prefix,
  placeholder,
  clearable = true,
  clearLabel,
  onClear,
  id,
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled,
  readOnly,
  children,
  contentProps,
  "aria-label": ariaLabel,
  ...props
}: InputSelectProps<Value>) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    Value | null | undefined
  >(defaultValue)
  const value = valueProp !== undefined ? valueProp : uncontrolledValue

  const base = useInputBase({
    id,
    value: value ?? "",
    disabled,
    readOnly,
    error,
    helpText,
  })
  const showClear = clearable && base.showClear

  const changeValue = (next: Value | null) => {
    setUncontrolledValue(next)
    onValueChange?.(next)
  }

  return (
    <InputRoot
      data-slot="input-select"
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
      <SelectPrimitive.Root
        value={value ?? null}
        onValueChange={(next) => changeValue(next as Value | null)}
        disabled={disabled}
        readOnly={readOnly}
        {...props}
      >
        <div
          data-slot="input-select-field"
          className={cn(
            inputFieldClassName,
            "flex min-h-10 items-center",
            // Active: the list is open and focus moved into it.
            "group-data-[state=default]/input:has-data-popup-open:outline-3 group-data-[state=default]/input:has-data-popup-open:outline-solid",
            fieldClassName
          )}
        >
          <SelectPrimitive.Trigger
            id={base.inputId}
            data-slot="input-select-trigger"
            // Only when read-only: an explicit undefined would drop Base UI's tabIndex.
            {...(readOnly && { tabIndex: -1 })}
            aria-label={ariaLabel}
            aria-invalid={base.invalid || undefined}
            aria-describedby={base.messageId}
            className="group/input-select-trigger flex min-h-[38px] w-full min-w-0 items-center self-stretch rounded-[inherit] px-[11px] text-left text-body-medium outline-none data-disabled:cursor-not-allowed"
          >
            {icon && (
              <HugeiconsIcon
                icon={icon}
                data-slot="input-select-icon"
                className={cn(inputIconClassName, "mr-3")}
              />
            )}
            <span className="mr-3 flex min-w-0 flex-1 items-center gap-1">
              {prefix && base.filled && (
                <span
                  data-slot="input-select-prefix"
                  className="shrink-0 text-text-secondary group-data-[state=disabled]/input:text-text-disabled group-data-[state=read-only]/input:text-text-read-only"
                >
                  {prefix}
                </span>
              )}
              <SelectPrimitive.Value
                data-slot="input-select-value"
                placeholder={placeholder}
                className="min-w-0 flex-1 truncate text-text-primary group-data-[state=disabled]/input:text-text-disabled group-data-[state=read-only]/input:text-text-read-only data-placeholder:text-text-secondary group-data-[state=disabled]/input:data-placeholder:text-text-disabled"
              />
            </span>
            {/* Button Clear (32px) + its 4px inset. */}
            {showClear && <span aria-hidden className="w-9 shrink-0" />}
            <SelectPrimitive.Icon
              data-slot="input-select-chevron"
              className={cn(inputIconClassName, "flex text-icon-primary")}
            >
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                className="size-5 group-data-popup-open/input-select-trigger:hidden"
              />
              <HugeiconsIcon
                icon={ArrowUp01Icon}
                className="hidden size-5 group-data-popup-open/input-select-trigger:block"
              />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          {showClear && (
            <InputClearButton
              label={clearLabel}
              className="absolute top-1/2 right-[35px] -translate-y-1/2"
              onClick={() => {
                changeValue(null)
                document.getElementById(base.inputId)?.focus()
                onClear?.()
              }}
            />
          )}
        </div>
        <InputSelectContent {...contentProps}>{children}</InputSelectContent>
      </SelectPrimitive.Root>
      <InputMessage id={base.messageId} error={Boolean(error)}>
        {base.message}
      </InputMessage>
    </InputRoot>
  )
}

type InputSelectContentProps = Omit<SelectPrimitive.Popup.Props, "children"> &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & { children?: React.ReactNode }

// The Figma Dropdown, as wide as the field and opening below it.
function InputSelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset = 0,
  ...props
}: InputSelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={false}
        className="isolate z-50 outline-none"
      >
        <SelectPrimitive.Popup
          data-slot="input-select-content"
          className={cn(dropdownPopupClassName, "min-w-0", className)}
          {...props}
        >
          <SelectPrimitive.List
            data-slot="input-select-list"
            className={dropdownBodyClassName}
          >
            {children}
          </SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

// Figma .Dropdown Item Single: a trailing check circle when selected.
function InputSelectItem({
  className,
  icon,
  description,
  children,
  ...props
}: SelectPrimitive.Item.Props & DropdownItemContentProps) {
  return (
    <SelectPrimitive.Item
      data-slot="input-select-item"
      className={cn(dropdownItemClassName, className)}
      {...props}
    >
      <DropdownItemIcon icon={icon} />
      <DropdownItemText description={description}>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </DropdownItemText>
      <SelectPrimitive.ItemIndicator
        data-slot="input-select-item-indicator"
        className="flex size-6 shrink-0 items-center justify-center"
      >
        <DropdownItemCheck />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

// A Figma Dropdown section: items 8px apart.
function InputSelectGroup({
  className,
  ...props
}: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="input-select-group"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function InputSelectGroupLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="input-select-group-label"
      className={cn(
        "px-3 pt-1 text-label-small text-text-secondary",
        className
      )}
      {...props}
    />
  )
}

// Figma .Dropdown Divider, same as DropdownSeparator.
function InputSelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="input-select-separator"
      className={cn("mb-2 h-px shrink-0 bg-border-secondary", className)}
      {...props}
    />
  )
}

export {
  InputSelect,
  InputSelectContent,
  InputSelectGroup,
  InputSelectGroupLabel,
  InputSelectItem,
  InputSelectSeparator,
  type InputSelectContentProps,
  type InputSelectProps,
}
