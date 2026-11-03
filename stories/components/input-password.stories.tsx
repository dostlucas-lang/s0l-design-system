import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"

import { InputPassword } from "@/components/ui/input-password"
import { inputLabelArgTypes, labelArgs } from "./label.args"
import {
  getLeadingIcon,
  leadingIconArgs,
  leadingIconArgTypes,
  type LeadingIconArgs,
} from "./leading-icon.args"

type StoryArgs = Omit<React.ComponentProps<typeof InputPassword>, "icon"> &
  LeadingIconArgs

const meta = {
  title: "Components/Input Password",
  component: InputPassword as React.ComponentType<StoryArgs>,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A password field built on Input Text, with Button View to show or hide the characters. Mirrors the Figma Input Password component: State (Default / Hover / Active / Disabled / Read Only) × Filled × Error.",
      },
    },
  },
  args: {
    ...labelArgs,
    ...leadingIconArgs,
    label: "Senha",
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
    ...leadingIconArgTypes,
  },
  render: ({ showIcon, icon, ...args }) => (
    <InputPassword {...args} icon={getLeadingIcon({ showIcon, icon })} />
  ),
} satisfies Meta<StoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid w-fit grid-cols-3 gap-x-10 gap-y-8">
      <InputPassword className="w-60" label="Senha" placeholder="Placeholder" />
      <InputPassword
        className="w-60"
        label="Senha"
        placeholder="Placeholder"
        error="Text Error"
      />
      <InputPassword
        className="w-60"
        label="Senha"
        placeholder="Placeholder"
        disabled
      />
      <InputPassword className="w-60" label="Senha" defaultValue="password" />
      <InputPassword
        className="w-60"
        label="Senha"
        defaultValue="password"
        error="Text Error"
      />
      <InputPassword
        className="w-60"
        label="Senha"
        defaultValue="password"
        readOnly
      />
    </div>
  ),
}

export const Filled: Story = {
  args: { defaultValue: "password" },
}

export const WithError: Story = {
  args: { defaultValue: "password", error: "Text Error" },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "password" },
}
