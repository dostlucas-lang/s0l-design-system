import * as React from "react"
import {
  CommandIcon,
  Edit02Icon,
  Home01Icon,
  Settings01Icon,
  StarIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import type { Meta, StoryContext, StoryObj } from "@storybook/react-vite"
import { useArgs } from "storybook/preview-api"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateTitle,
} from "@/components/ui/empty-state"
import { IconColors } from "@/components/ui/icon-colors"
import { DownloadIcon, TrashIcon } from "@/components/ui/input-file"
import { InputSelect, InputSelectItem } from "@/components/ui/input-select"
import { InputText } from "@/components/ui/input-text"
import {
  Table,
  type TableAction,
  TableActions,
  type TableActionsType,
  TableBody,
  TableCell,
  TableCellAccordion,
  TableCellActions,
  type TableCellProps,
  type TableCellType,
  TableEmpty,
  TableHead,
  TableHeader,
  type TableHeadProps,
  type TableOverflowMethod,
  TableRow,
  TableRowAccordion,
} from "@/components/ui/table"

const cellIcons = {
  command: CommandIcon,
  home: Home01Icon,
  settings: Settings01Icon,
  star: StarIcon,
  user: UserIcon,
}

type RowFields = { rowDisabled: boolean }

type ColumnFields = {
  columnType: TableCellType
  columnWidth: "fill" | "hug" | "fixed"
  columnWidthFixed: number
  columnSortable: boolean
  columnIconHelp: boolean
}

type CellFields = {
  cellIcon: keyof typeof cellIcons
  cellLabel: string
  cellDescription: string
}

// The panel follows the Figma levels. Rows, columns and cells repeat, so the
// panel edits the selected one and each keeps its values in a `...Values` arg.
// A cell is where the selected Row and Column meet.
type TableStoryArgs = RowFields &
  ColumnFields &
  CellFields & {
    rows: number
    columns: number
    selectable: boolean
    selectionType: "single" | "multiple"
    showActions: boolean
    actions: TableActionsType
    fixedColumns: boolean
    accordion: boolean
    loading: boolean
    overflowMethod: TableOverflowMethod
    empty: boolean
    selectedRow: number
    selectedColumn: number
    rowValues: Record<string, RowFields>
    columnValues: Record<string, ColumnFields>
    cellValues: Record<string, CellFields>
    columnHasTitle: boolean
    cellHasLabel: boolean
    cellHasIcon: boolean
    cellHasDescription: boolean
  }

const maxRows = 10
const maxColumns = 10

const rowDefaults: RowFields = { rowDisabled: false }

const columnDefaults: ColumnFields = {
  columnType: "text",
  columnWidth: "fill",
  columnWidthFixed: 200,
  columnSortable: true,
  columnIconHelp: false,
}

const cellDefaults: CellFields = {
  cellIcon: "command",
  cellLabel: "Label",
  cellDescription: "Description",
}

// Sample labels that differ, so sorting shows. A cell keeps its own in any row.
const cellDefaultsAt = (row: number, column: number): CellFields => ({
  ...cellDefaults,
  cellLabel: `Label ${((row * 37 + column * 17) % 89) + 10}`,
})

// The Figma .Table Actions, with Edit 2, Download and Trash.
const rowActions: TableAction[] = [
  { label: "Editar", icon: Edit02Icon },
  { label: "Baixar", icon: DownloadIcon },
  { label: "Excluir", icon: TrashIcon, danger: true },
]

const actionTypes: TableActionsType[] = [
  "action",
  "action-hidden-actions",
  "hidden-actions",
  "3-icon-buttons",
  "2-icon-buttons",
  "icon-button",
]

const columnTypes: TableCellType[] = [
  "text",
  "number",
  "with-description",
  "status",
  "with-avatar",
  "with-icon",
  "with-image",
  "input-text",
  "input-select",
  "custom",
  "arrow",
  "empty",
]

const pick = <Fields extends object>(args: Fields, defaults: Fields) =>
  Object.fromEntries(
    Object.keys(defaults).map((field) => [field, args[field as keyof Fields]])
  ) as Fields

const numbersUpTo = (max: number) =>
  Array.from({ length: max }, (_, index) => index + 1)

const inSection = (category: string, type: string) => ({
  table: { category, type: { summary: type } },
})

const inTable = (type: string) => inSection("Table", type)
const inRow = (type: string) => inSection("Row", type)
const inColumn = (type: string) => inSection("Column", type)
const inCell = (type: string) => inSection("Cell", type)

const hidden = { table: { disable: true } }

