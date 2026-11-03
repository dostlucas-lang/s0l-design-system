import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs } from "storybook/preview-api"

import { ChartDonut, type ChartDonutProps } from "@/components/ui/chart-donut"
import type { ChartColor } from "@/components/ui/chart-legend"

type ItemNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

// One copy of the item props per item. `selectedItem` picks the one the panel shows.
type ItemArgs = Record<`item${ItemNumber}Label`, string> &
  Record<`item${ItemNumber}Value`, number | null | undefined> &
  Record<`item${ItemNumber}Color`, ChartColor>

// The panel follows the Figma properties. `itemCount` only exists here: in code,
// the size of `items`.
type ChartDonutStoryArgs = ItemArgs & {
  itemCount: ItemNumber
  legend: NonNullable<ChartDonutProps["legend"]>
  size: NonNullable<ChartDonutProps["size"]>
  label: string
  value: string
  total: number | undefined
  valueType: NonNullable<ChartDonutProps["valueType"]>
  currency: string
  selectedItem: ItemNumber
}

const inSection = (category: string, type: string) => ({
  table: { category, type: { summary: type } },
})

const inChart = (type: string) => inSection("Chart Donut", type)
const inItem = (type: string) => inSection("Chart Donut Item", type)

const itemNumbers: ItemNumber[] = [1, 2, 3, 4, 5, 6, 7, 8]
const colors: ChartColor[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const legends: ChartDonutStoryArgs["legend"][] = ["bottom", "right"]
const sizes: ChartDonutStoryArgs["size"][] = ["large", "medium", "x-small"]
const valueTypes: ChartDonutStoryArgs["valueType"][] = [
  "number",
  "currency",
  "percent",
]

const hideControls = (...names: (keyof ChartDonutStoryArgs)[]) =>
  Object.fromEntries(names.map((name) => [name, { table: { disable: true } }]))

// Sample values, as the slices of Figma are samples too. They start with 75% of
// `singleItemTotal`, the Track of Items=1.
const sampleValues = [75000, 50000, 37500, 25000, 20000, 15000, 10000, 5000]
const singleItemTotal = 100000

// Sample values that suit each `valueType`.
const typedSamples: Record<ChartDonutStoryArgs["valueType"], number[]> = {
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
      "Any value. Its slice takes its share of the ring, and the Legend shows it.",
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

// X-Small has a single item.
const shownItemCount = (
  itemCount: ItemNumber,
  size: ChartDonutProps["size"]
) => (size === "x-small" ? 1 : itemCount)

const renderChart = (
  args: ChartDonutStoryArgs,
  itemCount: ItemNumber,
  legend: ChartDonutStoryArgs["legend"],
  size: ChartDonutStoryArgs["size"] = args.size
) => {
  const count = shownItemCount(itemCount, size)

  return (
    <ChartDonut
      legend={legend}
      size={size}
      label={args.label}
      value={args.value || undefined}
      total={args.total ?? (count === 1 ? singleItemTotal : undefined)}
      valueType={args.valueType}
      currency={args.currency}
      items={itemNumbers.slice(0, count).map((item) => ({
        label: args[`item${item}Label`],
        color: args[`item${item}Color`],
        value: args[`item${item}Value`] ?? null,
      }))}
    />
  )
}

// An item that isn't shown can't be edited.
const useShownSelectedItem = (
  selectedItem: ItemNumber,
  itemCount: ItemNumber
) => {
  const [, updateArgs] = useArgs<ChartDonutStoryArgs>()

  React.useEffect(() => {
    if (selectedItem > itemCount) updateArgs({ selectedItem: itemCount })
  }, [itemCount, selectedItem, updateArgs])
}

const meta = {
  title: "Components/Chart Donut",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A donut chart with its Legend. Mirrors the Figma Chart Donut: give it `items`, and the slices, the Legend and the center follow the values. The width follows the container.",
      },
    },
  },
  args: {
    itemCount: 2,
    legend: "bottom",
    size: "medium",
    label: "Label",
    value: "",
    total: undefined,
    valueType: "number",
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
      if: { arg: "size", neq: "x-small" },
      ...inChart("ChartDonutItem[]"),
    },
    legend: {
      description:
        "Figma Legend. On the right, it moves below the ring when there is no room.",
      control: "select",
      options: legends,
      if: { arg: "size", neq: "x-small" },
      ...inChart("string"),
    },
    size: {
      description:
        "Figma Size. `x-small` is the Figma Chart Donut X-Small: a single item, shown as the ring and its share.",
      control: "select",
      options: sizes,
      ...inChart("string"),
    },
    label: {
      description: "Figma Label, in the center.",
      control: "text",
      if: { arg: "size", neq: "x-small" },
      ...inChart("ReactNode"),
    },
    value: {
      description:
        "Figma Value, in the center. Empty, it shows the Total abbreviated, or the share of the item at X-Small.",
      control: "text",
      ...inChart("ReactNode"),
    },
    total: {
      description:
        "The Total: what a full ring stands for, and what the center shows. Where the items don't reach it, the Track shows. Empty, it is the sum of the items.",
      control: "number",
      ...inChart("number"),
    },
    valueType: {
      description:
        "What the values are. The Legend shows them in full and the center abbreviates them. As `percent`, 75 reads 75%.",
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
      if: { arg: "size", neq: "x-small" },
      ...inItem("number"),
    },
    ...itemArgTypes,
  },
  // `args` leaves out the hidden controls, `allArgs` has the eight items.
  render: function Render(_, { allArgs }) {
    const { itemCount, legend, selectedItem, size } = allArgs
    useShownSelectedItem(selectedItem, shownItemCount(itemCount, size))

    return renderChart(allArgs, itemCount, legend)
  },
} satisfies Meta<ChartDonutStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Items: Story = {
  argTypes: hideControls("itemCount", "size"),
  render: (_, { allArgs }) => (
    <div className="flex flex-col gap-10">
      {itemNumbers.map((itemCount) => (
        <React.Fragment key={itemCount}>
          {renderChart(allArgs, itemCount, allArgs.legend)}
        </React.Fragment>
      ))}
    </div>
  ),
}

