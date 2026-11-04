import type { Meta, StoryObj } from "@storybook/react-vite"
import { userEvent, within } from "storybook/test"

import { InputText } from "@/components/ui/input-text"
import { Label } from "@/components/ui/label"
import { labelArgs, labelArgTypes } from "./label.args"

const meta = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Serve para identificar um campo de formulário, indicando sua obrigatoriedade e oferecendo informações complementares quando necessário.",
      },
    },
  },
  args: {
    ...labelArgs,
    state: "default",
  },
  argTypes: {
    ...labelArgTypes,
    state: {
      control: "select",
      options: ["default", "read-only", "disabled"],
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ReadOnly: Story = {
  args: { state: "read-only" },
}

export const Disabled: Story = {
  args: { state: "disabled" },
}

export const Required: Story = {
  args: { requirement: "(obrigatório)" },
}

export const Optional: Story = {
  args: { requirement: "(opcional)" },
}

// Hovers the icon, so the story opens with the tooltip showing.
export const WithInfo: Story = {
  args: { requirement: "(obrigatório)", info: "Texto de ajuda" },
  play: async ({ canvasElement }) => {
    await userEvent.hover(within(canvasElement).getByLabelText("Info"))
  },
}

export const WithInput: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-2">
      <Label {...args} htmlFor="story-label-input" />
      <InputText id="story-label-input" placeholder="Placeholder" />
    </div>
  ),
}
