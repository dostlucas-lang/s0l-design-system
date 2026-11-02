"use client"

import * as React from "react"
import { format, isValid, parse } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Calendar04Icon } from "@hugeicons/core-free-icons"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"

import { cn } from "@/lib/utils"
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  bottomSheetFooterClassName,
} from "@/components/ui/bottom-sheet"
import { Button } from "@/components/ui/button"
import { Calendar, type CalendarProps } from "@/components/ui/calendar"
import { HugeiconsIcon } from "@/components/ui/icon"
import { InputAction } from "@/components/ui/input-base"
import { InputText, type InputTextProps } from "@/components/ui/input-text"
import { Popover, PopoverContent } from "@/components/ui/popover"

// Mirrors the Figma Input Date and Input Date Range components: an Input Text
// typed as DD/MM/AAAA, with Button Clear and an Action Inset (Calendar icon)
// that opens the Date Picker panel (Calendar in a Popover) below the field.
// Type picks a Day, Month or Year (the panel opens on that grid); Range=True
// is the Input Date Range, two fields sharing the two-month panel.
// Show Footer adds Cancelar / Aplicar: the panel then keeps a draft that
// only Aplicar commits. Without it, picking a date commits and closes.

type DatePickerType = "day" | "month" | "year"

// Field format per Type: date-fns pattern, placeholder and digit groups.
const FORMATS = {
  day: { pattern: "dd/MM/yyyy", placeholder: "DD/MM/AAAA", groups: [2, 2, 4] },
  month: { pattern: "MM/yyyy", placeholder: "MM/AAAA", groups: [2, 4] },
  year: { pattern: "yyyy", placeholder: "AAAA", groups: [4] },
} satisfies Record<
  DatePickerType,
  { pattern: string; placeholder: string; groups: number[] }
>

// Keeps only digits and adds the slashes: "16012026" -> "16/01/2026".
function maskDate(text: string, type: DatePickerType) {
  const { groups } = FORMATS[type]
  let digits = text.replace(/\D/g, "")
  const parts: string[] = []
  for (const size of groups) {
    if (!digits) break
    parts.push(digits.slice(0, size))
    digits = digits.slice(size)
  }
  return parts.join("/")
}

function parseDate(text: string, type: DatePickerType) {
  const { pattern } = FORMATS[type]
  if (text.length !== pattern.length) return undefined
  const date = parse(text, pattern, new Date())
  return isValid(date) ? date : undefined
}

const formatDate = (date: Date | undefined, type: DatePickerType) =>
  date ? format(date, FORMATS[type].pattern) : ""

const sameDate = (a: Date | undefined, b: Date | undefined) =>
  a?.getTime() === b?.getTime()

function useControllableState<T>(
  value: T | undefined,
  defaultValue: T | undefined,
  onChange: ((value: T | undefined) => void) | undefined
) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const current = value !== undefined ? value : uncontrolled
  const setValue = (next: T | undefined) => {
    setUncontrolled(next)
    onChange?.(next)
  }
  return [current, setValue] as const
}

type DateFieldProps = Omit<
  InputTextProps,
  "value" | "defaultValue" | "onChange" | "action" | "type" | "prefix" | "icon"
> & {
  /** Figma Show Icon: the leading Calendar icon. */
  icon?: boolean
}

// An Input Text that holds a typed date. Partial text stays in the field
// until it's a full valid date; on blur it falls back to the last one.
function DateField({
  type,
  date,
  onDateChange,
  trigger,
  icon,
  onBlur,
  ...props
}: DateFieldProps & {
  type: DatePickerType
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
  /** The calendar button: a `PopoverPrimitive.Trigger`. */
  trigger: React.ReactNode
}) {
  const [text, setText] = React.useState(() => formatDate(date, type))
  const [synced, setSynced] = React.useState({ date, type })

  // Follows dates picked in the calendar or set from outside.
  if (!sameDate(date, synced.date) || type !== synced.type) {
    setSynced({ date, type })
    if (type !== synced.type || !sameDate(parseDate(text, type), date)) {
      setText(formatDate(date, type))
    }
  }

  return (
    <InputText
      inputMode="numeric"
      autoComplete="off"
      maxLength={FORMATS[type].pattern.length}
      placeholder={FORMATS[type].placeholder}
      icon={icon ? Calendar04Icon : undefined}
      value={text}
      onChange={(event) => {
        const next = maskDate(event.currentTarget.value, type)
        setText(next)
        const parsed = parseDate(next, type)
        if (next === "") onDateChange(undefined)
        else if (parsed && !sameDate(parsed, date)) onDateChange(parsed)
      }}
      onBlur={(event) => {
        if (text !== "" && !parseDate(text, type)) {
          setText(formatDate(date, type))
        }
        onBlur?.(event)
      }}
      action={trigger}
      {...props}
    />
  )
}

