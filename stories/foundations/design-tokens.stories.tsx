import type { Meta, StoryObj } from "@storybook/react-vite"

import { DesignTokens } from "./design-tokens"

const meta = {
  title: "Foundations/Design Tokens",
  component: DesignTokens,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Primitives, semantic modes, accents and styles from the S0L Figma variables.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <DesignTokens />
    </div>
  ),
} satisfies Meta<typeof DesignTokens>

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {}
