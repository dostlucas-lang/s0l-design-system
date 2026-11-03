import type { Meta, StoryObj } from "@storybook/react-vite"
import { CommandIcon } from "@hugeicons/core-free-icons"
import { useArgs } from "storybook/preview-api"
import { fn } from "storybook/test"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tabs = [
  {
    value: "account",
    label: "Account",
    content: "Manage your account details.",
  },
  { value: "password", label: "Password", content: "Change your password." },
  { value: "billing", label: "Billing", content: "Update your billing info." },
]

// Story-only args: Level, Show Icon and Show Badge live on the list and the
// triggers.
type TabsStoryArgs = React.ComponentProps<typeof Tabs> & {
  level: "primary" | "secondary"
  showIcon: boolean
  showBadge: boolean
}

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Switches between related panels of content. Mirrors the Figma Tabs component: Level (Primary / Secondary) × Count, with the .Tab Primary / .Tab Secondary states (Default, Hover, Disabled, Active), Show Icon and Show Badge.",
      },
    },
  },
  args: {
    value: "account",
    level: "primary",
    showIcon: false,
    showBadge: false,
    onValueChange: fn(),
  },
  argTypes: {
    value: { control: "text" },
    level: { control: "inline-radio", options: ["primary", "secondary"] },
  },
  // Keeps the value control in sync when a tab is clicked.
  render: function Render({ level, showIcon, showBadge, ...args }) {
    const [, updateArgs] = useArgs()

    return (
      <Tabs
        {...args}
        onValueChange={(value, details) => {
          updateArgs({ value })
          args.onValueChange?.(value, details)
        }}
      >
        <TabsList level={level}>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              icon={showIcon ? CommandIcon : undefined}
              badge={showBadge ? 1 : undefined}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    )
  },
} satisfies Meta<TabsStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

// The Figma Tabs grid for 3 tabs, plus the partial states: the last tab is
// disabled and the second one shows a badge.
export const Levels: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-10">
      {(["primary", "secondary"] as const).map((level) => (
        <Tabs key={level} defaultValue="1">
          <TabsList level={level}>
            <TabsTrigger value="1" icon={CommandIcon}>
              Label
            </TabsTrigger>
            <TabsTrigger value="2" icon={CommandIcon} badge={1}>
              Label
            </TabsTrigger>
            <TabsTrigger value="3" icon={CommandIcon}>
              Label
            </TabsTrigger>
            <TabsTrigger value="4" icon={CommandIcon} disabled>
              Label
            </TabsTrigger>
          </TabsList>
        </Tabs>
      ))}
    </div>
  ),
}

export const Secondary: Story = {
  args: { level: "secondary" },
}

export const WithBadge: Story = {
  args: { showBadge: true },
}

export const WithIcon: Story = {
  args: { showIcon: true },
}
