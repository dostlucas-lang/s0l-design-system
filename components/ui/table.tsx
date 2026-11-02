"use client"

import * as React from "react"
import {
  ArrowDown01Icon,
  ArrowDown02Icon,
  ArrowRight02Icon,
  ArrowUp02Icon,
  HelpCircleIcon,
  MoreVerticalIcon,
} from "@hugeicons/core-free-icons"
import { cva, type VariantProps } from "class-variance-authority"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/dropdown"
import { HugeiconsIcon, type IconSvgElement } from "@/components/ui/icon"
import { RadioButton, RadioGroup } from "@/components/ui/radio-button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Mirrors the Figma Table, on a native <table>:
// - Rows are 56px with a Border/Secondary line inside them, so the padding under
//   a 40px button or input takes that 1px.
// - .Table Title Cell is TableHead, .Table Cell is TableCell, and .Table Cell
//   Selection, Accordion, Actions and Skeleton are their own components, with
//   `title` for Title=True.
// - Loading=True is `loading` on Table: every cell turns into its skeleton.
// - `selectable` on Table adds the .Table Cell Selection column by itself, after
//   the Accordion one, and the Table keeps the selection: each row only needs a
//   `value`. Single is a Radio Button per row, Multiple a Checkbox, with the title
//   one selecting all the rows that aren't disabled.
// - Accordion=True is TableRowAccordion, Empty=True is TableEmpty.
// - Table Row State: Hover fills the row with Background/Hover, over the body
//   rows only, and Disabled is the whole row at 50%, with its cells unchanged.
// - `actions` on Table adds the .Table Actions column by itself: each row gives
//   its `actions` and the Table type picks how they show.
// - Sorting lives in the Table: with sortable columns, exactly one always sorts
//   it, the first one until another is pressed. Pressing it again flips between
//   Ascending and Descending. TableBody reorders its rows by their `sortValues`,
//   and rows without them stay put, for data sorted elsewhere.
// - Fixed Columns=True is `fixedColumns` on Table, for the selection and actions
//   columns, and `fixed` on the other cells: they stick to their side, and the
//   last one on the left and the right one take the Figma Content Left and Content
//   Right line and Shadow/Large.
// - `overflowMethod` on Table sets what long text does in the text cells and
//   titles: Line Break wraps it and the row grows, Truncate keeps one line with
//   an ellipsis, and None keeps one line and widens the column.
// - The horizontal scroll takes the Figma Scroll Bar colors.
const tableCellVariants = cva(
  "h-14 border-b border-border-secondary align-middle [word-break:break-word]",
  {
    variants: {
      type: {
        text: "px-3 py-1 text-left text-body-medium text-text-primary",
        number: "px-3 py-1 text-right text-body-medium text-text-primary",
        "with-description":
          "px-3 py-1 text-left text-body-medium text-text-primary",
        status: "px-3 py-1 text-left text-body-medium text-text-primary",
        "with-avatar": "px-3 py-1 text-left text-body-medium text-text-primary",
        "with-icon": "px-3 py-1 text-left text-body-medium text-text-primary",
        "with-image": "px-3 py-1 text-left text-body-medium text-text-primary",
        "input-text": "px-3 pt-2 pb-[7px]",
        "input-select": "px-3 pt-2 pb-[7px]",
        custom: "px-3 py-1 text-left text-body-medium text-text-primary",
        arrow: "w-13 px-4",
        empty: "w-14 min-w-14",
        selection: "w-14 py-1 pl-3",
        accordion: "w-14 py-1 pl-3",
        actions: "w-[69px] min-w-[69px] px-3 pt-2 pb-[7px]",
        skeleton: "px-3 py-1",
      },
      fixed: {
        // The shadow only falls on the scrolling side. It's Shadow/Large as the
        // Figma Content Left and Content Right draw it, without the token's spread.
        left: "sticky z-10 [&:not(:has(+[data-fixed=left]))]:border-r [&:not(:has(+[data-fixed=left]))]:shadow-[0px_2px_3px_0px_var(--s0l-shadow),0px_6px_10px_0px_var(--s0l-shadow)] [&:not(:has(+[data-fixed=left]))]:[clip-path:inset(0_-20px_0_0)]",
        right:
          "sticky right-0 z-10 border-l shadow-[0px_2px_3px_0px_var(--s0l-shadow),0px_6px_10px_0px_var(--s0l-shadow)] [clip-path:inset(0_0_0_-20px)]",
      },
    },
    defaultVariants: {
      type: "text",
    },
  }
)

type TableFixed = NonNullable<VariantProps<typeof tableCellVariants>["fixed"]>

