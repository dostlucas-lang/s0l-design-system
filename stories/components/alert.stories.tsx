import type { Meta, StoryObj } from "@storybook/react-vite"
import { Notification01Icon } from "@hugeicons/core-free-icons"
import { fn } from "storybook/test"

import { Alert, AlertAction } from "@/components/ui/alert"
import { HugeiconsIcon } from "@/components/ui/icon"

const colors = ["brand", "info", "success", "warning", "danger"] as const

// Story-only args matching the Figma toggles; they map to the icon and
// actions props.
type AlertStoryArgs = React.ComponentProps<typeof Alert> & {
  showIcon: boolean
  actionCount: 0 | 1 | 2
}

const meta = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Displays a callout for user attention. Mirrors the Figma Alert: Color × Direction, with Title, Description, Icon, Actions and Dismissable.",
      },
    },
  },
  args: {
    color: "brand",
    direction: "inline",
    title: "Title",
    children: "Lorem ipsum dolor sit amet, consectetur",
    showIcon: true,
    actionCount: 2,
    dismissible: true,
    dismissLabel: "Dismiss",
    onDismiss: fn(),
  },
  argTypes: {
    color: { control: "inline-radio", options: colors },
    direction: { control: "inline-radio", options: ["inline", "stacked"] },
    title: { control: "text" },
    children: { control: "text" },
    actionCount: { control: "inline-radio", options: [0, 1, 2] },
    icon: { control: false },
    actions: { control: false },
  },
  render: ({ showIcon, actionCount, ...args }) => (
    <Alert
      {...args}
      // Remount after a dismiss so changing a control brings the alert back.
      key={JSON.stringify(args)}
      icon={showIcon ? args.icon : false}
      actions={
        actionCount > 0 && (
          <>
            <AlertAction>Action 1</AlertAction>
            {actionCount > 1 && <AlertAction>Action 2</AlertAction>}
          </>
        )
      }
    />
  ),
} satisfies Meta<AlertStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Stacked: Story = {
  args: { direction: "stacked" },
}

export const Colors: Story = {
  render: ({ showIcon, actionCount, ...args }) => (
    <div className="flex flex-col gap-4">
      {colors.map((color) => (
        <Alert
          key={color}
          {...args}
          color={color}
          icon={showIcon ? undefined : false}
          actions={actionCount > 0 && <AlertAction>Action</AlertAction>}
        />
      ))}
    </div>
  ),
}

export const DescriptionOnly: Story = {
  args: {
    color: "info",
    title: undefined,
    actionCount: 0,
    dismissible: false,
    children: "Description only, without title or actions.",
  },
}

export const CustomIcon: Story = {
  args: {
    title: "New feature",
    icon: <HugeiconsIcon icon={Notification01Icon} />,
    actionCount: 1,
    dismissible: false,
    children: "Custom icon and a single action.",
  },
}