// Only the Figma combinations: Fixed Columns has no Accordion.
const noAccordion = { if: { arg: "accordion", truthy: false } }

function TableEmptyState() {
  return (
    <EmptyState>
      <EmptyStateIcon />
      <EmptyStateHeader>
        <EmptyStateTitle>Nenhum resultado encontrado</EmptyStateTitle>
        <EmptyStateDescription>
          Tente buscar com outro termo.
        </EmptyStateDescription>
      </EmptyStateHeader>
      <EmptyStateActions>
        <Button>Limpar filtros</Button>
      </EmptyStateActions>
    </EmptyState>
  )
}

const cellProps = (
  type: TableCellType,
  { cellIcon, cellLabel, cellDescription }: CellFields
): TableCellProps => {
  switch (type) {
    case "with-description":
      return { description: cellDescription, children: cellLabel }
    case "with-avatar":
      return {
        description: cellDescription,
        children: cellLabel,
        media: (
          <Avatar>
            <AvatarImage src="/storybook/table-avatar.jpg" alt="" />
            <AvatarFallback>SL</AvatarFallback>
          </Avatar>
        ),
      }
    case "with-icon":
      return {
        description: cellDescription,
        children: cellLabel,
        media: <IconColors container icon={cellIcons[cellIcon]} />,
      }
    case "with-image":
      return {
        description: cellDescription,
        children: cellLabel,
        media: (
          <img
            src="/storybook/table-image.jpg"
            alt=""
            className="size-10 max-w-none rounded-md object-cover"
          />
        ),
      }
    case "input-text":
      return {
        children: <InputText aria-label="Valor" placeholder="Placeholder" />,
      }
    case "input-select":
      return {
        children: (
          <InputSelect aria-label="Opção" placeholder="Placeholder">
            <InputSelectItem value="1">Opção 1</InputSelectItem>
            <InputSelectItem value="2">Opção 2</InputSelectItem>
          </InputSelect>
        ),
      }
    case "arrow":
    case "empty":
      return {}
    default:
      return { children: cellLabel }
  }
}

