import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Divider } from "@/components/ui/divider"

const meta = {
  title: "Components/Divider",
  component: Divider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Visually divides content. Mirrors the Figma Divider: a 1px line in Border/Secondary that fills the width of its container.",
      },
    },
  },
  args: {
    orientation: "horizontal",
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
  },
  render: (args) =>
    args.orientation === "vertical" ? (
      // Same 240px length as the horizontal one, standing up.
      <div className="flex h-60">
        <Divider {...args} />
      </div>
    ) : (
      // The Figma Divider is 240px wide.
      <div className="w-60">
        <Divider {...args} />
      </div>
    ),
} satisfies Meta<typeof Divider>

export default meta

type Story = StoryObj<typeof meta>

export const Horizontal: Story = {}

export const Vertical: Story = {
  args: { orientation: "vertical" },
}