type TableCellLayoutProps = {
  /** Figma Fixed Columns: sticks the cell to this side of the table. */
  fixed?: TableFixed
  /** How far from the left a fixed cell stops, past the fixed cells before it. */
  fixedOffset?: number
  /**
   * Figma Width: `fill` shares the free space, `hug` follows the content and a
   * number is a fixed width that doesn't shrink. Set it on the whole column.
   */
  width?: "fill" | "hug" | number
}

type TableOverflowMethod = "line-break" | "truncate" | "none"

// The cells whose text `overflowMethod` applies to.
const textCells = [
  "text",
  "number",
  "with-description",
  "status",
  "with-avatar",
  "with-icon",
  "with-image",
]

// A disabled row keeps the look of its controls, so they turn inert instead.
const interactiveCells = [
  "input-text",
  "input-select",
  "custom",
  "selection",
  "accordion",
  "actions",
]

type TableActionsType =
  | "action"
  | "action-hidden-actions"
  | "hidden-actions"
  | "3-icon-buttons"
  | "2-icon-buttons"
  | "icon-button"

type TableAction = {
  label: string
  /** Shown on the Icon Button types and in the Hidden Actions menu. */
  icon?: IconSvgElement
  /** Figma destructive action, in red. */
  danger?: boolean
  onClick?: () => void
}

type TableSort = "none" | "ascending" | "descending"

/** The one column that sorts the table, by its `sortKey`. */
type TableSortState = {
  key: string
  direction: Exclude<TableSort, "none">
}

const TableContext = React.createContext<{
  loading: boolean
  fixedColumns: boolean
  overflowMethod: TableOverflowMethod
  actions?: TableActionsType
  actionsLabel: string
  moreActionsLabel: string
}>({
  loading: false,
  fixedColumns: false,
  overflowMethod: "truncate",
  actionsLabel: "Actions",
  moreActionsLabel: "More actions",
})
const TableSortContext = React.createContext<{
  sort: TableSortState | null
  toggleSort: (key: string) => void
  registerColumn: (key: string, index: number) => void
  unregisterColumn: (key: string) => void
}>({
  sort: null,
  toggleSort: () => {},
  registerColumn: () => {},
  unregisterColumn: () => {},
})
const TableHeaderContext = React.createContext(false)
const TableRowContext = React.createContext({ disabled: false })

type TableSelectionProps = {
  /** Adds the selection column to every row. */
  selectable?: boolean
  /** Single is a Radio Button per row, Multiple a Checkbox. */
  selectionType?: "single" | "multiple"
  /** The `value` of the selected rows, controlled. */
  selectedRows?: string[]
  /** The `value` of the selected rows, uncontrolled. */
  defaultSelectedRows?: string[]
  onSelectedRowsChange?: (selectedRows: string[]) => void
  /** Accessible name of the title cell. */
  selectionLabel?: string
}

// Null unless the table is selectable. The rows register themselves, so the title
// checkbox knows which ones it speaks for.
const TableSelectionContext = React.createContext<ReturnType<
  typeof useTableSelection
> | null>(null)

function useTableSelection({
  selectionType = "multiple",
  selectedRows,
  defaultSelectedRows = [],
  onSelectedRowsChange,
  selectionLabel = "Select",
}: Omit<TableSelectionProps, "selectable">) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultSelectedRows)
  const [rows, setRows] = React.useState<Record<string, boolean>>({})
  const selected = selectedRows ?? uncontrolled

  const registerRow = React.useCallback((value: string, disabled: boolean) => {
    setRows((current) => ({ ...current, [value]: disabled }))

    return () =>
      setRows((current) => {
        const { [value]: removed, ...others } = current
        return removed === undefined ? current : others
      })
  }, [])

  const select = (next: string[]) => {
    setUncontrolled(next)
    onSelectedRowsChange?.(next)
  }

  const enabledRows = Object.keys(rows).filter((value) => !rows[value])
  const selectedCount = enabledRows.filter((value) =>
    selected.includes(value)
  ).length
  const allSelected =
    enabledRows.length > 0 && selectedCount === enabledRows.length

  return {
    selectionType,
    selectionLabel,
    selected,
    select,
    registerRow,
    allSelected,
    someSelected: selectedCount > 0 && !allSelected,
    toggleRow: (value: string, checked: boolean) =>
      select(
        checked
          ? [...selected, value]
          : selected.filter((item) => item !== value)
      ),
    toggleAll: (checked: boolean) =>
      select([
        ...selected.filter((value) => !enabledRows.includes(value)),
        ...(checked ? enabledRows : []),
      ]),
  }
}

