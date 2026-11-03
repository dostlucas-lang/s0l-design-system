import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs } from "storybook/preview-api"

import { ChartLine } from "@/components/ui/chart-line"
import type { ChartColor } from "@/components/ui/chart-legend"

type LineNumber = 1 | 2 | 3 | 4
type NodeCount = 3 | 6 | 7 | 12 | 24 | 31
type NodesOption = NodeCount | "dynamic"

// One copy of the line props per line. `selectedLine` picks the one the panel shows.
type LineArgs = Record<
  `line${LineNumber}Label` | `line${LineNumber}Values`,
  string
> &
  Record<`line${LineNumber}Color`, ChartColor>

// The panel follows the Figma properties. `lineCount` and `nodes` only exist
// here: in code, the sizes of `lines` and `xLabels`.
type ChartLineStoryArgs = LineArgs & {
  lineCount: LineNumber
  nodes: NodesOption
  selectedLine: LineNumber
}

const inSection = (category: string, type: string) => ({
  table: { category, type: { summary: type } },
})

const inChart = (type: string) => inSection("Chart Line", type)
const inLine = (type: string) => inSection("Chart Line Item", type)

const lineNumbers: LineNumber[] = [1, 2, 3, 4]
const nodeCounts: NodeCount[] = [3, 6, 7, 12, 24, 31]
const colors: ChartColor[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const hideControls = (...names: (keyof ChartLineStoryArgs)[]) =>
  Object.fromEntries(names.map((name) => [name, { table: { disable: true } }]))

const months = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
]

const xLabels: Record<NodeCount, string[]> = {
  3: months.slice(0, 3).map((month) => `${month}/26`),
  6: months.slice(0, 6).map((month) => `${month}/26`),
  7: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  12: months,
  24: Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, "0")),
  31: Array.from({ length: 31 }, (_, day) => String(day + 1)),
}

// The Figma samples. Past 12 nodes they start over.
const sampleValues: Record<LineNumber, number[]> = {
  1: [10, 40, 30, 20, 60, 80, 90, 70, 80, 70, 60, 50],
  2: [40, 30, 50, 95, 75, 40, 50, 30, 40, 60, 70, 60],
  3: [20, 10, 40, 60, 85, 60, 70, 50, 30, 50, 70, 60],
  4: [85, 70, 20, 70, 40, 10, 30, 20, 10, 25, 30, 10],
}

const threeNodeValues: Record<LineNumber, number[]> = {
  1: sampleValues[1],
  2: sampleValues[2],
  3: sampleValues[3],
  4: [60, 20, 10],
}

const sampleLine = (line: LineNumber, nodes: NodesOption) => {
  if (nodes === "dynamic") return sampleValues[line]

  const values = nodes === 3 ? threeNodeValues[line] : sampleValues[line]

  return Array.from(
    { length: nodes },
    (_, node) => values[node % values.length]
  )
}

// "1.000,5; ; -20" in the panel: a blank between semicolons leaves a gap. A
// semicolon at the end doesn't add a node.
const parseValues = (text: string) =>
  text
    .trim()
    .replace(/;$/, "")
    .split(";")
    .map((item) => {
      const value = item.trim().replace(/\./g, "").replace(",", ".")

      return value === "" ? null : Number(value)
    })

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const lineDefaults = (line: LineNumber) => ({
  label: "Label",
  values: "",
  color: line,
})

const lineControls = {
  label: {
    description: "The name in the Legend.",
    control: "text",
    summary: "string",
  },
  values: {
    description:
      "Any values, separated by semicolons: `1.250; -30,5; 0`. Leave one blank for a gap. With `nodes` as `dynamic`, they set how many nodes there are. Empty, the line shows the Figma sample.",
    control: "text",
    summary: "(number | null)[]",
  },
  color: {
    description: "Figma Chart/1 to Chart/10.",
    control: "select",
    options: colors,
    summary: "number",
  },
}

const lineKey = (line: LineNumber, field: string) =>
  `line${line}${field[0].toUpperCase()}${field.slice(1)}` as keyof LineArgs

