import { CommandIcon, Edit02Icon } from "@hugeicons/core-free-icons"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  DataTable,
  type DataTableActionsDirection,
  type DataTableColumn,
} from "@/components/ui/data-table"
import { DownloadIcon, TrashIcon } from "@/components/ui/input-file"
import {
  compareSortValues,
  type TableAction,
  type TableActionsType,
  type TableOverflowMethod,
} from "@/components/ui/table"

type SampleRow = { id: string; cells: string[] }

// The panel follows the Figma parts: Data Table, Data Table Header, .Bulk Action
// Bar and Table. `items` and the action counts only exist here: in code, `rows`
// and the lists of actions.
type DataTableStoryArgs = {
  showActionBar: boolean
  showPagination: boolean
  title: string
  subtitle: string
  info: string
  showSearch: boolean
  actionCount: number
  actionsPrimary: boolean
  actionsDirection: DataTableActionsDirection
  showMoreActions: boolean
  showSelectPage: boolean
  showSelectList: boolean
  selectedCount: number
  bulkActionCount: number
  bulkActionsDirection: DataTableActionsDirection
  showBulkMoreActions: boolean
  items: number
  selectable: boolean
  showActions: boolean
  rowActionsType: TableActionsType
  fixedColumns: boolean
  overflowMethod: TableOverflowMethod
  loading: boolean
}

const inSection = (category: string, type: string) => ({
  table: { category, type: { summary: type } },
})

const inDataTable = (type: string) => inSection("Data Table", type)
const inHeader = (type: string) => inSection("Data Table Header", type)
const inBar = (type: string) => inSection("Bulk Action Bar", type)
const inTable = (type: string) => inSection("Table", type)

const hidden = { table: { disable: true } }

const columnCount = 6

// Sample labels that differ, so the search and the sorting show.
const sampleRows = (count: number): SampleRow[] =>
  Array.from({ length: count }, (_, row) => ({
    id: String(row + 1),
    cells: Array.from(
      { length: columnCount },
      (_, column) => `Label ${((row * 37 + column * 17 + 11) % 997) + 1}`
    ),
  }))

// The first rows on screen: the Data Table sorts by the first column.
const firstRowIds = (rows: SampleRow[], count: number) =>
  [...rows]
    .sort((a, b) => compareSortValues(a.cells[0], b.cells[0]))
    .slice(0, count)
    .map(({ id }) => id)

const columns: DataTableColumn<SampleRow>[] = Array.from(
  { length: columnCount },
  (_, column) => ({
    key: String(column),
    title: "Title",
    value: (row) => row.cells[column],
  })
)

const namedActions = (...labels: string[]): TableAction[] =>
  labels.map((label) => ({ label }))

const rowActions: TableAction[] = [
  { label: "Editar", icon: Edit02Icon },
  { label: "Baixar", icon: DownloadIcon },
  { label: "Excluir", icon: TrashIcon, danger: true },
]

const listedActions = (count: number) =>
  namedActions("Action 1", "Action 2", "Action 3").slice(0, count)

// The icon only shows on the Smartphone bar, as a Button.
const listedBulkActions = (count: number) =>
  listedActions(count).map((action) => ({ ...action, icon: CommandIcon }))

const moreActions = namedActions("Duplicar", "Arquivar")

const directions: DataTableActionsDirection[] = [
  "right-to-left",
  "left-to-right",
]

