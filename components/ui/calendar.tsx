"use client"

import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  useDayPicker,
  type DateRange,
  type DayButtonProps,
  type Matcher,
  type MonthCaptionProps,
  type PropsBase,
} from "react-day-picker"
import { ptBR } from "react-day-picker/locale"
import { format, startOfMonth, type Locale } from "date-fns"
import {
  ArrowDown01Icon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@/components/ui/icon"

// Mirrors the Figma Date Picker panel: Property 1 = Day / Month / Year / Range.
// Day is the DayPicker grid; its caption button opens Month, whose caption
// opens Year. Range (mode="range", two months) has a plain caption and its
// own arrows on each month, as in Figma. The panel surface (border, radius,
// shadow) comes from the Popover, so the Calendar stays flat.

type CalendarView = "day" | "month" | "year"

type CalendarContextValue = {
  locale: Locale
  canChangeView: boolean
  setView: (view: CalendarView) => void
}

const CalendarContext = React.createContext<CalendarContextValue | null>(null)

function useCalendar() {
  const context = React.useContext(CalendarContext)

  if (!context) {
    throw new Error("useCalendar must be used within a Calendar.")
  }

  return context
}

const capitalize = (text: string) =>
  text.charAt(0).toLocaleUpperCase() + text.slice(1)

// Figma Date Time Picker Button: a 40px cell in Body/Medium with the ghost
// Button hover / pressed overlay. State=Active is the Button Primary fill
// with Label/Medium in Text/Inverse; Disabled is Text/Disabled.
const cellClassName = cn(
  "group/cell relative isolate flex min-h-10 w-full min-w-10 flex-col items-center justify-center rounded-md text-body-medium text-text-primary outline-none select-none",
  "after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:transition-colors hover:after:bg-background-hover active:after:bg-background-pressed",
  "focus-visible:z-10 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-border-accent-strong focus-visible:outline-solid",
  "disabled:pointer-events-none disabled:text-text-disabled",
  "data-active:bg-button-primary-standard-background data-active:text-label-medium data-active:text-text-inverse"
)

// One cell of the Day, Month or Year grid. `disabled`, `active` and `today`
// are the Figma State (Default / Active / Disabled) and Today properties.
function CalendarButton({
  className,
  active = false,
  today = false,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  /** State=Active: the selected day, month or year. */
  active?: boolean
  /** Today: the 6px dot under the label. */
  today?: boolean
}) {
  return (
    <button
      type="button"
      data-slot="calendar-button"
      data-active={active || undefined}
      className={cn(cellClassName, className)}
      {...props}
    >
      {children}
      {today && (
        // Icon/Accent/Standard, Icon/Inverse on the Active fill and
        // Icon/Disabled on disabled days.
        <span
          aria-hidden="true"
          data-slot="calendar-today"
          className="absolute bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-icon-accent-standard group-disabled/cell:bg-icon-disabled group-data-outside/cell:bg-icon-disabled group-data-active/cell:bg-icon-inverse"
        />
      )}
    </button>
  )
}

// 7 × 40px cells + 16px on each side.
const panelWidthClassName = "w-78"

// Header: Button Left, Button Month Year (Label/Medium + Chevron Down when it
// switches views) and Button Right.
function CalendarHeader({
  className,
  caption,
  previousLabel,
  nextLabel,
  onPrevious,
  onNext,
  onCaptionClick,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  caption: React.ReactNode
  previousLabel: string
  nextLabel: string
  /** Leave undefined to disable the arrow. */
  onPrevious?: () => void
  onNext?: () => void
  /** Turns the caption into the Button Month Year that switches views. */
  onCaptionClick?: () => void
}) {
  return (
    <div
      data-slot="calendar-header"
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      <Button
        variant="ghost"
        iconOnly
        aria-label={previousLabel}
        disabled={!onPrevious}
        onClick={onPrevious}
        className="text-icon-primary"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} />
      </Button>
      {onCaptionClick ? (
        <Button
          variant="ghost"
          data-slot="calendar-caption"
          onClick={onCaptionClick}
          className="gap-0 px-2.5 text-text-primary"
        >
          <span className="px-1.5">{caption}</span>
          <HugeiconsIcon icon={ArrowDown01Icon} />
        </Button>
      ) : (
        <span
          data-slot="calendar-caption"
          className="px-4 text-label-medium text-text-primary"
        >
          {caption}
        </span>
      )}
      <Button
        variant="ghost"
        iconOnly
        aria-label={nextLabel}
        disabled={!onNext}
        onClick={onNext}
        className="text-icon-primary"
      >
        <HugeiconsIcon icon={ArrowRight02Icon} />
      </Button>
    </div>
  )
}

