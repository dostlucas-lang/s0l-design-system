import type { Meta, StoryObj } from "@storybook/react-vite"

import { Spinner } from "@/components/ui/spinner"

const sizes = [16, 20, 24, 32, 40, 56] as const

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Serve para representar visualmente o processamento de uma operação rápida do sistema, em que a duração não importa ou não pode ser prevista.",
      },
    },
  },
  args: {
    size: 24,
  },
  argTypes: {
    size: { control: "inline-radio", options: sizes },
  },
} satisfies Meta<typeof Spinner>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

// The Figma variant grid.
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-10">
      {sizes.map((size) => (
        <Spinner key={size} size={size} />
      ))}
    </div>
  ),
}
