import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"

import { HugeiconsIcon } from "@/components/ui/icon"
import { Tag } from "@/components/ui/tag"
import { findHugeicon } from "../hugeicons"

const colors = [
  "neutral",
  "accent",
  "info",
  "success",
  "warning",
  "danger",
] as const

// Story-only args: `icon` is a Hugeicons name ("Command", "Plus Sign"…),
// empty for no icon; `dismissible` is the Figma Dismissible boolean.
type TagStoryArgs = Omit<React.ComponentProps<typeof Tag>, "icon"> & {
  label: string
  icon: string
  dismissible: boolean
}

function StoryTag({
  label,
  icon,
  dismissible,
  onDismiss,
  iconOnly,
  ...args
}: TagStoryArgs) {
  const found = findHugeicon(icon)

  return (
    <Tag
      {...args}
      iconOnly={iconOnly}
      icon={found && <HugeiconsIcon icon={found} />}
      onDismiss={dismissible ? onDismiss : undefined}
      aria-label={iconOnly ? label : undefined}
    >
      {label}
    </Tag>
  )
}

const meta = {
  title: "Components/Tag",
  component: Tag,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A short label for status, categories or filters. Mirrors the Figma Tag: Size (Small / Medium) × Color (Neutral / Accent / Info / Success / Warning / Danger) × Emphasis (Soft / Strong) × State (Default / Disabled) × Icon Only, with Show Icon and Dismissible.",
      },
    },
  },
  args: {
    label: "Label",
    icon: "Command",
    size: "sm",
    color: "neutral",
    emphasis: "soft",
    disabled: false,
    iconOnly: false,
    dismissible: true,
    onDismiss: fn(),
  },
  argTypes: {
    label: { if: { arg: "iconOnly", truthy: false } },
    icon: { control: "text" },
    size: { control: "inline-radio", options: ["sm", "md"] },
    color: { control: "select", options: colors },
    emphasis: { control: "inline-radio", options: ["soft", "strong"] },
    dismissible: { if: { arg: "iconOnly", truthy: false } },
    onDismiss: { table: { disable: true } },
    render: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  render: (args) => <StoryTag {...args} />,
} satisfies Meta<TagStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

// Size: Small (24px) and Medium (32px).
export const Size: Story = {
  argTypes: { size: { table: { disable: true } } },
  render: (args) => (
    <div className="flex items-center gap-4">
      <StoryTag {...args} size="sm" />
      <StoryTag {...args} size="md" />
    </div>
  ),
}

// Emphasis=Soft in every Color.
export const Colors: Story = {
  argTypes: { color: { table: { disable: true } } },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {colors.map((color) => (
        <StoryTag key={color} {...args} color={color} label={color} />
      ))}
    </div>
  ),
}

// Emphasis=Strong in every Color.
export const Strong: Story = {
  args: { emphasis: "strong" },
  argTypes: {
    color: { table: { disable: true } },
    emphasis: { table: { disable: true } },
  },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {colors.map((color) => (
        <StoryTag key={color} {...args} color={color} label={color} />
      ))}
    </div>
  ),
}

export const IconOnly: Story = {
  args: { iconOnly: true },
}

export const WithIcon: Story = {
  args: { icon: "Command", dismissible: false },
}

export const Dismissible: Story = {
  args: { icon: "", dismissible: true },
}