// The sortable columns register themselves with their position, so the table
// knows which one comes first, and when the one sorting it stops being sortable.
function useTableSort({
  sort,
  defaultSort,
  onSortChange,
}: Pick<TableProps, "sort" | "defaultSort" | "onSortChange">) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultSort)
  const [columns, setColumns] = React.useState<Record<string, number>>({})

  const registerColumn = React.useCallback((key: string, index: number) => {
    setColumns((current) =>
      current[key] === index ? current : { ...current, [key]: index }
    )
  }, [])

  const unregisterColumn = React.useCallback((key: string) => {
    setColumns((current) => {
      const { [key]: removed, ...others } = current
      return removed === undefined ? current : others
    })
  }, [])

  const firstColumn = Object.keys(columns).sort(
    (a, b) => columns[a] - columns[b]
  )[0]
  const chosen = sort ?? uncontrolled
  const current: TableSortState | null =
    sort ??
    (chosen && chosen.key in columns
      ? chosen
      : firstColumn
        ? { key: firstColumn, direction: "ascending" }
        : null)

  return {
    sort: current,
    registerColumn,
    unregisterColumn,
    toggleSort: (key: string) => {
      const next: TableSortState = {
        key,
        direction:
          current?.key === key && current.direction === "ascending"
            ? "descending"
            : "ascending",
      }

      setUncontrolled(next)
      onSortChange?.(next)
    },
  }
}

type TableProps = React.ComponentProps<"table"> &
  TableSelectionProps & {
    /** Figma Loading: every cell of the table turns into its skeleton. */
    loading?: boolean
    /** Sticks the selection column to the left and the actions to the right. */
    fixedColumns?: boolean
    /** What long text does: wrap, end in an ellipsis or widen its column. */
    overflowMethod?: TableOverflowMethod
    /** Figma .Table Actions Type: adds the actions column to every row. */
    actions?: TableActionsType
    /** Accessible name of the actions title cell. */
    actionsLabel?: string
    /** Accessible name of the Hidden Actions button. */
    moreActionsLabel?: string
    /** The column sorting the table, controlled. */
    sort?: TableSortState
    /** The column sorting the table at first, instead of the first sortable one. */
    defaultSort?: TableSortState
    onSortChange?: (sort: TableSortState) => void
  }

function Table({
  loading = false,
  fixedColumns = false,
  overflowMethod = "truncate",
  actions,
  actionsLabel = "Actions",
  moreActionsLabel = "More actions",
  sort,
  defaultSort,
  onSortChange,
  selectable = false,
  selectionType,
  selectedRows,
  defaultSelectedRows,
  onSelectedRowsChange,
  selectionLabel,
  className,
  ...props
}: TableProps) {
  const context = React.useMemo(
    () => ({
      loading,
      fixedColumns,
      overflowMethod,
      actions,
      actionsLabel,
      moreActionsLabel,
    }),
    [
      loading,
      fixedColumns,
      overflowMethod,
      actions,
      actionsLabel,
      moreActionsLabel,
    ]
  )
  const sorting = useTableSort({ sort, defaultSort, onSortChange })
  const selection = useTableSelection({
    selectionType,
    selectedRows,
    defaultSelectedRows,
    onSelectedRowsChange,
    selectionLabel,
  })

  const table = (
    <div
      data-slot="table-container"
      className="relative w-full [scrollbar-width:thin] [scrollbar-color:var(--s0l-background-inverse-default)_var(--s0l-background-secondary)] overflow-x-auto"
    >
      <table
        data-slot="table"
        aria-busy={loading || undefined}
        className={cn("w-full border-separate border-spacing-0", className)}
        {...props}
      />
    </div>
  )

  return (
    <TableContext.Provider value={context}>
      <TableSortContext.Provider value={sorting}>
        <TableSelectionContext.Provider value={selectable ? selection : null}>
          {selectable && selection.selectionType === "single" ? (
            <RadioGroup
              aria-label={selection.selectionLabel}
              value={selection.selected[0] ?? null}
              onValueChange={(value) => selection.select([String(value)])}
            >
              {table}
            </RadioGroup>
          ) : (
            table
          )}
        </TableSelectionContext.Provider>
      </TableSortContext.Provider>
    </TableContext.Provider>
  )
}

function TableHeader(props: React.ComponentProps<"thead">) {
  return (
    <TableHeaderContext.Provider value>
      <thead data-slot="table-header" {...props} />
    </TableHeaderContext.Provider>
  )
}

const compareSortValues = (a: string | number, b: string | number) =>
  typeof a === "number" && typeof b === "number"
    ? a - b
    : String(a).localeCompare(String(b), undefined, {
        numeric: true,
        sensitivity: "base",
      })