export const Legend: Story = {
  argTypes: hideControls("legend", "size"),
  render: function Render(_, { allArgs }) {
    const { itemCount, selectedItem } = allArgs
    useShownSelectedItem(selectedItem, itemCount)

    return (
      <div className="flex flex-col gap-10">
        {legends.map((legend) => (
          <React.Fragment key={legend}>
            {renderChart(allArgs, itemCount, legend)}
          </React.Fragment>
        ))}
      </div>
    )
  },
}

export const Sizes: Story = {
  argTypes: hideControls("size"),
  render: function Render(_, { allArgs }) {
    const { itemCount, legend, selectedItem } = allArgs
    useShownSelectedItem(selectedItem, itemCount)

    return (
      <div className="flex flex-col gap-10">
        {sizes.map((size) => (
          <React.Fragment key={size}>
            {renderChart(allArgs, itemCount, legend, size)}
          </React.Fragment>
        ))}
      </div>
    )
  },
}

export const ValueTypes: Story = {
  argTypes: hideControls("valueType", "itemCount", "selectedItem"),
  render: (_, { allArgs }) => (
    <div className="flex flex-col gap-10">
      {valueTypes.map((valueType) => (
        <ChartDonut
          key={valueType}
          legend={allArgs.legend}
          size={allArgs.size}
          label={allArgs.label}
          valueType={valueType}
          currency={allArgs.currency}
          items={typedSamples[valueType].map((value, index) => ({
            label: valueType,
            value,
            color: allArgs[`item${itemNumbers[index]}Color`],
          }))}
        />
      ))}
    </div>
  ),
}

export const XSmall: Story = {
  name: "X-Small",
  args: { size: "x-small" },
  argTypes: hideControls(
    "size",
    "legend",
    "label",
    "itemCount",
    "selectedItem",
    "valueType",
    "currency"
  ),
}
