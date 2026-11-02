"use client"

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"

import { HugeiconsIcon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"
import {
  Dropdown,
  DropdownCheckboxItem,
  DropdownContent,
  DropdownGroup,
  DropdownTrigger,
} from "@/components/ui/dropdown"

// Mirrors the Figma Chip component: Size (Small / Medium) × State (Default /
// Hover / Disabled) × Active × Menu, with Show Icon. The paddings are the
// Figma ones: 6px (Small) / 10px (Medium) around the content, 2px (Space/100)
// before the icon and after the chevron, 6px around the label. The Figma
// stroke sits inside the frame, so it is an inset ring that takes no space.
const chipVariants = cva(
  "group/chip relative isolate inline-flex w-fit shrink-0 items-center rounded-full text-label-small whitespace-nowrap transition-colors select-none after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-border-accent-strong focus-visible:outline-solid data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      size: {
        sm: "min-h-6 px-1.5",
        md: "min-h-8 px-2.5",
      },
      active: {
        // Active=False: Button Secondary stroke, label and icon; Hover fills
        // with Background/Hover under the stroke.
        false:
          "text-button-secondary-standard-label inset-ring inset-ring-button-secondary-standard-border [--chip-icon:var(--s0l-button-secondary-standard-icon)] hover:bg-background-hover data-disabled:inset-ring-border-disabled-soft",
        // Active=True: Background/Accent/Strong with On Color label and icons;
        // Hover is Background/Hover stacked on the fill (::after).
        true: "bg-background-accent-strong text-text-on-color [--chip-icon:var(--s0l-icon-on-color)] hover:after:bg-background-hover data-disabled:bg-background-disabled-strong",
      },
    },
    defaultVariants: {
      size: "md",
      active: false,
    },
  }
)

// Menu chips show what was picked: the labels joined by ", " up to
// `maxLength` characters, and "+X" for the ones that didn't fit. A first
// label longer than `maxLength` is cut with "…".
function formatChipValues(values: readonly string[], maxLength = 40) {
  let text = ""
  let shown = 0

  for (const value of values) {
    const next = shown === 0 ? value : `${text}, ${value}`
    if (next.length > maxLength) break
    text = next
    shown++
  }

  if (shown === 0 && values.length > 0) {
    text = `${values[0].slice(0, maxLength - 1)}…`
    shown = 1
  }

  return { text, rest: values.length - shown }
}

type ChipProps = ButtonPrimitive.Props &
  Omit<VariantProps<typeof chipVariants>, "active"> & {
    /**
     * Figma Active: the selected chip, with the Accent fill. A Menu chip is
     * Active while it has `values`, unless this is set.
     */
    active?: boolean
    /** Figma Show Icon: the 16px leading icon. */
    icon?: React.ReactNode
    /**
     * Figma Menu: shows the Chevron Down. Render the chip as the trigger of
     * a Dropdown, Popover or Bottom Sheet (`render={<Chip menu />}`), or use
     * ChipMenu for the multiple-selection Dropdown.
     */
    menu?: boolean
    /**
     * Menu: the picked options' labels. They replace the label (`children`),
     * joined by ", " up to `maxLength` characters, then "+X".
     */
    values?: readonly string[]
    /** Characters of `values` shown before "+X". */
    maxLength?: number
  }