function TableBody({ children, ...props }: React.ComponentProps<"tbody">) {
  const { sort } = React.useContext(TableSortContext)
  const rows = React.Children.toArray(children)

  const sortValue = (row: React.ReactNode) =>
    React.isValidElement<TableRowProps>(row)
      ? row.props.sortValues?.[sort?.key ?? ""]
      : undefined

  if (sort) {
    rows.sort((a, b) => {
      const [valueA, valueB] = [sortValue(a), sortValue(b)]
      if (valueA === undefined || valueB === undefined) return 0

      const order = compareSortValues(valueA, valueB)
      return sort.direction === "ascending" ? order : -order
    })
  }

  return (
    <tbody data-slot="table-body" {...props}>
      {rows}
    </tbody>
  )
}

type TableRowProps = React.ComponentProps<"tr"> & {
  /** Figma State Disabled: the row at 50%, and nothing in it responds. */
  disabled?: boolean
  /** Identifies the row in the selection of a `selectable` table. */
  value?: string
  /** Accessible name of the row's selection control. */
  selectLabel?: string
  /** What this row offers in the actions column of the Table. */
  actions?: TableAction[]
  /** The value of this row in each column, by `sortKey`, for TableBody to sort. */
  sortValues?: Record<string, string | number>
}

function TableRow({
  disabled = false,
  value,
  selectLabel = "Select row",
  actions,
  // Read by TableBody, and not an attribute of the <tr>.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sortValues,
  className,
  children,
  ...props
}: TableRowProps) {
  const table = React.useContext(TableContext)
  const inHeader = React.useContext(TableHeaderContext)
  const selection = React.useContext(TableSelectionContext)
  const context = React.useMemo(() => ({ disabled }), [disabled])
  const generatedValue = React.useId()
  const rowValue = value ?? generatedValue

  const cells = React.Children.toArray(children)
  const isCell = (index: number, type: React.ElementType) => {
    const cell = cells[index]
    return React.isValidElement(cell) && cell.type === type
  }
  // The Empty State Area spans the whole table, and the Accordion cell comes first.
  const isEmptyRow = cells.some((_, index) => isCell(index, TableEmpty))
  const withSelection = selection && !isEmptyRow
  const selectionIndex = isCell(0, TableCellAccordion) ? 1 : 0
  const registerRow = withSelection && !inHeader ? selection.registerRow : null

  React.useEffect(
    () => registerRow?.(rowValue, disabled),
    [registerRow, rowValue, disabled]
  )

  const single = selection?.selectionType === "single"

  return (
    <TableRowContext.Provider value={context}>
      <tr
        data-slot="table-row"
        data-disabled={disabled || undefined}
        aria-disabled={disabled || undefined}
        className={cn(
          // The Empty State Area is a row too, but it has no Hover.
          !disabled &&
            !table.loading &&
            "[tbody_&:not(:has([data-slot=table-empty])):hover]:bg-background-hover",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        {...props}
      >
        {cells.slice(0, selectionIndex)}
        {withSelection &&
          (inHeader ? (
            <TableCellSelection
              title
              type={single ? "radio-button" : "checkbox"}
              label={selection.selectionLabel}
              fixed={table.fixedColumns ? "left" : undefined}
              {...(!single && {
                checked: selection.allSelected,
                indeterminate: selection.someSelected,
                onCheckedChange: selection.toggleAll,
              })}
            />
          ) : (
            <TableCellSelection
              type={single ? "radio-button" : "checkbox"}
              label={selectLabel}
              fixed={table.fixedColumns ? "left" : undefined}
              {...(single
                ? { value: rowValue }
                : {
                    checked: selection.selected.includes(rowValue),
                    onCheckedChange: (checked: boolean) =>
                      selection.toggleRow(rowValue, checked),
                  })}
            />
          ))}
        {cells.slice(selectionIndex)}
        {table.actions && !isEmptyRow && (
          <TableCellActions
            title={inHeader}
            label={table.actionsLabel}
            fixed={table.fixedColumns ? "right" : undefined}
          >
            <TableActions
              type={table.actions}
              actions={actions}
              moreLabel={table.moreActionsLabel}
            />
          </TableCellActions>
        )}
      </tr>
    </TableRowContext.Provider>
  )
}

type TableCellBaseProps = Omit<React.ComponentProps<"td">, "width" | "title"> &
  TableCellLayoutProps & {
    /** Renders the Title=True cell, in the header row. */
    title?: boolean
    slot: string
    cellType: NonNullable<VariantProps<typeof tableCellVariants>["type"]>
  }

// Every cell type goes through here: it takes care of the title background, the
// fixed and width layout and the skeleton of a loading table.
function TableCellBase({
  title = false,
  slot,
  cellType,
  fixed,
  fixedOffset = 0,
  width = "fill",
  className,
  style,
  children,
  ...props
}: TableCellBaseProps) {
  const { loading, overflowMethod } = React.useContext(TableContext)
  const { disabled } = React.useContext(TableRowContext)
  const Cell = title ? "th" : "td"
  const hasText = textCells.includes(cellType)

  return (
    <Cell
      data-slot={slot}
      data-fixed={fixed}
      inert={disabled && interactiveCells.includes(cellType)}
      className={cn(
        tableCellVariants({ type: cellType, fixed }),
        title && "bg-background-secondary text-label-medium",
        !title && fixed && "bg-background-primary",
        // A fixed cell stays opaque, so the row Hover goes over its background.
        !title &&
          fixed &&
          !disabled &&
          !loading &&
          "[tr:not(:has([data-slot=table-empty])):hover_&]:[background-image:linear-gradient(var(--color-background-hover),var(--color-background-hover))]",
        hasText &&
          overflowMethod === "none" &&
          "[word-break:normal] whitespace-nowrap",
        // Without a max width, the text would set the width of the column instead
        // of being cut by it. Hug always follows its text. The inputs have no
        // width of their own, so they share the space with the text columns.
        (hasText || cellType === "input-text" || cellType === "input-select") &&
          overflowMethod === "truncate" &&
          width !== "hug" &&
          "max-w-0 min-w-20",
        width === "hug" && "w-px whitespace-nowrap",
        // Keeps the width of the column, on the skeleton padding.
        loading && "px-3 py-1",
        className
      )}
      style={{
        ...(typeof width === "number" && { width, minWidth: width }),
        ...(fixed === "left" && { left: fixedOffset }),
        ...style,
      }}
      {...props}
    >
      {loading ? (
        <Skeleton className="h-4 w-full min-w-8 rounded-full" />
      ) : (
        children
      )}
    </Cell>
  )
}

const sortIcons = {
  none: ArrowDown02Icon,
  ascending: ArrowDown02Icon,
  descending: ArrowUp02Icon,
}

type TableHeadProps = Omit<
  React.ComponentProps<"th">,
  "width" | "title" | "ref"
> &
  TableCellLayoutProps & {
    /** Figma Align Left / Align Right. */
    align?: "left" | "right"
    /** Figma Sortable: pressing the cell sorts by it, flipping the direction. */
    sortable?: boolean
    /** Identifies the column in the `sortValues` of the rows. */
    sortKey?: string
    /** Figma Arrow, for a column the Table doesn't sort, like a disabled one. */
    sort?: TableSort
    /** Figma Show Icon Help, with this content in a tooltip. */
    help?: React.ReactNode
    /** Figma State Disabled. */
    disabled?: boolean
  }

function TableHead({
  align = "left",
  sortable = false,
  sortKey,
  sort: fixedSort,
  help,
  disabled = false,
  fixed,
  className,
  children,
  ...props
}: TableHeadProps) {
  const titleId = React.useId()
  const { overflowMethod } = React.useContext(TableContext)
  const generatedKey = React.useId()
  const columnKey = sortKey ?? generatedKey
  const table = React.useContext(TableSortContext)
  const sort =
    fixedSort ?? (table.sort?.key === columnKey ? table.sort.direction : "none")
  const cellRef = React.useRef<HTMLTableCellElement>(null)
  const sorts = sortable && !disabled && !fixedSort
  const { registerColumn, unregisterColumn } = table

  // Before paint, so a table never shows its rows out of order.
  React.useLayoutEffect(() => {
    if (sorts && cellRef.current) {
      registerColumn(columnKey, cellRef.current.cellIndex)
    }
  })

  React.useLayoutEffect(() => {
    if (sorts) return () => unregisterColumn(columnKey)
  }, [sorts, columnKey, unregisterColumn])

  const helpIcon = help && (
    // The provider opens it right away, without Base UI's default delay.
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          aria-label="Help"
          disabled={disabled}
          className={cn(
            "pointer-events-auto inline-flex shrink-0 rounded-xs outline-none focus-visible:outline-2 focus-visible:outline-border-accent-strong focus-visible:outline-solid",
            disabled ? "text-icon-disabled" : "text-icon-primary"
          )}
        >
          <HugeiconsIcon icon={HelpCircleIcon} className="size-5" />
        </TooltipTrigger>
        <TooltipContent>{help}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <TableCellBase
      title
      slot="table-head"
      cellType={align === "right" ? "number" : "text"}
      fixed={fixed}
      ref={cellRef}
      aria-sort={sortable && !fixedSort && sort !== "none" ? sort : undefined}
      className={cn(
        "group/table-head",
        !fixed && "relative",
        disabled && "text-body-medium text-text-disabled",
        className
      )}
      {...props}
    >
      {sortable && (
        <button
          type="button"
          disabled={disabled}
          aria-labelledby={titleId}
          onClick={() => table.toggleSort(columnKey)}
          // The Figma Focus is 44px tall and 2px wider than the cell.
          className="absolute inset-0 outline-none not-disabled:hover:bg-background-hover focus-visible:z-20 focus-visible:after:absolute focus-visible:after:inset-x-[-2px] focus-visible:after:top-1/2 focus-visible:after:h-11 focus-visible:after:-translate-y-1/2 focus-visible:after:rounded-sm focus-visible:after:border-3 focus-visible:after:border-border-accent-strong"
        />
      )}
      <div className="pointer-events-none relative flex items-center gap-2">
        <span
          id={titleId}
          className={cn(
            "min-w-0 flex-1",
            overflowMethod === "truncate" && "truncate"
          )}
        >
          {children}
        </span>
        {helpIcon}
        {sortable && (
          <HugeiconsIcon
            icon={sortIcons[sort]}
            className={cn(
              "size-5 shrink-0",
              disabled ? "text-icon-disabled" : "text-icon-primary",
              // Arrow None is a dimmed arrow, until a pointer or the keyboard.
              sort === "none" &&
                (disabled
                  ? "hidden"
                  : "text-icon-disabled group-hover/table-head:text-icon-primary group-has-[button:focus-visible]/table-head:text-icon-primary")
            )}
          />
        )}
      </div>
    </TableCellBase>
  )
}

type TableCellType =
  | "text"
  | "number"
  | "with-description"
  | "status"
  | "with-avatar"
  | "with-icon"
  | "with-image"
  | "input-text"
  | "input-select"
  | "custom"
  | "arrow"
  | "empty"

type TableCellProps = Omit<React.ComponentProps<"td">, "width" | "title"> &
  TableCellLayoutProps & {
    /** Figma Type. The input, custom types and the media hold other components. */
    type?: TableCellType
    /** The line under the Label, on With Description, Avatar, Icon and Image. */
    description?: React.ReactNode
    /** Figma Type Status: the color of the dot. */
    status?: "info" | "success" | "warning" | "danger"
    /** The Avatar, Icon Colors or image of With Avatar, Icon and Image. */
    media?: React.ReactNode
  }

function TableCell({
  type = "text",
  description,
  status = "success",
  media,
  className,
  children,
  ...props
}: TableCellProps) {
  const { overflowMethod } = React.useContext(TableContext)
  const withMedia =
    type === "with-avatar" || type === "with-icon" || type === "with-image"
  const truncates = overflowMethod === "truncate" && textCells.includes(type)
  // The ellipsis hides the end of the text, so the browser tooltip shows it all.
  const fullText = (text: React.ReactNode) =>
    truncates && typeof text === "string" ? text : undefined

  const label =
    (withMedia || type === "with-description") && description ? (
      <span
        className={cn("flex min-w-0 flex-col", withMedia && "min-h-[45px]")}
      >
        <span
          className={cn(truncates && "truncate")}
          title={fullText(children)}
        >
          {children}
        </span>
        <span
          className={cn(
            "text-body-small text-text-secondary",
            truncates && "truncate"
          )}
          title={fullText(description)}
        >
          {description}
        </span>
      </span>
    ) : truncates ? (
      <span className="block truncate" title={fullText(children)}>
        {children}
      </span>
    ) : (
      children
    )

  return (
    <TableCellBase
      slot="table-cell"
      cellType={type}
      className={className}
      {...props}
    >
      {type === "arrow" ? (
        <HugeiconsIcon
          icon={ArrowRight02Icon}
          className="size-5 text-icon-primary"
        />
      ) : type === "empty" ? null : type === "status" || withMedia ? (
        <div
          className={cn(
            "flex",
            withMedia ? "items-center gap-3" : "items-start gap-1"
          )}
        >
          <div
            className={cn(
              "flex shrink-0",
              !withMedia && "min-h-6 items-center"
            )}
          >
            {type === "status" ? <Badge color={status} /> : media}
          </div>
          <div className="min-w-0 flex-1">{label}</div>
        </div>
      ) : (
        label
      )}
    </TableCellBase>
  )
}

type TableCellSelectionProps = Omit<
  React.ComponentProps<"td">,
  "width" | "title" | "children"
> &
  Pick<TableCellLayoutProps, "fixed" | "fixedOffset"> & {
    /** Figma Title: the Checkbox selects all, the Radio Button cell is blank. */
    title?: boolean
    /** Figma Type. A Radio Button needs a RadioGroup around the table. */
    type?: "checkbox" | "radio-button"
    /** Accessible name of the control. */
    label: string
    /** Figma Radio Button: the value of this row in the RadioGroup. */
    value?: string
    /** Figma Checkbox Active, controlled. */
    checked?: boolean
    /** Figma Checkbox Active, uncontrolled. */
    defaultChecked?: boolean
    /** Figma Checkbox Indeterminate. */
    indeterminate?: boolean
    onCheckedChange?: (checked: boolean) => void
    /** Disables the control alone. A disabled row doesn't need it. */
    disabled?: boolean
  }

function TableCellSelection({
  title = false,
  type = "checkbox",
  label,
  value,
  checked,
  defaultChecked,
  indeterminate,
  onCheckedChange,
  disabled = false,
  ...props
}: TableCellSelectionProps) {
  return (
    <TableCellBase
      title={title}
      slot="table-cell-selection"
      cellType="selection"
      {...props}
    >
      <div className="flex size-11 items-center justify-center">
        {type === "checkbox" ? (
          <Checkbox
            aria-label={label}
            checked={checked}
            defaultChecked={defaultChecked}
            indeterminate={indeterminate}
            onCheckedChange={(next) => onCheckedChange?.(next)}
            disabled={disabled}
          />
        ) : title ? (
          <span className="sr-only">{label}</span>
        ) : (
          <RadioButton aria-label={label} value={value} disabled={disabled} />
        )}
      </div>
    </TableCellBase>
  )
}

type TableCellAccordionProps = Omit<
  React.ComponentProps<"td">,
  "width" | "title" | "children" | "onToggle"
> & {
  /** Figma Title: a blank cell, over the chevrons. */
  title?: boolean
  /** Figma Type On / Off: the chevron points up when open. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Accessible name of the chevron. */
  label?: string
  /** The id of the content the chevron opens. */
  controls?: string
}

function TableCellAccordion({
  title = false,
  open = false,
  onOpenChange,
  label = "Toggle row",
  controls,
  ...props
}: TableCellAccordionProps) {
  return (
    <TableCellBase
      title={title}
      slot="table-cell-accordion"
      cellType="accordion"
      {...props}
    >
      {title ? (
        <span className="sr-only">{label}</span>
      ) : (
        <button
          type="button"
          aria-label={label}
          aria-expanded={open}
          aria-controls={open ? controls : undefined}
          onClick={() => onOpenChange?.(!open)}
          className="flex size-11 items-center justify-center rounded-md text-icon-primary outline-none focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-border-accent-strong focus-visible:outline-solid"
        >
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            className={cn("size-4", open && "rotate-180")}
          />
        </button>
      )}
    </TableCellBase>
  )
}

type TableCellActionsProps = Omit<
  React.ComponentProps<"td">,
  "width" | "title"
> &
  Pick<TableCellLayoutProps, "fixed" | "fixedOffset"> & {
    /** Figma Title: a blank cell, over the actions. */
    title?: boolean
    /** Accessible name of the title cell. */
    label?: string
  }

function TableCellActions({
  title = false,
  label = "Actions",
  children,
  ...props
}: TableCellActionsProps) {
  return (
    <TableCellBase
      title={title}
      slot="table-cell-actions"
      cellType="actions"
      {...props}
    >
      {title ? (
        <span className="sr-only">{label}</span>
      ) : (
        <div className="flex items-center justify-end">{children}</div>
      )}
    </TableCellBase>
  )
}

type TableCellSkeletonProps = Omit<
  React.ComponentProps<"td">,
  "width" | "title" | "children"
> &
  TableCellLayoutProps & {
    /** Figma Title: on the Background/Secondary of the title row. */
    title?: boolean
  }

// The cell of a loading table, for a single cell loading on its own.
function TableCellSkeleton({
  title = false,
  ...props
}: TableCellSkeletonProps) {
  return (
    <TableCellBase
      title={title}
      slot="table-cell-skeleton"
      cellType="skeleton"
      {...props}
    >
      <Skeleton className="h-4 w-full min-w-8 rounded-full" />
    </TableCellBase>
  )
}

type TableRowAccordionProps = Omit<TableRowProps, "content"> & {
  /** Figma Open, controlled. */
  open?: boolean
  /** Figma Open, uncontrolled. */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** The Accordion Body, under the row. */
  content: React.ReactNode
  /** Accessible name of the chevron. */
  triggerLabel?: string
}

function TableRowAccordion({
  open,
  defaultOpen = false,
  onOpenChange,
  content,
  triggerLabel,
  children,
  ...props
}: TableRowAccordionProps) {
  const { loading } = React.useContext(TableContext)
  const selection = React.useContext(TableSelectionContext)
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const contentId = React.useId()
  const isOpen = open ?? uncontrolledOpen

  return (
    <>
      <TableRow data-open={isOpen || undefined} {...props}>
        <TableCellAccordion
          open={isOpen}
          label={triggerLabel}
          controls={contentId}
          onOpenChange={(next) => {
            setUncontrolledOpen(next)
            onOpenChange?.(next)
          }}
        />
        {children}
      </TableRow>
      {isOpen && !loading && (
        <tr data-slot="table-row-accordion-content" id={contentId}>
          <td
            colSpan={
              React.Children.toArray(children).length + (selection ? 2 : 1)
            }
            className="border-b border-border-primary bg-background-secondary pl-14"
          >
            {content}
          </td>
        </tr>
      )}
    </>
  )
}

const iconButtons: Partial<Record<TableActionsType, number>> = {
  "3-icon-buttons": 3,
  "2-icon-buttons": 2,
  "icon-button": 1,
}

type TableActionsProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Figma Type. */
  type?: TableActionsType
  /**
   * The first one is the labelled button, the others go in the menu. The Icon
   * Button types show the last ones, and Hidden Actions has them all in the menu.
   */
  actions?: TableAction[]
  /** Accessible name of the Hidden Actions button. */
  moreLabel?: string
}

function TableActions({
  type = "hidden-actions",
  actions = [],
  moreLabel = "More actions",
  className,
  ...props
}: TableActionsProps) {
  const icons = iconButtons[type]
  const withAction = type === "action" || type === "action-hidden-actions"
  const [main, ...others] = actions
  const hiddenActions =
    type === "hidden-actions"
      ? actions
      : type === "action-hidden-actions"
        ? others
        : []

  return (
    <div
      data-slot="table-actions"
      className={cn("flex items-center", icons ? "gap-2" : "gap-3", className)}
      {...props}
    >
      {withAction && main && (
        <Button variant="secondary" danger={main.danger} onClick={main.onClick}>
          {main.label}
        </Button>
      )}
      {hiddenActions.length > 0 && (
        <Dropdown>
          <DropdownTrigger
            render={<Button variant="ghost" iconOnly aria-label={moreLabel} />}
          >
            <HugeiconsIcon icon={MoreVerticalIcon} />
          </DropdownTrigger>
          <DropdownContent align="end">
            <DropdownGroup>
              {hiddenActions.map(({ label, icon, danger, onClick }) => (
                <DropdownItem
                  key={label}
                  icon={icon && <HugeiconsIcon icon={icon} />}
                  destructive={danger}
                  onClick={onClick}
                >
                  {label}
                </DropdownItem>
              ))}
            </DropdownGroup>
          </DropdownContent>
        </Dropdown>
      )}
      {icons &&
        actions.slice(-icons).map(({ label, icon, danger, onClick }) => (
          <Button
            key={label}
            variant="ghost"
            iconOnly
            danger={danger}
            aria-label={label}
            onClick={onClick}
          >
            {icon && <HugeiconsIcon icon={icon} />}
          </Button>
        ))}
    </div>
  )
}

// The Empty State Area: an Empty State 56px from every side. In Fixed Columns,
// give the fixed columns a `type="empty"` cell on each side of it.
function TableEmpty({
  className,
  children,
  ...props
}: React.ComponentProps<"td">) {
  return (
    <td data-slot="table-empty" className={cn("p-14", className)} {...props}>
      <div className="flex justify-center">{children}</div>
    </td>
  )
}

export {
  compareSortValues,
  Table,
  TableActions,
  TableBody,
  TableCell,
  TableCellAccordion,
  TableCellActions,
  TableCellSelection,
  TableCellSkeleton,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
  TableRowAccordion,
  tableCellVariants,
  type TableAction,
  type TableActionsProps,
  type TableActionsType,
  type TableCellAccordionProps,
  type TableCellActionsProps,
  type TableCellProps,
  type TableCellSelectionProps,
  type TableCellSkeletonProps,
  type TableCellType,
  type TableHeadProps,
  type TableOverflowMethod,
  type TableProps,
  type TableRowAccordionProps,
  type TableRowProps,
  type TableSelectionProps,
  type TableSort,
  type TableSortState,
}
