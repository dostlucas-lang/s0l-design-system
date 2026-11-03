import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowUp02Icon, CommandIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@/components/ui/icon"
import { Kbd, KbdGroup } from "@/components/ui/kbd"

const meta = {
  title: "Components/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: { component: "Displays a keyboard key or shortcut." },
    },
  },
  args: {
    children: "Esc",
  },
} satisfies Meta<typeof Kbd>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithIcon: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Kbd {...args}>
        <HugeiconsIcon icon={CommandIcon} />
      </Kbd>
      <Kbd {...args}>
        <HugeiconsIcon icon={ArrowUp02Icon} />
      </Kbd>
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span className="text-sm text-muted-foreground">+</span>
        <Kbd>Shift</Kbd>
        <span className="text-sm text-muted-foreground">+</span>
        <Kbd>P</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </div>
  ),
}

export const InButton: Story = {
  args: { children: "⌘K" },
  render: (args) => (
    <Button variant="secondary" size="sm">
      Search
      <Kbd {...args} />
    </Button>
  ),
}