// Action Inset with the Calendar icon. Read Only keeps the icon but can't
// open the panel and leaves the tab order. On mobile it opens the Bottom
// Sheet through `onOpen`, as both Range fields share one sheet.
function DatePickerTrigger({
  id,
  label,
  disabled,
  readOnly,
  mobile,
  onOpen,
}: {
  id?: string
  label: string
  disabled?: boolean
  readOnly?: boolean
  mobile: boolean
  onOpen: () => void
}) {
  if (mobile) {
    return (
      <InputAction
        id={id}
        data-slot="date-picker-trigger"
        aria-label={label}
        aria-haspopup="dialog"
        disabled={disabled || readOnly}
        {...(readOnly && { tabIndex: -1 })}
        onClick={onOpen}
        className="group-data-[state=read-only]/input:data-disabled:text-icon-read-only"
      >
        <HugeiconsIcon icon={Calendar04Icon} />
      </InputAction>
    )
  }

  return (
    <PopoverPrimitive.Trigger
      id={id}
      data-slot="date-picker-trigger"
      disabled={disabled || readOnly}
      {...(readOnly && { tabIndex: -1 })}
      render={
        <InputAction
          aria-label={label}
          className="group-data-[state=read-only]/input:data-disabled:text-icon-read-only"
        />
      }
    >
      <HugeiconsIcon icon={Calendar04Icon} />
    </PopoverPrimitive.Trigger>
  )
}

// Figma Date Picker Footer: Border/Primary on top, small Secondary and
// Primary buttons 12px apart. On the Bottom Sheet it takes the sheet footer
// (Border/Secondary, 20 / 16px) and adds the ghost Limpar at the start.
function DatePickerFooter({
  mobile,
  resetLabel,
  cancelLabel,
  applyLabel,
  onReset,
  onCancel,
  onApply,
}: {
  mobile: boolean
  resetLabel: React.ReactNode
  cancelLabel: React.ReactNode
  applyLabel: React.ReactNode
  onReset: () => void
  onCancel: () => void
  onApply: () => void
}) {
  return (
    <div
      data-slot="date-picker-footer"
      className={
        mobile
          ? bottomSheetFooterClassName
          : "flex items-center justify-end gap-3 border-t border-border-primary px-4 py-3"
      }
    >
      {mobile && (
        <Button variant="ghost" size="sm" className="mr-auto" onClick={onReset}>
          {resetLabel}
        </Button>
      )}
      <Button variant="secondary" size="sm" onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button size="sm" onClick={onApply}>
        {applyLabel}
      </Button>
    </div>
  )
}

// Holds the open state: a Popover, or the Bottom Sheet when Mobile=True.
function DatePickerRoot({
  mobile,
  open,
  triggerId,
  onOpenChange,
  children,
}: {
  mobile: boolean
  open: boolean
  triggerId?: string | null
  onOpenChange: (open: boolean, triggerId: string | null) => void
  children: React.ReactNode
}) {
  if (mobile) {
    return (
      <BottomSheet
        open={open}
        onOpenChange={(next) => onOpenChange(next, null)}
      >
        {children}
      </BottomSheet>
    )
  }

  return (
    <Popover
      open={open}
      triggerId={triggerId}
      onOpenChange={(next, details) =>
        onOpenChange(next, details.trigger?.id ?? null)
      }
    >
      {children}
    </Popover>
  )
}

// The Date Picker panel: a Popover below the field, or the Figma Bottom
// Sheet (draggable down to close) when Mobile=True.
function DatePickerPanel({
  mobile,
  anchor,
  calendar,
  footer,
}: {
  mobile: boolean
  anchor: HTMLElement | null
  calendar: React.ReactNode
  footer: React.ReactNode
}) {
  if (mobile) {
    return (
      <BottomSheetContent data-slot="date-picker-content" data-mobile="">
        <BottomSheetBody data-slot="date-picker-body">
          {calendar}
        </BottomSheetBody>
        {footer}
      </BottomSheetContent>
    )
  }

  return (
    <PopoverContent
      data-slot="date-picker-content"
      anchor={anchor}
      align="start"
      className={panelClassName}
    >
      {calendar}
      {footer}
    </PopoverContent>
  )
}

