import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { Copy01Icon, Edit02Icon, Share08Icon } from "@hugeicons/core-free-icons"

import { DataItem, DataItemAction } from "@/components/ui/data-item"
import { HugeiconsIcon } from "@/components/ui/icon"
import { TooltipProvider } from "@/components/ui/tooltip"

const buttonCounts = [1, 2, 3] as const

const demoActions = [
  { label: "Copy", icon: Copy01Icon },
  { label: "Share", icon: Share08Icon },
  { label: "Edit", icon: Edit02Icon },
]

// Story-only args: the Figma Data Item properties as flat controls.
type DataItemStoryArgs = {
  label: string
  showLabelInfo: boolean
  labelInfo: string
  value: string
  showButtons: boolean
  buttons: (typeof buttonCounts)[number]
  showHelpText: boolean
  helpText: string
  onAction: () => void
}

// No `component`: the table lists only the argTypes below, in their order.
const meta = {
  title: "Components/Data Item",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Serve para exibir informações importantes de forma estruturada, legível e não editável.",
      },
    },
  },
  args: {
    label: "Label",
    showLabelInfo: false,
    labelInfo: "Where this value comes from",
    value: "Value",
    showButtons: false,
    buttons: 3,
    showHelpText: true,
    helpText: "Text Help",
    onAction: fn(),
  },
  argTypes: {
    label: {
      description: "Figma .Label: `label`.",
      control: "text",
      table: { category: "Label", type: { summary: "ReactNode" } },
    },
    showLabelInfo: {
      description:
        "Figma .Label Show Icon Info: pass the tooltip text in `labelInfo`.",
      control: "boolean",
      table: { category: "Label", type: { summary: "boolean" } },
    },
    labelInfo: {
      control: "text",
      if: { arg: "showLabelInfo" },
      table: { category: "Label", type: { summary: "ReactNode" } },
    },
    value: {
      description: "Figma Value: `value`, Body/Medium in Text/Primary.",
      control: "text",
      table: { category: "Field", type: { summary: "ReactNode" } },
    },
    showButtons: {
      description:
        "Figma Show Buttons: pass `<DataItemAction>` buttons in `actions`.",
      control: "boolean",
      table: { category: "Field", type: { summary: "ReactNode" } },
    },
    buttons: {
      description: "Figma Show Button 2 / 3: how many buttons `actions` holds.",
      control: "inline-radio",
      options: buttonCounts,
      if: { arg: "showButtons" },
      table: { category: "Field", type: { summary: "1 | 2 | 3" } },
    },
    showHelpText: {
      description: "Figma .Text Help: pass `helpText`.",
      control: "boolean",
      table: { category: "Text Help", type: { summary: "boolean" } },
    },
    helpText: {
      description: "`helpText`: Body/Small in Text/Secondary.",
      control: "text",
      if: { arg: "showHelpText" },
      table: { category: "Text Help", type: { summary: "ReactNode" } },
    },
    onAction: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="w-60 max-w-[calc(100vw-2rem)]">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  render: (args) => (
    <DataItem
      label={args.label}
      labelInfo={args.showLabelInfo ? args.labelInfo : undefined}
      value={args.value}
      actions={
        args.showButtons &&
        demoActions.slice(0, args.buttons).map((action) => (
          <DataItemAction
            key={action.label}
            aria-label={action.label}
            onClick={args.onAction}
          >
            <HugeiconsIcon icon={action.icon} />
          </DataItemAction>
        ))
      }
      helpText={args.showHelpText ? args.helpText : undefined}
    />
  ),
} satisfies Meta<DataItemStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithButtons: Story = {
  args: { showButtons: true, value: "123.456.789-00" },
}

export const LongValue: Story = {
  args: {
    value: "Rua das Laranjeiras, 1.024, apto 52 — Laranjeiras, Rio de Janeiro",
    showButtons: true,
    buttons: 1,
  },
}
