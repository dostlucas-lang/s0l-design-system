"use client"

import * as React from "react"
import {
  Cancel01Icon,
  InformationCircleIcon,
  MoreVerticalIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
} from "@/components/ui/dropdown"
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateTitle,
} from "@/components/ui/empty-state"
import { HugeiconsIcon } from "@/components/ui/icon"
import { InputSearch } from "@/components/ui/input-search"
import { InputSelect, InputSelectItem } from "@/components/ui/input-select"
import { Link } from "@/components/ui/link"
import { Pagination } from "@/components/ui/pagination"
import {
  compareSortValues,
  Table,
  type TableAction,
  type TableActionsType,
  TableBody,
  TableCell,
  type TableCellProps,
  type TableCellType,
  TableEmpty,
  TableHead,
  TableHeader,
  type TableOverflowMethod,
  TableRow,
  type TableSortState,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Mirrors the Figma Data Table: the Data Table Header, the .Bulk Action Bar, a
// Table and the Pagination Data Table row, 24px apart. It works from `rows` and
// `columns`: the search, the sorting, the selection across pages and the
// pagination all live here, because they have to see every row, not one page.
// DataTableHeader, DataTableBulkActionBar and DataTablePagination are exported
// for a table that keeps its data elsewhere.
//
// The header and the bar follow their own width, not the window's, so they also
// adapt inside a narrow panel. Under 896px they take the Figma Mobile versions
// and keep the rest in the More menu, on the Bottom Sheet. Just above that, three
// bar actions drop to a second line. The bar only shows with a selection.

const defaultLabels = {
  search: "Buscar",
  selected: (count: number) =>
    count <= 1 ? `${count} selecionado` : `${count} selecionados`,
  selectPage: (count: number) => `Selecionar página (${count})`,
  selectList: (count: number) => `Selecionar lista (${count})`,
  clearSelection: "Limpar seleção",
  range: (from: number, to: number, total: number) =>
    `Exibindo ${from} a ${to} de ${total} itens`,
  rowsPerPage: (count: number) => `${count} linhas por página`,
  rowsPerPageField: "Linhas por página",
  moreActions: "Mais ações",
  rowActions: "Ações",
  selectAll: "Selecionar todas",
  selectRow: "Selecionar linha",
  emptyTitle: "Nenhum resultado encontrado",
  emptyDescription: "Tente buscar com outro termo.",
  clearSearch: "Limpar busca",
}

type DataTableLabels = Partial<typeof defaultLabels>

type DataTableActionsDirection = "right-to-left" | "left-to-right"

type DataTableActionsProps = {
  /** Figma .Action List Actions, from Action 1. */
  actions?: TableAction[]
  /** Figma More Actions: the options of the menu at the end. */
  moreActions?: TableAction[]
  moreLabel?: string
  /** Figma Direction: Right To Left puts Action 1 on the right. */
  direction?: DataTableActionsDirection
  /** Figma Primary: Action 1 is a Button Primary. */
  primary?: boolean
  /** Figma .Action List Inverse, on Background/Inverse/Default. */
  inverse?: boolean
}

type DataTableMenuProps = {
  /** Figma .Dropdown Action Item List: the sections of the menu. */
  sections: TableAction[][]
  /** The button that opens the menu. */
  trigger: React.ReactElement
  /** Figma Mobile: opens as a Bottom Sheet. */
  mobile?: boolean
}

function DataTableMenu({
  sections,
  trigger,
  mobile,
  children,
}: React.PropsWithChildren<DataTableMenuProps>) {
  return (
    <Dropdown mobile={mobile}>
      <DropdownTrigger render={trigger}>{children}</DropdownTrigger>
      <DropdownContent align="end">
        {sections
          .filter((section) => section.length > 0)
          .map((section, index) => (
            <React.Fragment key={section[0].label}>
              {index > 0 && <DropdownSeparator />}
              <DropdownGroup>
                {section.map(({ label, icon, danger, onClick }) => (
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
            </React.Fragment>
          ))}
      </DropdownContent>
    </Dropdown>
  )
}

function DataTableActions({
  actions = [],
  moreActions = [],
  moreLabel = defaultLabels.moreActions,
  direction = "right-to-left",
  primary = false,
  inverse = false,
  className,
}: DataTableActionsProps & { className?: string }) {
  if (!actions.length && !moreActions.length) return null

  const orderedActions =
    direction === "right-to-left" ? [...actions].reverse() : actions

  const actionVariant = (action: TableAction) => {
    if (inverse) return "secondary-inverse"
    return primary && action === actions[0] ? "primary" : "secondary"
  }

  return (
    <div
      data-slot="data-table-actions"
      className={cn("flex shrink-0 items-center gap-4", className)}
    >
      {orderedActions.map((action) => (
        <Button
          key={action.label}
          variant={actionVariant(action)}
          danger={action.danger}
          onClick={action.onClick}
        >
          {action.icon && (
            <HugeiconsIcon icon={action.icon} data-icon="inline-start" />
          )}
          {action.label}
        </Button>
      ))}
      {moreActions.length > 0 && (
        <DataTableMenu
          sections={[moreActions]}
          trigger={
            <Button
              variant={inverse ? "inverse" : "ghost"}
              iconOnly
              aria-label={moreLabel}
            />
          }
        >
          <HugeiconsIcon icon={MoreVerticalIcon} />
        </DataTableMenu>
      )}
    </div>
  )
}

type DataTableHeaderProps = Omit<React.ComponentProps<"div">, "title"> &
  Pick<
    DataTableActionsProps,
    "actions" | "moreActions" | "moreLabel" | "direction" | "primary"
  > & {
    /** Figma Título. */
    title?: React.ReactNode
    /** Figma Show Subtitle: shows when there is one. */
    subtitle?: React.ReactNode
    /** Figma Show Icon Info, with this content in a tooltip. */
    info?: React.ReactNode
    /** Figma Show Search. */
    showSearch?: boolean
    searchPlaceholder?: string
    searchValue?: string
    onSearchChange?: (value: string) => void
  }

function DataTableHeader({
  title,
  subtitle,
  info,
  actions = [],
  moreActions = [],
  moreLabel = defaultLabels.moreActions,
  direction,
  primary,
  showSearch = true,
  searchPlaceholder = defaultLabels.search,
  searchValue,
  onSearchChange,
  className,
  ...props
}: DataTableHeaderProps) {
  const mobileActions = [...actions, ...moreActions]

  return (
    <div
      data-slot="data-table-header"
      className={cn("@container flex flex-col gap-4", className)}
      {...props}
    >
      <div className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1 text-text-primary">
          <div className="flex items-center gap-2">
            <p className="text-heading-medium">{title}</p>
            {info && (
              // The provider opens it right away, without Base UI's default delay.
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    aria-label="Info"
                    className="inline-flex shrink-0 rounded-xs text-icon-primary outline-none focus-visible:outline-2 focus-visible:outline-border-accent-strong focus-visible:outline-solid"
                  >
                    <HugeiconsIcon
                      icon={InformationCircleIcon}
                      className="size-5"
                    />
                  </TooltipTrigger>
                  <TooltipContent>{info}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {subtitle && <p className="text-body-medium">{subtitle}</p>}
        </div>
        <DataTableActions
          actions={actions}
          moreActions={moreActions}
          moreLabel={moreLabel}
          direction={direction}
          primary={primary}
          className="hidden @4xl:flex"
        />
        {mobileActions.length > 0 && (
          <div className="shrink-0 @4xl:hidden">
            <DataTableMenu
              mobile
              sections={[mobileActions]}
              trigger={
                <Button variant="ghost" iconOnly aria-label={moreLabel} />
              }
            >
              <HugeiconsIcon icon={MoreVerticalIcon} />
            </DataTableMenu>
          </div>
        )}
      </div>
      {showSearch && (
        <InputSearch
          aria-label={searchPlaceholder}
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          onClear={() => onSearchChange?.("")}
        />
      )}
    </div>
  )
}

type DataTableBulkActionBarProps = React.ComponentProps<"div"> &
  Pick<
    DataTableActionsProps,
    "actions" | "moreActions" | "moreLabel" | "direction"
  > & {
    /** Figma Selected: with none, the bar does not show. */
    selectedCount?: number
    /** The rows on the page, for Select Page. */
    pageRowCount?: number
    /** The rows in the whole list, for Select List. */
    rowCount?: number
    /** Figma Show Select Page. */
    showSelectPage?: boolean
    /** Figma Show Select List. */
    showSelectList?: boolean
    onSelectPage?: () => void
    onSelectList?: () => void
    /** The X button: clears the selection, which closes the bar. */
    onClear?: () => void
    labels?: DataTableLabels
  }

function DataTableBulkActionBar({
  selectedCount = 0,
  pageRowCount = 0,
  rowCount = 0,
  showSelectPage = true,
  showSelectList = true,
  onSelectPage,
  onSelectList,
  onClear,
  actions = [],
  moreActions = [],
  moreLabel = defaultLabels.moreActions,
  direction,
  labels,
  className,
  ...props
}: DataTableBulkActionBarProps) {
  if (selectedCount === 0) return null

  const text = { ...defaultLabels, ...labels }
  // In Figma an action only shows its icon in the Smartphone bar, as a Button.
  const labelledActions = actions.map((action) => ({
    ...action,
    icon: undefined,
  }))
  const iconActions = actions.filter(({ icon }) => icon).slice(0, 2)
  const selectActions = [
    ...(showSelectPage
      ? [{ label: text.selectPage(pageRowCount), onClick: onSelectPage }]
      : []),
    ...(showSelectList
      ? [{ label: text.selectList(rowCount), onClick: onSelectList }]
      : []),
  ]
  const menuSections = [selectActions, [...labelledActions, ...moreActions]]

  const selectLink = (label: string, onClick?: () => void) => (
    <>
      <span
        aria-hidden="true"
        className="size-1 shrink-0 rounded-full bg-icon-inverse"
      />
      <Link
        render={<button type="button" />}
        color="inverse"
        onClick={onClick}
        className="[&_[data-slot=link-label]]:underline"
      >
        {label}
      </Link>
    </>
  )

  return (
    // The Figma stroke is inside, so the padding takes that 1px.
    <div
      data-slot="data-table-bulk-action-bar"
      className={cn(
        "@container rounded-md border border-border-secondary bg-background-inverse-default",
        className
      )}
      {...props}
    >
      <div className="flex min-h-[54px] items-center justify-between gap-x-4 gap-y-2 p-[7px] @4xl:flex-wrap">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            variant="inverse"
            iconOnly
            aria-label={text.clearSelection}
            onClick={onClear}
            className="shrink-0"
          >
            <HugeiconsIcon icon={Cancel01Icon} />
          </Button>
          <p className="min-w-0 truncate text-body-medium text-text-inverse">
            {text.selected(selectedCount)}
          </p>
          <div className="hidden items-center gap-2 @4xl:flex">
            {showSelectPage &&
              selectLink(text.selectPage(pageRowCount), onSelectPage)}
            {showSelectList &&
              selectLink(text.selectList(rowCount), onSelectList)}
          </div>
        </div>
        <DataTableActions
          actions={labelledActions}
          moreActions={moreActions}
          moreLabel={moreLabel}
          direction={direction}
          inverse
          className="ml-auto hidden @4xl:flex"
        />
        <div className="flex shrink-0 items-center gap-4 @4xl:hidden">
          {iconActions.map(({ label, icon, onClick }) => (
            <Button
              key={label}
              variant="inverse"
              iconOnly
              aria-label={label}
              onClick={onClick}
            >
              {icon && <HugeiconsIcon icon={icon} />}
            </Button>
          ))}
          {menuSections.flat().length > 0 && (
            <DataTableMenu
              mobile
              sections={menuSections}
              trigger={
                <Button variant="inverse" iconOnly aria-label={moreLabel} />
              }
            >
              <HugeiconsIcon icon={MoreVerticalIcon} />
            </DataTableMenu>
          )}
        </div>
      </div>
    </div>
  )
}

type DataTablePaginationProps = React.ComponentProps<"div"> & {
  page: number
  pageSize: number
  /** The rows in the whole list. */
  rowCount: number
  /** The options of the rows per page field. */
  pageSizeOptions?: number[]
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  labels?: DataTableLabels
}

function DataTablePagination({
  page,
  pageSize,
  rowCount,
  pageSizeOptions = [10, 20, 50],
  onPageChange,
  onPageSizeChange,
  labels,
  className,
  ...props
}: DataTablePaginationProps) {
  const text = { ...defaultLabels, ...labels }
  const pageCount = Math.max(Math.ceil(rowCount / pageSize), 1)
  const options = pageSizeOptions.map((option) => ({
    value: String(option),
    label: text.rowsPerPage(option),
  }))

  return (
    <div
      data-slot="data-table-pagination"
      className={cn(
        "flex flex-wrap items-center justify-between gap-4",
        className
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-6">
        <p className="text-body-medium whitespace-nowrap text-text-primary">
          {text.range(
            Math.min((page - 1) * pageSize + 1, rowCount),
            Math.min(page * pageSize, rowCount),
            rowCount
          )}
        </p>
        <InputSelect
          aria-label={text.rowsPerPageField}
          className="w-[209px]"
          clearable={false}
          items={options}
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange?.(Number(value))}
        >
          {options.map(({ value, label }) => (
            <InputSelectItem key={value} value={value}>
              {label}
            </InputSelectItem>
          ))}
        </InputSelect>
      </div>
      <Pagination
        page={page}
        pageCount={pageCount}
        onPageChange={onPageChange}
        className="max-w-full max-sm:overflow-x-auto"
      />
    </div>
  )
}

type DataTableColumn<Row> = {
  key: string
  /** The text of the .Table Title Cell. */
  title: React.ReactNode
  /** What the cell shows, and what the search and the sorting read. */
  value: (row: Row) => string | number
  /** Figma Type of the column. */
  type?: TableCellType
  /** Figma Width. */
  width?: TableCellProps["width"]
  /** Figma Sortable. */
  sortable?: boolean
  /** Figma Show Icon Help, with this content in a tooltip. */
  help?: React.ReactNode
  /** The other props of the cell: `description`, `media`, `status`... */
  cell?: (row: Row) => Partial<TableCellProps>
}

type DataTableProps<Row> = Omit<React.ComponentProps<"div">, "title"> &
  Pick<
    DataTableHeaderProps,
    "title" | "subtitle" | "info" | "showSearch" | "actions" | "moreActions"
  > &
  Pick<DataTableBulkActionBarProps, "showSelectPage" | "showSelectList"> & {
    rows: Row[]
    columns: DataTableColumn<Row>[]
    /** Identifies a row in the selection. */
    getRowId: (row: Row) => string
    /** Figma State Disabled of a row. */
    isRowDisabled?: (row: Row) => boolean
    /** Figma Show Action Bar. */
    showActionBar?: boolean
    /** Figma Show Pagination. */
    showPagination?: boolean
    /** Figma Direction of the header .Action List. */
    actionsDirection?: DataTableActionsDirection
    /** Figma Primary of the header .Action List. */
    actionsPrimary?: boolean
    /** The .Action List Inverse of the .Bulk Action Bar. */
    bulkActions?: TableAction[]
    bulkMoreActions?: TableAction[]
    /** Figma Direction of the bar .Action List Inverse. */
    bulkActionsDirection?: DataTableActionsDirection
    /** Adds the selection column. The bar needs it. */
    selectable?: boolean
    selectedRows?: string[]
    defaultSelectedRows?: string[]
    onSelectedRowsChange?: (selectedRows: string[]) => void
    /** Figma .Table Actions Type of the rows. */
    rowActionsType?: TableActionsType
    /** What each row offers in its actions column. */
    rowActions?: (row: Row) => TableAction[]
    /** Figma Fixed Columns: the first column, the selection and the actions. */
    fixedColumns?: boolean
    /** What long text does in the Table. */
    overflowMethod?: TableOverflowMethod
    /** Figma Loading of the Table. */
    loading?: boolean
    /** The column sorting the table at first, instead of the first sortable. */
    defaultSort?: TableSortState
    pageSizeOptions?: number[]
    defaultPageSize?: number
    /** Replaces the Empty State of a list with no rows. */
    emptyState?: React.ReactNode
    labels?: DataTableLabels
  }

function DataTable<Row>({
  rows,
  columns,
  getRowId,
  isRowDisabled,
  title,
  subtitle,
  info,
  showSearch = true,
  actions,
  moreActions,
  actionsDirection,
  actionsPrimary,
  showActionBar = true,
  showSelectPage,
  showSelectList,
  bulkActions,
  bulkMoreActions,
  bulkActionsDirection,
  showPagination = true,
  selectable = true,
  selectedRows,
  defaultSelectedRows = [],
  onSelectedRowsChange,
  rowActionsType,
  rowActions,
  fixedColumns = false,
  overflowMethod,
  loading = false,
  defaultSort,
  pageSizeOptions = [10, 20, 50],
  defaultPageSize = pageSizeOptions[0],
  emptyState,
  labels,
  className,
  ...props
}: DataTableProps<Row>) {
  const text = { ...defaultLabels, ...labels }
  const [search, setSearch] = React.useState("")
  const [chosenSort, setChosenSort] = React.useState(defaultSort)
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(defaultPageSize)
  const [uncontrolledSelected, setUncontrolledSelected] =
    React.useState(defaultSelectedRows)
  const selected = selectedRows ?? uncontrolledSelected

  const select = (next: string[]) => {
    setUncontrolledSelected(next)
    onSelectedRowsChange?.(next)
  }

  const isSortable = (column: DataTableColumn<Row>) => column.sortable !== false
  const sortableColumns = columns.filter(isSortable)
  // One sortable column always sorts the table, as in Table.
  const sort =
    chosenSort && sortableColumns.some(({ key }) => key === chosenSort.key)
      ? chosenSort
      : sortableColumns[0] && {
          key: sortableColumns[0].key,
          direction: "ascending" as const,
        }

  const listRows = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    const found = query
      ? rows.filter((row) =>
          columns.some((column) =>
            String(column.value(row)).toLowerCase().includes(query)
          )
        )
      : rows
    const sortColumn = columns.find(({ key }) => key === sort?.key)

    if (!sortColumn) return found

    return [...found].sort((a, b) => {
      const order = compareSortValues(sortColumn.value(a), sortColumn.value(b))
      return sort?.direction === "ascending" ? order : -order
    })
  }, [rows, columns, search, sort?.key, sort?.direction])

  const pageCount = Math.max(Math.ceil(listRows.length / pageSize), 1)
  const currentPage = Math.min(page, pageCount)
  const pageRows = showPagination
    ? listRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : listRows

  const enabledIds = (list: Row[]) =>
    list.filter((row) => !isRowDisabled?.(row)).map(getRowId)

  const selectIds = (ids: string[]) =>
    select([...selected.filter((id) => !ids.includes(id)), ...ids])

  const changeSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const showRowActions = Boolean(rowActionsType && rowActions)
  const columnLayout = (index: number, column: DataTableColumn<Row>) =>
    fixedColumns
      ? index === 0
        ? {
            fixed: "left" as const,
            fixedOffset: selectable ? 56 : 0,
            width: column.width ?? 144,
          }
        : { width: column.width, className: "min-w-45" }
      : { width: column.width }

  return (
    <div
      data-slot="data-table"
      className={cn("flex w-full flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col gap-6">
        <DataTableHeader
          title={title}
          subtitle={subtitle}
          info={info}
          actions={actions}
          moreActions={moreActions}
          moreLabel={text.moreActions}
          direction={actionsDirection}
          primary={actionsPrimary}
          showSearch={showSearch}
          searchPlaceholder={text.search}
          searchValue={search}
          onSearchChange={changeSearch}
        />
        {showActionBar && selectable && (
          <DataTableBulkActionBar
            selectedCount={selected.length}
            pageRowCount={enabledIds(pageRows).length}
            rowCount={enabledIds(listRows).length}
            showSelectPage={showSelectPage}
            showSelectList={showSelectList}
            onSelectPage={() => selectIds(enabledIds(pageRows))}
            onSelectList={() => selectIds(enabledIds(listRows))}
            onClear={() => select([])}
            actions={bulkActions}
            moreActions={bulkMoreActions}
            moreLabel={text.moreActions}
            direction={bulkActionsDirection}
            labels={labels}
          />
        )}
      </div>
      <Table
        loading={loading}
        selectable={selectable}
        selectionLabel={text.selectAll}
        selectedRows={selected}
        onSelectedRowsChange={select}
        sort={sort}
        onSortChange={(next) => {
          setChosenSort(next)
          setPage(1)
        }}
        fixedColumns={fixedColumns}
        overflowMethod={overflowMethod}
        actions={showRowActions ? rowActionsType : undefined}
        actionsLabel={text.rowActions}
        moreActionsLabel={text.moreActions}
      >
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead
                key={column.key}
                sortable={isSortable(column)}
                sortKey={column.key}
                help={column.help}
                align={column.type === "number" ? "right" : "left"}
                {...columnLayout(index, column)}
              >
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageRows.length > 0 ? (
            pageRows.map((row) => {
              const id = getRowId(row)

              return (
                <TableRow
                  key={id}
                  value={id}
                  disabled={isRowDisabled?.(row)}
                  selectLabel={`${text.selectRow} ${id}`}
                  actions={rowActions?.(row)}
                >
                  {columns.map((column, index) => (
                    <TableCell
                      key={column.key}
                      type={column.type}
                      {...columnLayout(index, column)}
                      {...column.cell?.(row)}
                    >
                      {column.cell?.(row).children ?? column.value(row)}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })
          ) : loading ? (
            // Nothing to show yet: the skeleton of a full page.
            Array.from({ length: pageSize }, (_, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.key} type={column.type} />
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableEmpty
                colSpan={
                  columns.length +
                  (selectable ? 1 : 0) +
                  (showRowActions ? 1 : 0)
                }
              >
                {emptyState ?? (
                  <EmptyState>
                    <EmptyStateIcon />
                    <EmptyStateHeader>
                      <EmptyStateTitle>{text.emptyTitle}</EmptyStateTitle>
                      <EmptyStateDescription>
                        {text.emptyDescription}
                      </EmptyStateDescription>
                    </EmptyStateHeader>
                    {search && (
                      <EmptyStateActions>
                        <Button onClick={() => changeSearch("")}>
                          {text.clearSearch}
                        </Button>
                      </EmptyStateActions>
                    )}
                  </EmptyState>
                )}
              </TableEmpty>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {showPagination && (
        <DataTablePagination
          page={currentPage}
          pageSize={pageSize}
          rowCount={listRows.length}
          pageSizeOptions={pageSizeOptions}
          onPageChange={setPage}
          onPageSizeChange={(next) => {
            setPageSize(next)
            setPage(1)
          }}
          labels={labels}
        />
      )}
    </div>
  )
}

export {
  DataTable,
  DataTableBulkActionBar,
  DataTableHeader,
  DataTablePagination,
  type DataTableActionsDirection,
  type DataTableBulkActionBarProps,
  type DataTableColumn,
  type DataTableHeaderProps,
  type DataTableLabels,
  type DataTablePaginationProps,
  type DataTableProps,
}