// Figma Input Date width, kept by each field when Range=True too.
const fieldWidthClassName = "w-60"

// The Date Picker panel: no padding of its own, the Calendar sets it.
const panelClassName = "w-auto gap-0 overflow-hidden p-0"

// The Popover opens below the bordered field, not below the small trigger:
// give the returned ref to the input and the anchor to PopoverContent.
function useFieldAnchor() {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null)
  const ref = React.useCallback((input: HTMLInputElement | null) => {
    setAnchor(
      input?.closest<HTMLElement>('[data-slot="input-text-field"]') ?? null
    )
  }, [])
  return [anchor, ref] as const
}

type DatePickerCommonProps = DateFieldProps & {
  /** Figma Mobile=True: the panel opens as a Bottom Sheet. */
  mobile?: boolean
  /** Figma Show Footer: Cancelar / Aplicar under the calendar. */
  showFooter?: boolean
  /** Mobile only: the ghost action that clears the picked date. */
  resetLabel?: React.ReactNode
  /** "Cancelar" by default, "Voltar" on mobile. */
  cancelLabel?: React.ReactNode
  applyLabel?: React.ReactNode
  /** Accessible name of the calendar button. */
  calendarLabel?: string
  /** Extra Calendar props: `disabledDays`, `startMonth`, `endMonth`… */
  calendarProps?: Omit<
    CalendarProps,
    "range" | "selected" | "onSelect" | "type" | "onPeriodSelect" | "mobile"
  >
}

type DatePickerSingleProps = DatePickerCommonProps & {
  /** Figma Range=False: one field. */
  range?: false
  /** Figma Type: what the field holds and the grid the panel opens on. */
  type?: DatePickerType
  value?: Date
  defaultValue?: Date
  onValueChange?: (date: Date | undefined) => void
}

type DatePickerRangeProps = DatePickerCommonProps & {
  /** Figma Range=True: Data inicial and Data final with a two-month panel. */
  range: true
  /** Range picks days only. */
  type?: "day"
  value?: DateRange
  defaultValue?: DateRange
  onValueChange?: (range: DateRange | undefined) => void
  /** `label`, `error`, `helpText` and `name` go to Data inicial; these to
   * Data final. */
  endLabel?: React.ReactNode
  endError?: React.ReactNode
  endHelpText?: React.ReactNode
  endName?: string
}

type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps

function DatePicker({ range, ...props }: DatePickerProps) {
  return range ? (
    <DateRangeField {...(props as Omit<DatePickerRangeProps, "range">)} />
  ) : (
    <SingleDateField {...(props as Omit<DatePickerSingleProps, "range">)} />
  )
}

function SingleDateField({
  type = "day",
  value: valueProp,
  defaultValue,
  onValueChange,
  mobile = false,
  showFooter = true,
  resetLabel = "Limpar",
  cancelLabel = mobile ? "Voltar" : "Cancelar",
  applyLabel = "Aplicar",
  calendarLabel = "Open calendar",
  calendarProps,
  className,
  disabled,
  readOnly,
  ...props
}: Omit<DatePickerSingleProps, "range">) {
  const [value, setValue] = useControllableState(
    valueProp,
    defaultValue,
    onValueChange
  )
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState(value)
  const [anchor, anchorRef] = useFieldAnchor()

  const pick = (date: Date | undefined) => {
    if (showFooter) {
      setDraft(date)
      return
    }
    setValue(date)
    setOpen(false)
  }

  const changeOpen = (next: boolean) => {
    if (next) setDraft(value)
    setOpen(next)
  }

  return (
    <DatePickerRoot mobile={mobile} open={open} onOpenChange={changeOpen}>
      <DateField
        ref={anchorRef}
        data-slot="date-picker"
        type={type}
        date={value}
        onDateChange={setValue}
        disabled={disabled}
        readOnly={readOnly}
        trigger={
          <DatePickerTrigger
            label={calendarLabel}
            disabled={disabled}
            readOnly={readOnly}
            mobile={mobile}
            onOpen={() => changeOpen(true)}
          />
        }
        {...props}
        className={cn(fieldWidthClassName, className)}
      />
      <DatePickerPanel
        mobile={mobile}
        anchor={anchor}
        calendar={
          <Calendar
            {...calendarProps}
            mobile={mobile}
            type={type}
            selected={showFooter ? draft : value}
            onSelect={pick}
            onPeriodSelect={pick}
          />
        }
        footer={
          showFooter && (
            <DatePickerFooter
              mobile={mobile}
              resetLabel={resetLabel}
              cancelLabel={cancelLabel}
              applyLabel={applyLabel}
              onReset={() => setDraft(undefined)}
              onCancel={() => setOpen(false)}
              onApply={() => {
                setValue(draft)
                setOpen(false)
              }}
            />
          )
        }
      />
    </DatePickerRoot>
  )
}

