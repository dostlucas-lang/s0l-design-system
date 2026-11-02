import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useArgs } from "storybook/preview-api"

import { ChartBar, type ChartBarValueType } from "@/components/ui/chart-bar"
import type { ChartColor } from "@/components/ui/chart-legend"

type ItemNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

// One copy of the item props per item. `selectedItem` picks the one the panel shows.
type ItemArgs = Record<`item${ItemNumber}Label`, string> &
  Record<`item${ItemNumber}Value`, number | null | undefined> &
  Record<`item${ItemNumber}Color`, ChartColor>

// The panel follows the Figma properties. `itemCount` only exists here: in code,
// the size of `items`.
type ChartBarStoryArgs = ItemArgs & {
  itemCount: ItemNumber
  max: number | undefined
  totalLabel: string
  showTotal: "auto" | "show" | "hide"
  valueType: ChartBarValueType
  currency: string
  selectedItem: ItemNumber
}

const inSection = (category: string, type: string) => ({
  table: { category, type: { summary: type } },
})

const inChart = (type: string) => inSection("Chart Bar", type)
const inItem = (type: string) => inSection("Chart Bar Item", type)

const itemNumbers: ItemNumber[] = [1, 2, 3, 4, 5, 6, 7, 8]
const colors: ChartColor[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const valueTypes: ChartBarValueType[] = ["number", "currency", "percent"]

const hideControls = (...names: (keyof ChartBarStoryArgs)[]) =>
  Object.fromEntries(names.map((name) => [name, { table: { disable: true } }]))

// Sample values, all different, so each segment shows its share of the bar.
const sampleValues = [48000, 32000, 24000, 16000, 12000, 9000, 6000, 3000]

// Items=1 shows its share of the Track, as in Figma.
const singleItemMax = 100000

// Sample values that suit each `valueType`.
const typedSamples: Record<ChartBarValueType, number[]> = {
  number: [12000, 8000, 5000],
  currency: [1500000, 900000, 600000],
  percent: [45, 30, 25],
}

const itemDefaults = (item: ItemNumber) => ({
  label: "Label",
  value: sampleValues[item - 1],
  color: item,
})

const itemControls = {
  label: {
    description: "The name in the Legend.",
    control: "text",
    summary: "string",
  },
  value: {
    description:
      "Any value. Its segment takes its share of the bar, and the Legend shows it.",
    control: "number",
    summary: "number | null",
  },
  color: {
    description: "Figma Chart/1 to Chart/10.",
    control: "select",
    options: colors,
    summary: "number",
  },
}

const itemKey = (item: ItemNumber, field: string) =>
  `item${item}${field[0].toUpperCase()}${field.slice(1)}` as keyof ItemArgs

const itemArgs = Object.fromEntries(
  itemNumbers.flatMap((item) =>
    Object.entries(itemDefaults(item)).map(([field, value]) => [
      itemKey(item, field),
      value,
    ])
  )
) as ItemArgs

const itemArgTypes = Object.fromEntries(
  itemNumbers.flatMap((item) =>
    Object.entries(itemControls).map(([field, { summary, ...argType }]) => [
      itemKey(item, field),
      {
        ...argType,
        name: field,
        if: { arg: "selectedItem", eq: item },
        ...inItem(summary),
      },
    ])
  )
)

const showTotalProp = { auto: undefined, show: true, hide: false }

const renderChart = (args: ChartBarStoryArgs, itemCount: ItemNumber) => (
  <ChartBar
    max={args.max ?? (itemCount === 1 ? singleItemMax : undefined)}
    totalLabel={args.totalLabel}
    showTotal={showTotalProp[args.showTotal]}
    valueType={args.valueType}
    currency={args.currency}
    items={itemNumbers.slice(0, itemCount).map((item) => ({
      label: args[`item${item}Label`],
      color: args[`item${item}Color`],
      value: args[`item${item}Value`] ?? null,
    }))}
  />
)

// An item that isn't shown can't be edited.
const useShownSelectedItem = (
  selectedItem: ItemNumber,
  itemCount: ItemNumber
) => {
  const [, updateArgs] = useArgs<ChartBarStoryArgs>()

  React.useEffect(() => {
    if (selectedItem > itemCount) updateArgs({ selectedItem: itemCount })
  }, [itemCount, selectedItem, updateArgs])
}

const meta = {
  title: "Components/Chart Bar",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A stacked bar with its Legend. Mirrors the Figma Chart Bar: give it `items`, and each segment is as wide as its share of the values. The total row is always the sum of the items. With a `max` above that sum, the rest of the Track shows, as in Items=1. It takes 100% of the width of its container.",
      },
    },
  },
  args: {
    itemCount: 2,
    max: undefined,
    totalLabel: "Total",
    showTotal: "auto",
    valueType: "currency",
    currency: "BRL",
    selectedItem: 1,
    ...itemArgs,
  },
  argTypes: {
    itemCount: {
      name: "items",
      description: "Figma Items. In code, the `items` array, of any size.",
      control: "select",
      options: itemNumbers,
      ...inChart("ChartBarItem[]"),
    },
    max: {
      description:
        "What a full bar stands for. Above the sum of the items, the rest of the Track shows. It never changes the total row, which is always the sum. Empty, it is the sum (the stories give Items=1 a `max`, to show the Track as in Figma).",
      control: "number",
      ...inChart("number"),
    },
    totalLabel: {
      description: "The label of the total row.",
      control: "text",
      ...inChart("string"),
    },
    showTotal: {
      description:
        "The total row. `auto` shows it past one item, as in Figma. In code, `true`, `false` or nothing for `auto`.",
      control: "inline-radio",
      options: ["auto", "show", "hide"],
      ...inChart("boolean"),
    },
    valueType: {
      description: "What the values are. As `percent`, 75 reads 75%.",
      control: "select",
      options: valueTypes,
      ...inChart("string"),
    },
    currency: {
      description: "The ISO code of the money.",
      control: "select",
      options: ["BRL", "USD", "EUR"],
      if: { arg: "valueType", eq: "currency" },
      ...inChart("string"),
    },
    selectedItem: {
      name: "item",
      description:
        "The item that the controls below edit. It can't go past `items`.",
      control: "select",
      options: itemNumbers,
      ...inItem("number"),
    },
    ...itemArgTypes,
  },
  // `args` leaves out the hidden controls, `allArgs` has the eight items.
  render: function Render(_, { allArgs }) {
    const { itemCount, selectedItem } = allArgs
    useShownSelectedItem(selectedItem, itemCount)

    return renderChart(allArgs, itemCount)
  },
} satisfies Meta<ChartBarStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Items: Story = {
  argTypes: hideControls("itemCount"),
  render: (_, { allArgs }) => (
    <div className="flex flex-col gap-10">
      {itemNumbers.map((itemCount) => (
        <React.Fragment key={itemCount}>
          {renderChart(allArgs, itemCount)}
        </React.Fragment>
      ))}
    </div>
  ),
}

export const ValueTypes: Story = {
  argTypes: hideControls(
    "valueType",
    "itemCount",
    "selectedItem",
    ...itemNumbers.flatMap((item) =>
      (["Label", "Value", "Color"] as const).map(
        (field) => `item${item}${field}` as const
      )
    )
  ),
  render: (args) => (
    <div className="flex flex-col gap-10">
      {valueTypes.map((valueType) => (
        <ChartBar
          key={valueType}
          totalLabel={args.totalLabel}
          showTotal={showTotalProp[args.showTotal]}
          valueType={valueType}
          currency={args.currency}
          items={typedSamples[valueType].map((value) => ({
            label: valueType,
            value,
          }))}
        />
      ))}
    </div>
  ),
}
