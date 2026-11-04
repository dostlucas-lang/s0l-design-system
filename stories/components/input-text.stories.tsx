import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Copy01Icon } from "@hugeicons/core-free-icons"
import { fn } from "storybook/test"

import { HugeiconsIcon } from "@/components/ui/icon"
import { InputAction } from "@/components/ui/input-base"
import { InputText } from "@/components/ui/input-text"
import { inputLabelArgTypes, labelArgs } from "./label.args"
import {
  getLeadingIcon,
  leadingIconArgs,
  leadingIconArgTypes,
  type LeadingIconArgs,
} from "./leading-icon.args"

type StoryArgs = Omit<React.ComponentProps<typeof InputText>, "icon"> &
  LeadingIconArgs

const meta = {
  title: "Components/Input Text",
  component: InputText as React.ComponentType<StoryArgs>,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Serve para inserir dados textuais. Pode ser adaptado para diferentes casos de uso, como texto comum, senhas, telefones, entre outros.",
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
    className: "w-60",
    onChange: fn(),
    onClear: fn(),
  },
  argTypes: {
    ...inputLabelArgTypes,
    helpText: { control: "text" },
    error: { control: "text" },
    prefix: { control: "text" },
    ...leadingIconArgTypes,
    action: { control: false },
  },
  render: ({ showIcon, icon, ...args }) => (
    <InputText {...args} icon={getLeadingIcon({ showIcon, icon })} />
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
      <InputText className="w-60" label="Label" placeholder="Placeholder" />
      <InputText
        className="w-60"
        label="Label"
        placeholder="Placeholder"
        error="Text Error"
      />
      <InputText
        className="w-60"
        label="Label"
        placeholder="Placeholder"
        disabled
      />
      <InputText className="w-60" label="Label" defaultValue="Value" />
      <InputText
        className="w-60"
        label="Label"
        defaultValue="Value"
        error="Text Error"
      />
      <InputText className="w-60" label="Label" defaultValue="Value" readOnly />
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
  args: {
    label: "Email",
    showIcon: true,
    icon: "Mail",
    placeholder: "you@example.com",
  },
}

export const WithPrefix: Story = {
  args: { label: "Price", prefix: "R$", defaultValue: "120,00" },
}

export const WithActionInset: Story = {
  args: {
    label: "Link",
    defaultValue: "https://s0l.design",
    clearable: false,
    action: (
      <InputAction aria-label="Copy">
        <HugeiconsIcon icon={Copy01Icon} />
      </InputAction>
    ),
  },
}

export const Disabled: Story = {
  args: { disabled: true, helpText: "Text Help" },
}

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "Value" },
}