// Figma Input Date Range: Data inicial and Data final side by side, 16px
// apart. Both calendar buttons open one panel with the Range calendar.
function DateRangeField({
  type = "day",
  className,
  value: valueProp,
  defaultValue,
  onValueChange,
  mobile = false,
  showFooter = true,
  resetLabel = "Limpar",
  cancelLabel = mobile ? "Voltar" : "Cancelar",
  applyLabel = "Aplicar",
  calendarLabel = "Open calendar",
  calendarProps,
  id,
  label = "Data inicial",
  error,
  helpText,
  name,
  endLabel = "Data final",
  endError,
  endHelpText,
  endName,
  disabled,
  readOnly,
  ...props
}: Omit<DatePickerRangeProps, "range">) {
  const [value, setValue] = useControllableState(
    valueProp,
    defaultValue,
    onValueChange
  )
  const [open, setOpen] = React.useState(false)
  const [triggerId, setTriggerId] = React.useState<string | null>(null)
  const [draft, setDraft] = React.useState(value)
  const [anchor, anchorRef] = useFieldAnchor()
  const triggerIdBase = React.useId()

  const changeRange = (next: DateRange | undefined) =>
    setValue(next?.from || next?.to ? next : undefined)

  const fields = {
    from: { id, label, error, helpText, name },
    to: {
      label: endLabel,
      error: endError,
      helpText: endHelpText,
      name: endName,
    },
  }

  const changeOpen = (next: boolean, nextTriggerId: string | null = null) => {
    if (next) setDraft(value)
    setTriggerId(nextTriggerId)
    setOpen(next)
  }

  return (
    <DatePickerRoot
      mobile={mobile}
      open={open}
      triggerId={triggerId}
      onOpenChange={changeOpen}
    >
      <div
        data-slot="date-picker-range"
        className={cn("flex max-w-full items-start gap-4", className)}
      >
        {(["from", "to"] as const).map((edge) => (
          <DateField
            key={edge}
            ref={edge === "from" ? anchorRef : undefined}
            className={cn(fieldWidthClassName, "min-w-0")}
            type={type}
            disabled={disabled}
            readOnly={readOnly}
            date={value?.[edge]}
            onDateChange={(date) =>
              changeRange({ from: value?.from, to: value?.to, [edge]: date })
            }
            trigger={
              <DatePickerTrigger
                id={`${triggerIdBase}-${edge}`}
                label={calendarLabel}
                disabled={disabled}
                readOnly={readOnly}
                mobile={mobile}
                onOpen={() => changeOpen(true)}
              />
            }
            {...props}
            {...fields[edge]}
          />
        ))}
      </div>
      <DatePickerPanel
        mobile={mobile}
        anchor={anchor}
        calendar={
          <Calendar
            {...calendarProps}
            range
            mobile={mobile}
            selected={showFooter ? draft : value}
            onSelect={(next) => {
              if (showFooter) {
                setDraft(next)
                return
              }
              changeRange(next)
              if (next?.from && next.to && !sameDate(next.from, next.to)) {
                setOpen(false)
              }
            }}
          />
        }
        footer={
          showFooter && (
            <DatePickerFooter
              mobile={mobile}
              resetLabel={resetLabel}
              cancelLabel={cancelLabel}
              applyLabel={applyLabel}
              onReset={() => setDraft(undefined)}
              onCancel={() => setOpen(false)}
              onApply={() => {
                changeRange(draft)
                setOpen(false)
              }}
            />
          )
        }
      />
    </DatePickerRoot>
  )
}

export { DatePicker, type DatePickerProps, type DatePickerType }