const meta = {
  title: "Components/Data Table",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A Table with its header, search, bulk actions and pagination. Mirrors the Figma Data Table: give it `rows` and `columns`, and the search, the sorting, the selection across pages and the pagination work by themselves.",
      },
    },
  },
  args: {
    showActionBar: true,
    showPagination: true,
    title: "Título",
    subtitle: "Subtítulo",
    info: "",
    showSearch: true,
    actionCount: 2,
    actionsPrimary: false,
    actionsDirection: "right-to-left",
    showMoreActions: true,
    showSelectPage: true,
    showSelectList: true,
    selectedCount: 0,
    bulkActionCount: 2,
    bulkActionsDirection: "right-to-left",
    showBulkMoreActions: true,
    items: 100,
    selectable: true,
    showActions: true,
    rowActionsType: "hidden-actions",
    fixedColumns: false,
    overflowMethod: "truncate",
    loading: false,
  },
  argTypes: {
    showActionBar: {
      description:
        "Figma Show Action Bar. It needs `selectable` and shows with a selection.",
      control: "boolean",
      ...inDataTable("boolean"),
    },
    showPagination: {
      description: "Figma Show Pagination.",
      control: "boolean",
      ...inDataTable("boolean"),
    },
    title: {
      description: "Figma Título.",
      control: "text",
      ...inHeader("ReactNode"),
    },
    subtitle: {
      description: "Figma Show Subtitle: shows when there is one.",
      control: "text",
      ...inHeader("ReactNode"),
    },
    info: {
      description: "Figma Show Icon Info, with this content in a tooltip.",
      control: "text",
      ...inHeader("ReactNode"),
    },
    showSearch: {
      description: "Figma Show Search.",
      control: "boolean",
      ...inHeader("boolean"),
    },
    actionCount: {
      name: "actions",
      description: "Figma Actions. In code, a list of actions.",
      control: { type: "range", min: 0, max: 3, step: 1 },
      ...inHeader("TableAction[]"),
    },
    actionsPrimary: {
      description: "Figma Primary: Action 1 is a Button Primary.",
      control: "boolean",
      if: { arg: "actionCount", neq: 0 },
      ...inHeader("boolean"),
    },
    actionsDirection: {
      description: "Figma Direction: Right To Left puts Action 1 on the right.",
      control: "select",
      options: directions,
      if: { arg: "actionCount", neq: 0 },
      ...inHeader("string"),
    },
    showMoreActions: {
      name: "moreActions",
      description: "Figma More Actions. In code, a list of actions.",
      control: "boolean",
      ...inHeader("TableAction[]"),
    },
    showSelectPage: {
      description: "Figma Show Select Page.",
      control: "boolean",
      ...inBar("boolean"),
    },
    showSelectList: {
      description: "Figma Show Select List.",
      control: "boolean",
      ...inBar("boolean"),
    },
    selectedCount: {
      name: "selected",
      description:
        "Rows selected at first: with 0, the bar stays closed. In code, `defaultSelectedRows`.",
      control: { type: "range", min: 0, max: 20, step: 1 },
      ...inBar("string[]"),
    },
    bulkActionCount: {
      name: "actions",
      description: "Figma Actions. In code, `bulkActions`.",
      control: { type: "range", min: 0, max: 3, step: 1 },
      ...inBar("TableAction[]"),
    },
    bulkActionsDirection: {
      name: "actionsDirection",
      description: "Figma Direction: Right To Left puts Action 1 on the right.",
      control: "select",
      options: directions,
      if: { arg: "bulkActionCount", neq: 0 },
      ...inBar("string"),
    },
    showBulkMoreActions: {
      name: "moreActions",
      description: "Figma More Actions. In code, `bulkMoreActions`.",
      control: "boolean",
      ...inBar("TableAction[]"),
    },
    items: {
      name: "rows",
      description: "Rows in the list. In code, the `rows` array.",
      control: { type: "range", min: 0, max: 200, step: 5 },
      ...inTable("Row[]"),
    },
    selectable: {
      description: "Adds the selection column.",
      control: "boolean",
      ...inTable("boolean"),
    },
    showActions: {
      description: "Figma Show Actions. In code, `rowActions`.",
      control: "boolean",
      ...inTable("(row) => TableAction[]"),
    },
    rowActionsType: {
      description: "Figma .Table Actions Type of the rows.",
      control: "select",
      options: [
        "action",
        "action-hidden-actions",
        "hidden-actions",
        "3-icon-buttons",
        "2-icon-buttons",
        "icon-button",
      ],
      if: { arg: "showActions" },
      ...inTable("string"),
    },
    fixedColumns: {
      description: "Figma Fixed Columns.",
      control: "boolean",
      ...inTable("boolean"),
    },
    overflowMethod: {
      description: "What long text does in the Table.",
      control: "select",
      options: ["line-break", "truncate", "none"],
      ...inTable("string"),
    },
    loading: {
      description: "Figma Loading of the Table.",
      control: "boolean",
      ...inTable("boolean"),
    },
  },
  render: function Render(_, context) {
    const {
      actionCount,
      showMoreActions,
      bulkActionCount,
      showBulkMoreActions,
      selectedCount,
      items,
      info,
      showActions,
      rowActionsType,
      ...args
    } = context.allArgs as DataTableStoryArgs
    const rows = sampleRows(items)

    return (
      // The story remounts on a new list size or selection, so they start over.
      <DataTable
        {...args}
        key={`${items}-${selectedCount}`}
        info={info || undefined}
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        defaultSelectedRows={firstRowIds(rows, selectedCount)}
        actions={listedActions(actionCount)}
        moreActions={showMoreActions ? moreActions : undefined}
        bulkActions={listedBulkActions(bulkActionCount)}
        bulkMoreActions={showBulkMoreActions ? moreActions : undefined}
        rowActionsType={showActions ? rowActionsType : undefined}
        rowActions={() => rowActions}
      />
    )
  },
} satisfies Meta<DataTableStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const BulkActionBar: Story = {
  args: { selectedCount: 2 },
}

export const Empty: Story = {
  args: { items: 0 },
  argTypes: { items: hidden, selectedCount: hidden },
}

export const Loading: Story = {
  args: { loading: true },
  argTypes: { loading: hidden },
}

export const FixedColumns: Story = {
  args: { fixedColumns: true },
  argTypes: { fixedColumns: hidden },
}