// Day / Range caption. Every month gets both arrows, which move the whole
// calendar one month, like the Range variant in Figma.
function CalendarMonthCaption({
  calendarMonth,
  displayIndex,
  children,
  ...props
}: MonthCaptionProps) {
  const { goToMonth, previousMonth, nextMonth, labels } = useDayPicker()
  const { canChangeView, setView } = useCalendar()

  return (
    <CalendarHeader
      data-month={format(calendarMonth.date, "yyyy-MM")}
      data-display-index={displayIndex}
      caption={children}
      previousLabel={labels.labelPrevious(previousMonth)}
      nextLabel={labels.labelNext(nextMonth)}
      onPrevious={previousMonth && (() => goToMonth(previousMonth))}
      onNext={nextMonth && (() => goToMonth(nextMonth))}
      onCaptionClick={canChangeView ? () => setView("month") : undefined}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  children,
  ...props
}: DayButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  // Days from other months keep the Disabled look and skip the range fill,
  // as in the Figma grids.
  const outside = modifiers.outside
  const rangeMiddle = !outside && modifiers.range_middle
  const active = !outside && modifiers.selected && !rangeMiddle

  return (
    <CalendarButton
      ref={ref}
      data-slot="calendar-day"
      data-day={format(day.date, "yyyy-MM-dd")}
      active={active}
      today={modifiers.today}
      data-range-start={(!outside && modifiers.range_start) || undefined}
      data-range-end={(!outside && modifiers.range_end) || undefined}
      data-range-middle={rangeMiddle || undefined}
      data-outside={outside || undefined}
      className={cn(
        "data-outside:text-text-disabled",
        // Range: Active First / Active Last round only their outer side and
        // Range days fill the gap with Background/Accent/Soft.
        "data-range-end:not-data-range-start:rounded-l-none data-range-start:not-data-range-end:rounded-r-none",
        "data-range-middle:rounded-none data-range-middle:bg-background-accent-soft data-range-middle:text-text-accent-standard",
        className
      )}
      {...props}
    >
      {children}
    </CalendarButton>
  )
}

// Month (12 months) and Year (a decade plus its neighbours) grids: 4 columns
// of 40px cells, the active one in the Button Primary fill.
function CalendarGridView({
  className,
  mobile,
  caption,
  previousLabel,
  nextLabel,
  onPrevious,
  onNext,
  onCaptionClick,
  items,
}: {
  className?: string
  mobile: boolean
  caption: string
  previousLabel: string
  nextLabel: string
  onPrevious?: () => void
  onNext?: () => void
  onCaptionClick?: () => void
  items: {
    key: string | number
    label: string
    active: boolean
    disabled: boolean
    onSelect: () => void
  }[]
}) {
  return (
    <div
      data-slot="calendar"
      className={cn(
        "flex flex-col bg-background-primary text-text-primary",
        mobile ? "w-full" : panelWidthClassName,
        className
      )}
    >
      <CalendarHeader
        className={mobile ? "py-4" : "p-4"}
        caption={caption}
        previousLabel={previousLabel}
        nextLabel={nextLabel}
        onPrevious={onPrevious}
        onNext={onNext}
        onCaptionClick={onCaptionClick}
      />
      <div
        data-slot="calendar-grid"
        className={cn("grid grid-cols-4", !mobile && "px-4 pb-4")}
      >
        {items.map((item) => (
          <CalendarButton
            key={item.key}
            active={item.active}
            aria-pressed={item.active}
            disabled={item.disabled}
            onClick={item.onSelect}
          >
            {item.label}
          </CalendarButton>
        ))}
      </div>
    </div>
  )
}

const monthIndex = (date: Date) => date.getFullYear() * 12 + date.getMonth()

function getSelectedDate(selected: unknown) {
  if (selected instanceof Date) return selected
  if (Array.isArray(selected)) return selected[0] as Date | undefined
  if (selected && typeof selected === "object" && "from" in selected) {
    return (selected as DateRange).from
  }
  return undefined
}