function Chip({
  className,
  size = "md",
  active: activeProp,
  menu = false,
  icon,
  values,
  maxLength = 40,
  children,
  ...props
}: ChipProps) {
  const picked = menu && values && values.length > 0 ? values : undefined
  const active = activeProp ?? !!picked
  const { text, rest } = picked
    ? formatChipValues(picked, maxLength)
    : { text: undefined, rest: 0 }

  return (
    <ButtonPrimitive
      data-slot="chip"
      data-active={active || undefined}
      // A plain chip is a toggle (filter); a Menu chip opens a menu, so its
      // trigger (Popover / Dropdown) sets aria-expanded instead.
      aria-pressed={menu ? undefined : active}
      // The full list, for the labels cut down to "+X".
      title={rest > 0 ? picked?.join(", ") : undefined}
      className={cn(
        chipVariants({ size, active }),
        // State=Disabled: Text / Icon Disabled.
        "data-disabled:text-text-disabled data-disabled:[--chip-icon:var(--s0l-icon-disabled)]",
        className
      )}
      {...props}
    >
      {icon && (
        <span data-slot="chip-icon" className="flex pl-0.5 text-(--chip-icon)">
          {icon}
        </span>
      )}
      <span data-slot="chip-label" className="px-1.5">
        {picked ? (
          <>
            {text}
            {rest > 0 && <span data-slot="chip-rest"> +{rest}</span>}
          </>
        ) : (
          children
        )}
      </span>
      {menu && (
        <span
          data-slot="chip-chevron"
          className="flex pr-0.5 text-(--chip-icon)"
        >
          <HugeiconsIcon icon={ArrowDown01Icon} />
        </span>
      )}
    </ButtonPrimitive>
  )
}

type ChipMenuOption = {
  value: string
  label: string
  disabled?: boolean
}

// A Menu chip that opens the Figma Dropdown (Selection Multiple, or the
// Bottom Sheet when `mobile`). Picking options shows them on the chip. For
// another panel (Popover, Date Picker, Bottom Sheet), render <Chip menu
// values={…} /> as that component's trigger instead.
function ChipMenu({
  options,
  value: valueProp,
  defaultValue = [],
  onValueChange,
  mobile = false,
  open,
  onOpenChange,
  header,
  footer,
  children,
  ...props
}: Omit<ChipProps, "menu" | "values" | "value" | "defaultValue"> & {
  options: readonly ChipMenuOption[]
  /** The picked options' `value`s. */
  value?: readonly string[]
  defaultValue?: readonly string[]
  onValueChange?: (value: string[]) => void
  /** Figma Mobile=True: the options open in the Bottom Sheet. */
  mobile?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Dropdown Show Header (a search field or any slot). */
  header?: React.ReactNode
  /** Dropdown Show Footer (actions or any slot). */
  footer?: React.ReactNode
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = valueProp ?? uncontrolled
  // Shown in the options' order, not in the order they were picked.
  const values = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label)

  const toggle = (optionValue: string, checked: boolean) => {
    const next = checked
      ? options
          .map((option) => option.value)
          .filter((item) => item === optionValue || value.includes(item))
      : value.filter((item) => item !== optionValue)
    setUncontrolled(next)
    onValueChange?.(next)
  }

  return (
    <Dropdown
      mobile={mobile}
      open={open}
      onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined}
    >
      <DropdownTrigger render={<Chip {...props} menu values={values} />}>
        {children}
      </DropdownTrigger>
      <DropdownContent header={header} footer={footer}>
        <DropdownGroup>
          {options.map((option) => (
            <DropdownCheckboxItem
              key={option.value}
              disabled={option.disabled}
              checked={value.includes(option.value)}
              onCheckedChange={(checked) => toggle(option.value, checked)}
            >
              {option.label}
            </DropdownCheckboxItem>
          ))}
        </DropdownGroup>
      </DropdownContent>
    </Dropdown>
  )
}

// Mirrors the Figma Chip Group: label, help text and the wrapping chips
// (12px between rows, 8px between chips).
function ChipGroup({
  label,
  helpText,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** Group label (Figma .Label). */
  label?: React.ReactNode
  /** Figma "Show Text Help". */
  helpText?: React.ReactNode
}) {
  const labelId = React.useId()

  return (
    <div
      role="group"
      data-slot="chip-group"
      aria-labelledby={label ? labelId : undefined}
      className={cn("flex flex-col items-start gap-4", className)}
      {...props}
    >
      {label && (
        <div id={labelId} className="text-label-small text-text-primary">
          {label}
        </div>
      )}
      {helpText && (
        <p className="text-body-small text-text-secondary">{helpText}</p>
      )}
      <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-3">
        {children}
      </div>
    </div>
  )
}

export {
  Chip,
  ChipGroup,
  ChipMenu,
  chipVariants,
  formatChipValues,
  type ChipMenuOption,
  type ChipProps,
}
