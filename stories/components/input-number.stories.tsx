import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { InputNumber } from "@/components/ui/input-number"
import { inputLabelArgTypes, labelArgs } from "./label.args"
import {
  getLeadingIcon,
  leadingIconArgs,
  leadingIconArgTypes,
  type LeadingIconArgs,
} from "./leading-icon.args"

type StoryArgs = Omit<React.ComponentProps<typeof InputNumber>, "icon"> &
  LeadingIconArgs

const meta = {
  title: "Components/Input Number",
  component: InputNumber as React.ComponentType<StoryArgs>,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Serve para inserir ou ajustar valores numéricos de forma controlada.",
      },
    },
  },
  args: {
    ...labelArgs,
    ...leadingIconArgs,
    placeholder: "0",
    disabled: false,
    readOnly: false,
    className: "w-60",
  },
  argTypes: {
    ...leadingIconArgTypes,
    ...inputLabelArgTypes,
    helpText: { control: "text" },
    error: { control: "text" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    value: { table: { disable: true } },
    defaultValue: { control: "number" },
    onValueChange: { table: { disable: true } },
    onValueCommitted: { table: { disable: true } },
  },
  render: ({ showIcon, icon, ...args }) => (
    <InputNumber {...args} icon={getLeadingIcon({ showIcon, icon })} />
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
      <InputNumber className="w-60" label="Label" placeholder="0" />
      <InputNumber
        className="w-60"
        label="Label"
        placeholder="0"
        error="Text Error"
      />
      <InputNumber className="w-60" label="Label" placeholder="0" disabled />
      <InputNumber className="w-60" label="Label" defaultValue={1} />
      <InputNumber
        className="w-60"
        label="Label"
        defaultValue={1}
        error="Text Error"
      />
      <InputNumber className="w-60" label="Label" defaultValue={1} readOnly />
    </div>
  ),
}

export const WithIcon: Story = {
  args: { showIcon: true, icon: "Package" },
}

export const WithHelpText: Story = {
  args: { helpText: "Text Help" },
}

export const MinAndMax: Story = {
  args: { defaultValue: 1, min: 0, max: 10, helpText: "From 0 to 10" },
}
