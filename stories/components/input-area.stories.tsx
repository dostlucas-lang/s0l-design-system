import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { InputArea } from "@/components/ui/input-area"
import { inputLabelArgTypes, labelArgs } from "./label.args"
import {
  getLeadingIcon,
  leadingIconArgs,
  leadingIconArgTypes,
  type LeadingIconArgs,
} from "./leading-icon.args"

type StoryArgs = Omit<React.ComponentProps<typeof InputArea>, "icon"> &
  LeadingIconArgs

const meta = {
  title: "Components/Input Area",
  component: InputArea as React.ComponentType<StoryArgs>,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A multi-line text field. Mirrors the Figma Input Area component: State (Default / Hover / Active / Disabled / Read Only) × Filled × Error, plus Resizable. Hover, Active and Filled follow the browser; Disabled, Read Only and Error come from props.",
      },
    },
  },
  args: {
    ...labelArgs,
    ...leadingIconArgs,
    placeholder: "Placeholder",
    disabled: false,
    readOnly: false,
    clearable: true,
    resizable: true,
    className: "w-60",
    onChange: fn(),
    onClear: fn(),
  },
  argTypes: {
    ...inputLabelArgTypes,
    helpText: { control: "text" },
    error: { control: "text" },
    ...leadingIconArgTypes,
  },
  render: ({ showIcon, icon, ...args }) => (
    <InputArea {...args} icon={getLeadingIcon({ showIcon, icon })} />
  ),
} satisfies Meta<StoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

// The Figma variant grid: Filled=False on top, Filled=True below.
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid w-fit grid-cols-3 gap-x-10 gap-y-8">
      <InputArea className="w-60" label="Label" placeholder="Placeholder" />
      <InputArea
        className="w-60"
        label="Label"
        placeholder="Placeholder"
        error="Text Error"
      />
      <InputArea
        className="w-60"
        label="Label"
        placeholder="Placeholder"
        disabled
      />
      <InputArea className="w-60" label="Label" defaultValue="Value" />
      <InputArea
        className="w-60"
        label="Label"
        defaultValue="Value"
        error="Text Error"
      />
      <InputArea className="w-60" label="Label" defaultValue="Value" readOnly />
    </div>
  ),
}

export const WithHelpText: Story = {
  args: { helpText: "Text Help" },
}

export const WithError: Story = {
  args: { defaultValue: "Value", error: "Text Error" },
}

export const RequiredWithInfo: Story = {
  args: {
    requirement: "(obrigatório)",
    info: "More about this field",
  },
}

export const WithIcon: Story = {
  args: { label: "Notes", showIcon: true, icon: "Note" },
}

export const NotResizable: Story = {
  args: { resizable: false },
}

export const LongValue: Story = {
  args: {
    defaultValue:
      "The field grows with its content, and the Resize Handle lets the user make it taller by hand.",
  },
}

export const Disabled: Story = {
  args: { disabled: true, helpText: "Text Help" },
}

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "Value" },
}
