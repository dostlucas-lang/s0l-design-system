import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"

import { InputSearch } from "@/components/ui/input-search"

const meta = {
  title: "Components/Input Search",
  component: InputSearch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Serve para encontrar conteúdo relevante ao inserir palavras-chave.",
      },
    },
  },
  args: {
    placeholder: "Buscar",
    disabled: false,
    readOnly: false,
    clearable: true,
    className: "w-60",
    onChange: fn(),
    onClear: fn(),
  },
  argTypes: {
    helpText: { control: "text" },
    action: { control: false },
  },
} satisfies Meta<typeof InputSearch>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid w-fit grid-cols-2 gap-x-10 gap-y-8">
      <InputSearch className="w-60" placeholder="Buscar" />
      <InputSearch className="w-60" placeholder="Buscar" disabled />
      <InputSearch className="w-60" defaultValue="Value" />
      <InputSearch className="w-60" defaultValue="Value" readOnly />
    </div>
  ),
}

export const Filled: Story = {
  args: { defaultValue: "Value" },
}

export const WithHelpText: Story = {
  args: { helpText: "Text Help" },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "Value" },
}