const lineArgs = Object.fromEntries(
  lineNumbers.flatMap((line) =>
    Object.entries(lineDefaults(line)).map(([field, value]) => [
      lineKey(line, field),
      value,
    ])
  )
) as LineArgs

const lineArgTypes = Object.fromEntries(
  lineNumbers.flatMap((line) =>
    Object.entries(lineControls).map(([field, { summary, ...argType }]) => [
      lineKey(line, field),
      {
        ...argType,
        name: field,
        if: { arg: "selectedLine", eq: line },
        ...inLine(summary),
      },
    ])
  )
)

const renderChart = (
  args: LineArgs,
  lineCount: LineNumber,
  nodes: NodesOption
) => {
  const shownLines = lineNumbers.slice(0, lineCount)
  const isTyped = (line: LineNumber) => args[`line${line}Values`].trim() !== ""
  // Money only suits the Figma samples: typed values can be anything.
  const sample = !shownLines.some(isTyped)

  return (
    <ChartLine
      xLabels={nodes === "dynamic" ? undefined : xLabels[nodes]}
      formatValue={sample ? money.format : undefined}
      lines={shownLines.map((line) => ({
        label: args[`line${line}Label`],
        color: args[`line${line}Color`],
        values: isTyped(line)
          ? parseValues(args[`line${line}Values`])
          : sampleLine(line, nodes),
      }))}
    />
  )
}

// A line that isn't shown can't be edited.
const useShownSelectedLine = (
  selectedLine: LineNumber,
  lineCount: LineNumber
) => {
  const [, updateArgs] = useArgs<ChartLineStoryArgs>()

  React.useEffect(() => {
    if (selectedLine > lineCount) updateArgs({ selectedLine: lineCount })
  }, [lineCount, selectedLine, updateArgs])
}

const meta = {
  title: "Components/Chart Line",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A line chart with its axes and Legend. Mirrors the Figma Chart Line: give it `lines`, and optionally `xLabels`, and hovering a node shows its values. Without `xLabels`, the longest line sets the nodes. The width follows the container.",
      },
    },
  },
  args: {
    lineCount: 2,
    nodes: 7,
    selectedLine: 1,
    ...lineArgs,
  },
  argTypes: {
    lineCount: {
      name: "lines",
      description: "Figma Lines. In code, the `lines` array.",
      control: "select",
      options: lineNumbers,
      ...inChart("ChartLineSeries[]"),
    },
    nodes: {
      description:
        "Figma Nodes. `dynamic` follows the data: the longest line in `values` sets the nodes. In code, one of `xLabels` per node, or no `xLabels` for `dynamic`.",
      control: "select",
      options: [...nodeCounts, "dynamic"],
      ...inChart("string[]"),
    },
    selectedLine: {
      name: "line",
      description:
        "The line that the controls below edit. It can't go past `lines`.",
      control: "select",
      options: lineNumbers,
      ...inLine("number"),
    },
    ...lineArgTypes,
  },
  // `args` leaves out the hidden controls, `allArgs` has the four lines.
  render: function Render({ lineCount, nodes, selectedLine }, { allArgs }) {
    useShownSelectedLine(selectedLine, lineCount)

    return renderChart(allArgs, lineCount, nodes)
  },
} satisfies Meta<ChartLineStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Lines: Story = {
  argTypes: hideControls("lineCount"),
  render: ({ nodes }, { allArgs }) => (
    <div className="flex flex-col gap-10">
      {lineNumbers.map((lineCount) => (
        <React.Fragment key={lineCount}>
          {renderChart(allArgs, lineCount, nodes)}
        </React.Fragment>
      ))}
    </div>
  ),
}

export const Nodes: Story = {
  argTypes: hideControls("nodes"),
  render: function Render({ lineCount, selectedLine }, { allArgs }) {
    useShownSelectedLine(selectedLine, lineCount)

    return (
      <div className="flex flex-col gap-10">
        {nodeCounts.map((nodes) => (
          <React.Fragment key={nodes}>
            {renderChart(allArgs, lineCount, nodes)}
          </React.Fragment>
        ))}
      </div>
    )
  },
}
