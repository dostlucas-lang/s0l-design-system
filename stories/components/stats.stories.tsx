import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Stats } from "@/components/ui/stats"
import { TooltipProvider } from "@/components/ui/tooltip"

const sizes = ["sm", "md", "lg"] as const
const trends = ["positive", "negative"] as const

// Story-only args: the Figma Stats properties as flat controls.
type StatsStoryArgs = {
  size: (typeof sizes)[number]
  showLabel: boolean
  label: string
  showInfo: boolean
  info: string
  value: string
  showTrend: boolean
  trend: (typeof trends)[number]
  trendValue: string
  showDescription: boolean
  description: string
}

// No `component`: the table lists only the argTypes below, in their order.
const meta = {
  title: "Components/Stats",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A key number with its label, change and context. Mirrors the Figma Stats: Size (Small / Medium / Large) sets the value's Heading style (Medium / Large / X-Large); Show Label, Show Info Icon, Show Trend (with Negative) and Show Description are props. The Info icon opens `info` in a Tooltip.",
      },
    },
  },
  args: {
    size: "sm",
    showLabel: true,
    label: "Label",
    showInfo: false,
    info: "How this number is calculated",
    value: "1.000",
    showTrend: false,
    trend: "positive",
    trendValue: "100%",
    showDescription: true,
    description: "Description",
  },
  argTypes: {
    size: {
      description: "Figma Size: Small / Medium / Large.",
      control: "inline-radio",
      options: sizes,
      table: {
        type: { summary: '"sm" | "md" | "lg"' },
        defaultValue: { summary: '"sm"' },
      },
    },
    showLabel: {
      description: "Figma Show Label: pass `label`.",
      control: "boolean",
      table: { type: { summary: "boolean" } },
    },
    label: {
      description: "`label`: Label/Small in Text/Primary.",
      control: "text",
      if: { arg: "showLabel" },
      table: { type: { summary: "ReactNode" } },
    },
    showInfo: {
      description: "Figma Show Info Icon: pass the tooltip text in `info`.",
      control: "boolean",
      table: { type: { summary: "boolean" } },
    },
    info: {
      description: "`info`: what the Info icon's Tooltip says.",
      control: "text",
      if: { arg: "showInfo" },
      table: { type: { summary: "ReactNode" } },
    },
    value: {
      description: "Figma Value: `value`, in the Heading style of the size.",
      control: "text",
      table: { type: { summary: "ReactNode" } },
    },
    showTrend: {
      description: "Figma Show Trend: pass `trend` and `trendValue`.",
      control: "boolean",
      table: { type: { summary: "boolean" } },
    },
    trend: {
      description:
        "Figma Negative: `trend` (positive = False, negative = True).",
      control: "inline-radio",
      options: trends,
      if: { arg: "showTrend" },
      table: { type: { summary: '"positive" | "negative"' } },
    },
    trendValue: {
      description: "Figma Trend Value: `trendValue`, Label/Small.",
      control: "text",
      if: { arg: "showTrend" },
      table: { type: { summary: "ReactNode" } },
    },
    showDescription: {
      description: "Figma Show Description: pass `description`.",
      control: "boolean",
      table: { type: { summary: "boolean" } },
    },
    description: {
      description: "`description`: Body/Small in Text/Secondary.",
      control: "text",
      if: { arg: "showDescription" },
      table: { type: { summary: "ReactNode" } },
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="w-36">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  render: (args) => (
    <Stats
      size={args.size}
      label={args.showLabel ? args.label : undefined}
      info={args.showInfo ? args.info : undefined}
      value={args.value}
      trend={args.showTrend ? args.trend : undefined}
      trendValue={args.trendValue}
      description={args.showDescription ? args.description : undefined}
    />
  ),
} satisfies Meta<StatsStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Small: Story = { args: { size: "sm" } }

export const Medium: Story = { args: { size: "md" } }

export const Large: Story = { args: { size: "lg" } }

export const PositiveTrend: Story = {
  args: { showTrend: true, trend: "positive" },
}

export const NegativeTrend: Story = {
  args: { showTrend: true, trend: "negative" },
}

export const WithInfo: Story = { args: { showInfo: true } }