type CalendarBaseProps = Omit<
  PropsBase,
  | "locale"
  | "captionLayout"
  | "navLayout"
  | "hideNavigation"
  | "numberOfMonths"
  | "showWeekNumber"
  | "mode"
  | "required"
  | "disabled"
> & {
  /** date-fns locale for the captions, week days and labels. */
  locale?: Locale
  /**
   * Figma Property 1: Day, Month or Year, the grid it opens on and what is
   * picked. Month and Year can't go down to days and report the pick through
   * `onPeriodSelect`. The caption still moves up to Month / Year.
   */
  type?: CalendarView
  /** The month or year picked when `type` is "month" or "year". */
  onPeriodSelect?: (date: Date) => void
  /** Days whose Calendar Button is disabled, like past dates or weekends. */
  disabledDays?: Matcher | Matcher[]
  /**
   * Layout for the Bottom Sheet: fills its container with no padding of its
   * own, and Range shows one month with the Month / Year caption.
   */
  mobile?: boolean
}

type CalendarProps = CalendarBaseProps &
  (
    | {
        /** Figma Range=False: one month, one day. */
        range?: false
        selected?: Date
        onSelect?: (date: Date | undefined) => void
      }
    | {
        /** Figma Range=True: two months, a start and an end day. */
        range: true
        selected?: DateRange
        onSelect?: (range: DateRange | undefined) => void
      }
  )

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale = ptBR,
  formatters,
  components,
  month: monthProp,
  defaultMonth,
  onMonthChange,
  startMonth,
  endMonth,
  type = "day",
  onPeriodSelect,
  disabledDays,
  mobile = false,
  range = false,
  selected,
  onSelect,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames()
  const selectedDate = getSelectedDate(selected)

  const [uncontrolledMonth, setUncontrolledMonth] = React.useState(() =>
    startOfMonth(defaultMonth ?? selectedDate ?? new Date())
  )
  const month = monthProp ?? uncontrolledMonth
  const changeMonth = (next: Date) => {
    setUncontrolledMonth(next)
    onMonthChange?.(next)
  }

  // Only the single-month calendar switches views; the two-month Range
  // keeps Day. Mobile shows Range in one month, so it switches too.
  const numberOfMonths = range && !mobile ? 2 : 1
  const canChangeView = numberOfMonths === 1
  const [uncontrolledView, setView] = React.useState<CalendarView>(type)
  const view = canChangeView ? uncontrolledView : "day"

  // The props are split above, so the mode is rebuilt for DayPicker.
  const selection = range
    ? {
        mode: "range" as const,
        selected: selected as DateRange | undefined,
        onSelect: onSelect as
          ((range: DateRange | undefined) => void) | undefined,
      }
    : {
        mode: "single" as const,
        selected: selected as Date | undefined,
        onSelect: onSelect as ((date: Date | undefined) => void) | undefined,
      }

  const contextValue = React.useMemo(
    () => ({ locale, canChangeView, setView }),
    [locale, canChangeView, setView]
  )

  const isOutOfBounds = (from: Date, to: Date) =>
    (startMonth != null && monthIndex(to) < monthIndex(startMonth)) ||
    (endMonth != null && monthIndex(from) > monthIndex(endMonth))

  // Picking days highlights the shown month / year as in Figma; picking a
  // month or year highlights the selection itself.
  const activeDate = type === "day" ? month : selectedDate

  if (view === "month") {
    const year = month.getFullYear()

    return (
      <CalendarGridView
        className={className}
        mobile={mobile}
        caption={String(year)}
        previousLabel="Previous year"
        nextLabel="Next year"
        onPrevious={
          isOutOfBounds(new Date(year - 1, 0), new Date(year - 1, 11))
            ? undefined
            : () => changeMonth(new Date(year - 1, month.getMonth()))
        }
        onNext={
          isOutOfBounds(new Date(year + 1, 0), new Date(year + 1, 11))
            ? undefined
            : () => changeMonth(new Date(year + 1, month.getMonth()))
        }
        onCaptionClick={() => setView("year")}
        items={Array.from({ length: 12 }, (_, index) => {
          const date = new Date(year, index)
          return {
            key: index,
            label: capitalize(format(date, "LLL", { locale }).replace(".", "")),
            active:
              activeDate != null && monthIndex(activeDate) === monthIndex(date),
            disabled: isOutOfBounds(date, date),
            onSelect: () => {
              changeMonth(date)
              if (type === "month") onPeriodSelect?.(date)
              else setView("day")
            },
          }
        })}
      />
    )
  }

  if (view === "year") {
    const decade = Math.floor(month.getFullYear() / 10) * 10

    return (
      <CalendarGridView
        className={className}
        mobile={mobile}
        caption={`${decade}-${decade + 9}`}
        previousLabel="Previous decade"
        nextLabel="Next decade"
        onPrevious={
          isOutOfBounds(new Date(decade - 10, 0), new Date(decade - 1, 11))
            ? undefined
            : () => changeMonth(new Date(decade - 10, month.getMonth()))
        }
        onNext={
          isOutOfBounds(new Date(decade + 10, 0), new Date(decade + 19, 11))
            ? undefined
            : () => changeMonth(new Date(decade + 10, month.getMonth()))
        }
        // Year is the top level: its caption goes back to the type's grid.
        onCaptionClick={type === "year" ? undefined : () => setView(type)}
        items={Array.from({ length: 12 }, (_, index) => {
          const year = decade - 1 + index
          return {
            key: year,
            label: String(year),
            active: activeDate?.getFullYear() === year,
            disabled: isOutOfBounds(new Date(year, 0), new Date(year, 11)),
            onSelect: () => {
              changeMonth(new Date(year, month.getMonth()))
              if (type === "year") onPeriodSelect?.(new Date(year, 0))
              else setView("month")
            },
          }
        })}
      />
    )
  }

  return (
    <CalendarContext.Provider value={contextValue}>
      <DayPicker
        {...selection}
        disabled={disabledDays}
        showOutsideDays={showOutsideDays}
        numberOfMonths={numberOfMonths}
        month={month}
        onMonthChange={changeMonth}
        startMonth={startMonth}
        endMonth={endMonth}
        locale={locale}
        hideNavigation
        className={cn(
          "bg-background-primary text-text-primary",
          mobile ? "w-full" : "w-fit",
          className
        )}
        formatters={{
          formatCaption: (date) =>
            capitalize(format(date, "LLLL y", { locale })),
          // One letter per week day: D S T Q Q S S.
          formatWeekdayName: (date) =>
            format(date, "ccccc", { locale }).toLocaleUpperCase(locale.code),
          ...formatters,
        }}
        classNames={{
          root: cn(mobile ? "w-full" : "w-fit", defaultClassNames.root),
          months: cn("flex flex-col md:flex-row", defaultClassNames.months),
          // The Range halves keep 16px outside and 8px between the months.
          // Mobile: the Bottom Sheet body sets the padding and the 7 columns
          // share its width.
          month: cn(
            "flex flex-col",
            mobile
              ? "w-full"
              : "px-4 pb-4 not-only:first:pr-2 not-only:last:pl-2",
            defaultClassNames.month
          ),
          month_caption: cn("py-4", defaultClassNames.month_caption),
          month_grid: cn(
            "border-collapse",
            mobile && "w-full",
            defaultClassNames.month_grid
          ),
          weekdays: cn("flex", defaultClassNames.weekdays),
          weekday: cn(
            "flex h-10 items-center justify-center p-0 text-label-medium text-text-primary select-none",
            mobile ? "min-w-10 flex-1" : "w-10",
            defaultClassNames.weekday
          ),
          week: cn("flex", defaultClassNames.week),
          day: cn(
            "p-0 text-center",
            mobile ? "min-w-10 flex-1" : "w-10",
            defaultClassNames.day
          ),
          hidden: cn("invisible", defaultClassNames.hidden),
          ...classNames,
        }}
        components={{
          Root: ({ className, rootRef, ...props }) => (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={className}
              {...props}
            />
          ),
          MonthCaption: CalendarMonthCaption,
          DayButton: CalendarDayButton,
          ...components,
        }}
        {...props}
      />
    </CalendarContext.Provider>
  )
}

export {
  Calendar,
  CalendarButton,
  CalendarDayButton,
  type CalendarProps,
  type CalendarView,
}