// Keeps the selected item in step with its controls: picking another item loads
// its values into them, and editing them saves into `storeArg`.
const useSelectedItem = <Fields extends object>(
  item: string,
  storeArg: "rowValues" | "columnValues" | "cellValues",
  stored: Record<string, Fields>,
  controls: Fields,
  defaults: Fields
) => {
  const [, updateArgs] = useArgs<TableStoryArgs>()
  const shownItem = React.useRef(item)
  const serialized = JSON.stringify(controls)

  React.useEffect(() => {
    const saved = stored[item] ?? defaults

    if (shownItem.current !== item) {
      shownItem.current = item
      updateArgs(saved)
    } else if (serialized !== JSON.stringify(saved)) {
      updateArgs({ [storeArg]: { ...stored, [item]: JSON.parse(serialized) } })
    }
    // Only a new item or an edit counts: `stored` changes as a result of them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, serialized])
}

// Keeps the selectors on an item that exists, and the panel on the fields the
// selected column type has.
const useTablePanel = (args: TableStoryArgs) => {
  const [, updateArgs] = useArgs<TableStoryArgs>()
  const { rows, columns, selectedRow, selectedColumn, columnType } = args
  const columnHasTitle = columnType !== "arrow" && columnType !== "empty"
  const cellHasLabel = ![
    "input-text",
    "input-select",
    "arrow",
    "empty",
  ].includes(columnType)
  const cellHasIcon = columnType === "with-icon"
  const cellHasDescription = [
    "with-description",
    "with-avatar",
    "with-icon",
    "with-image",
  ].includes(columnType)

  useSelectedItem(
    String(selectedRow),
    "rowValues",
    args.rowValues,
    pick(args, rowDefaults),
    rowDefaults
  )
  useSelectedItem(
    String(selectedColumn),
    "columnValues",
    args.columnValues,
    pick(args, columnDefaults),
    columnDefaults
  )
  useSelectedItem(
    `${selectedRow}-${selectedColumn}`,
    "cellValues",
    args.cellValues,
    pick(args, cellDefaults),
    cellDefaultsAt(selectedRow, selectedColumn)
  )

  React.useEffect(() => {
    updateArgs({
      selectedRow: Math.min(selectedRow, rows),
      selectedColumn: Math.min(selectedColumn, columns),
      columnHasTitle,
      cellHasLabel,
      cellHasIcon,
      cellHasDescription,
    })
  }, [
    rows,
    columns,
    selectedRow,
    selectedColumn,
    columnHasTitle,
    cellHasLabel,
    cellHasIcon,
    cellHasDescription,
    updateArgs,
  ])
}

const renderTable = ({
  rows,
  columns,
  selectable,
  selectionType,
  showActions,
  actions,
  fixedColumns,
  accordion,
  loading,
  overflowMethod,
  empty,
  rowValues,
  columnValues,
  cellValues,
}: TableStoryArgs) => {
  const fixed = Boolean(fixedColumns)
  const withAccordion = Boolean(accordion) && !fixed && !empty
  const fixedOffset = selectable ? 56 : 0

  const columnList = numbersUpTo(columns).map((column) => {
    const fields = columnValues[column] ?? columnDefaults
    const isFixed = fixed && column === 1
    const noTitle =
      fields.columnType === "arrow" || fields.columnType === "empty"
    const layout = {
      // Fill has no size of its own, so Fixed Columns gives it the Figma widths.
      width:
        fields.columnWidth === "fixed"
          ? fields.columnWidthFixed
          : fields.columnWidth === "hug"
            ? ("hug" as const)
            : isFixed
              ? 144
              : noTitle
                ? 56
                : undefined,
      className:
        fixed && !isFixed && !noTitle && fields.columnWidth === "fill"
          ? "min-w-45"
          : undefined,
      ...(isFixed && { fixed: "left" as const, fixedOffset }),
    }

    return { column, fields, layout }
  })

  const title = ({ column, fields, layout }: (typeof columnList)[number]) => {
    const hasTitle =
      fields.columnType !== "arrow" && fields.columnType !== "empty"
    const props: TableHeadProps = {
      ...layout,
      align: fields.columnType === "number" ? "right" : "left",
      sortable: hasTitle && fields.columnSortable,
      sortKey: String(column),
      help: hasTitle && fields.columnIconHelp ? "Texto de ajuda" : undefined,
    }

    return (
      <TableHead key={column} {...props}>
        {hasTitle ? "Title" : <span className="sr-only">Coluna {column}</span>}
      </TableHead>
    )
  }

  return (
    <Table
      loading={loading}
      overflowMethod={overflowMethod}
      selectable={selectable}
      selectionType={selectionType}
      fixedColumns={fixed}
      actions={showActions ? actions : undefined}
      actionsLabel="Ações"
      moreActionsLabel="Mais ações"
      selectionLabel={
        selectionType === "single" ? "Selecionar" : "Selecionar todas"
      }
    >
      <TableHeader>
        <TableRow>
          {withAccordion && <TableCellAccordion title label="Expandir" />}
          {columnList.map(title)}
        </TableRow>
      </TableHeader>
      <TableBody>
        {empty ? (
          <TableRow>
            {fixed && (
              <TableCell
                type="empty"
                fixed="left"
                colSpan={(selectable ? 1 : 0) + 1}
                className="h-auto w-auto border-b-0"
              />
            )}
            <TableEmpty
              colSpan={
                fixed
                  ? columns - 1
                  : columns + (selectable ? 1 : 0) + (showActions ? 1 : 0)
              }
            >
              <TableEmptyState />
            </TableEmpty>
            {fixed && showActions && (
              <TableCell
                type="empty"
                fixed="right"
                className="h-auto w-auto border-b-0"
              />
            )}
          </TableRow>
        ) : (
          numbersUpTo(rows).map((row) => {
            const cellFields = (column: number) =>
              cellValues[`${row}-${column}`] ?? cellDefaultsAt(row, column)
            const props = {
              value: String(row),
              disabled: (rowValues[row] ?? rowDefaults).rowDisabled,
              selectLabel: `Selecionar linha ${row}`,
              actions: rowActions,
              sortValues: Object.fromEntries(
                columnList.map(({ column }) => [
                  column,
                  cellFields(column).cellLabel,
                ])
              ),
            }
            const cells = columnList.map(({ column, fields, layout }) => (
              <TableCell
                key={column}
                type={fields.columnType}
                {...layout}
                {...cellProps(fields.columnType, cellFields(column))}
              />
            ))

            return withAccordion ? (
              <TableRowAccordion
                key={row}
                {...props}
                triggerLabel="Expandir linha"
                content={
                  <p className="px-3 pt-2.5 pb-[9px] text-body-medium text-text-primary">
                    Conteúdo da linha
                  </p>
                }
              >
                {cells}
              </TableRowAccordion>
            ) : (
              <TableRow key={row} {...props}>
                {cells}
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}

const meta = {
  title: "Components/Table",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Displays tabular data. Mirrors the Figma Table: Table sets the variants, Loading included, and each row, column and cell has its own props. Selection, Accordion, Actions and Skeleton cells are their own components.",
      },
    },
  },
  args: {
    rows: maxRows,
    columns: 6,
    selectable: true,
    selectionType: "multiple",
    showActions: true,
    actions: "hidden-actions",
    fixedColumns: false,
    accordion: false,
    loading: false,
    overflowMethod: "truncate",
    empty: false,
    selectedRow: 1,
    ...rowDefaults,
    selectedColumn: 1,
    ...columnDefaults,
    ...cellDefaultsAt(1, 1),
    rowValues: {},
    columnValues: {},
    cellValues: {},
    columnHasTitle: true,
    cellHasLabel: true,
    cellHasIcon: false,
    cellHasDescription: false,
  },
  argTypes: {
    rows: {
      description: "Rows in the body. In code, one `TableRow` per row.",
      control: { type: "range", min: 1, max: maxRows, step: 1 },
      ...inTable("children"),
    },
    columns: {
      description: "Columns of cells. In code, one cell per column.",
      control: { type: "range", min: 1, max: maxColumns, step: 1 },
      ...inTable("children"),
    },
    selectable: {
      description: "Adds the selection column to every row.",
      control: "boolean",
      ...inTable("boolean"),
    },
    selectionType: {
      description: "Single is a Radio Button per row, Multiple a Checkbox.",
      control: "select",
      options: ["single", "multiple"],
      if: { arg: "selectable" },
      ...inTable("string"),
    },
    showActions: {
      description: "Figma Show Actions. In code, `actions` on Table.",
      control: "boolean",
      ...inTable("children"),
    },
    actions: {
      description: "Figma .Table Actions Type, on every row.",
      control: "select",
      options: actionTypes,
      if: { arg: "showActions" },
      ...inTable("string"),
    },
    fixedColumns: {
      description:
        'Figma Fixed Columns: Column 1 and the actions stay put. In code, `fixedColumns` on Table and `fixed="left"` on the first cells.',
      control: "boolean",
      ...noAccordion,
      ...inTable("fixed"),
    },
    accordion: {
      description:
        "Figma Accordion: in code, `TableRowAccordion` instead of `TableRow`.",
      control: "boolean",
      if: { arg: "fixedColumns", truthy: false },
      ...inTable("TableRowAccordion"),
    },
    loading: {
      description: "Figma Loading: every cell turns into its skeleton.",
      control: "boolean",
      ...inTable("boolean"),
    },
    overflowMethod: {
      description:
        "What long text does: Line Break wraps it, Truncate ends it in an ellipsis and None widens its column.",
      control: "select",
      options: ["line-break", "truncate", "none"],
      ...inTable("string"),
    },
    selectedRow: {
      name: "row",
      description: "The row these props edit.",
      control: "select",
      options: numbersUpTo(maxRows),
      ...inRow("number"),
    },
    rowDisabled: {
      name: "disabled",
      description:
        "Figma State Disabled: the row at 50%, and nothing in it responds.",
      control: "boolean",
      ...inRow("boolean"),
    },
    selectedColumn: {
      name: "column",
      description:
        "The column these props edit. With Row, it also picks the cell.",
      control: "select",
      options: numbersUpTo(maxColumns),
      ...inColumn("number"),
    },
    columnType: {
      name: "type",
      description:
        "Figma Type, on every cell of the column. Number aligns the title right.",
      control: "select",
      options: columnTypes,
      ...inColumn("string"),
    },
    columnWidth: {
      name: "width",
      description: "Figma Width: Fill, Hug or Fixed.",
      control: "select",
      options: ["fill", "hug", "fixed"],
      ...inColumn("string"),
    },
    columnWidthFixed: {
      name: "widthFixed",
      description: "The width of a Fixed column, in px.",
      control: { type: "number", min: 40, step: 1 },
      if: { arg: "columnWidth", eq: "fixed" },
      ...inColumn("number"),
    },
    columnSortable: {
      name: "sortable",
      description:
        "Figma Sortable: pressing the title sorts the table by this column, and again flips the direction. One column always sorts the table, the first sortable one at first.",
      control: "boolean",
      if: { arg: "columnHasTitle" },
      ...inColumn("boolean"),
    },
    columnIconHelp: {
      name: "iconHelp",
      description:
        "Figma Show Icon Help. In code, `help` with the tooltip content.",
      control: "boolean",
      if: { arg: "columnHasTitle" },
      ...inColumn("ReactNode"),
    },
    cellIcon: {
      name: "icon",
      description: "The icon of a With Icon cell.",
      control: "select",
      options: Object.keys(cellIcons),
      if: { arg: "cellHasIcon" },
      ...inCell("IconSvgElement"),
    },
    cellLabel: {
      name: "label",
      description: "The text of the cell.",
      control: "text",
      if: { arg: "cellHasLabel" },
      ...inCell("ReactNode"),
    },
    cellDescription: {
      name: "description",
      description: "The line under the Label. Empty hides it.",
      control: "text",
      if: { arg: "cellHasDescription" },
      ...inCell("ReactNode"),
    },
    empty: hidden,
    rowValues: hidden,
    columnValues: hidden,
    cellValues: hidden,
    columnHasTitle: hidden,
    cellHasLabel: hidden,
    cellHasIcon: hidden,
    cellHasDescription: hidden,
  },
  // Controls with an `if` leave `args` when hidden, but their values still count.
  render: function Render(_, context) {
    const args = (context as StoryContext<TableStoryArgs>).allArgs

    useTablePanel(args)

    return renderTable(args)
  },
} satisfies Meta<TableStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Accordion: Story = {
  args: { accordion: true },
  argTypes: { fixedColumns: hidden },
}

export const FixedColumns: Story = {
  args: { fixedColumns: true, columns: 7 },
  argTypes: { accordion: hidden },
}

export const Loading: Story = {
  args: { loading: true },
  argTypes: { loading: hidden },
}

export const Empty: Story = {
  args: { empty: true },
  argTypes: { accordion: hidden, rows: hidden },
}

const longText =
  "Um texto longo para mostrar o que acontece quando ele não cabe na coluna"

export const Overflow: Story = {
  parameters: { controls: { include: ["overflowMethod"] } },
  render: ({ overflowMethod }) => (
    <Table overflowMethod={overflowMethod}>
      <TableHeader>
        <TableRow>
          <TableHead>Título longo que também precisa caber na coluna</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Descrição</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {["1", "2"].map((row) => (
          <TableRow key={row}>
            <TableCell>{longText}</TableCell>
            <TableCell type="status">{longText}</TableCell>
            <TableCell type="with-description" description={longText}>
              {longText}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

const people = [
  { name: "Carla", city: "Recife", value: 2500 },
  { name: "Ana", city: "Curitiba", value: 1000 },
  { name: "Bruno", city: "Manaus", value: 12000 },
  { name: "Dora", city: "Belém", value: 300 },
]

// One column always sorts the table: the first one at first, then the one
// pressed last. Pressing it again flips between Ascending and Descending.
export const Sorting: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead sortable sortKey="name">
            Nome
          </TableHead>
          <TableHead sortable sortKey="city">
            Cidade
          </TableHead>
          <TableHead sortable sortKey="value" align="right">
            Valor
          </TableHead>
          <TableHead disabled sortable sort="ascending">
            Bloqueada
          </TableHead>
          <TableHead help="Texto de ajuda">Com ajuda</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {people.map((person) => (
          <TableRow key={person.name} sortValues={person}>
            <TableCell>{person.name}</TableCell>
            <TableCell>{person.city}</TableCell>
            <TableCell type="number">
              {person.value.toLocaleString("pt-BR")}
            </TableCell>
            <TableCell>Label</TableCell>
            <TableCell>Label</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

// The Figma cells: inputs are 200px wide, Arrow and Empty columns 56px, and the
// others follow their content.
const cellTypeWidth = (type: TableCellType) =>
  type === "input-text" || type === "input-select"
    ? 200
    : type === "arrow" || type === "empty"
      ? 56
      : "hug"

export const CellTypes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Table
      selectable
      selectionType="single"
      selectionLabel="Selecionar"
      defaultSelectedRows={["1"]}
      actions="hidden-actions"
    >
      <TableHeader>
        <TableRow>
          {columnTypes.map((type) => (
            <TableHead
              key={type}
              align={type === "number" ? "right" : "left"}
              width={cellTypeWidth(type)}
            >
              {type === "arrow" || type === "empty" ? (
                <span className="sr-only">{type}</span>
              ) : (
                type
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {["1", "2"].map((row) => (
          <TableRow
            key={row}
            value={row}
            selectLabel={`Selecionar linha ${row}`}
            actions={rowActions}
          >
            {columnTypes.map((type) => (
              <TableCell
                key={type}
                type={type}
                width={cellTypeWidth(type)}
                {...cellProps(type, cellDefaults)}
              />
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

export const Actions: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Table>
      <TableBody>
        {actionTypes.map((type) => (
          <TableRow key={type}>
            <TableCell>{type}</TableCell>
            <TableCellActions>
              <TableActions
                type={type}
                actions={rowActions}
                moreLabel="Mais ações"
              />
            </TableCellActions>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}
