import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  CommandIcon,
  Search01Icon,
  SparklesIcon,
  InformationCircleIcon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Alert02Icon,
  Folder01Icon,
} from "@hugeicons/core-free-icons"

import { IconColors } from "@/components/ui/icon-colors"

// A short pick of Hugeicons for the control; any icon from the library works.
const iconOptions = {
  Command: CommandIcon,
  Search: Search01Icon,
  Sparkles: SparklesIcon,
  Information: InformationCircleIcon,
  Checkmark: CheckmarkCircle02Icon,
  Alert: AlertCircleIcon,
  Danger: Alert02Icon,
  Folder: Folder01Icon,
}

const colors = ["accent", "info", "success", "warning", "danger"] as const

const meta = {
  title: "Components/Icon Colors",
  component: IconColors,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Serve para destacar um ícone, reforçando significado, hierarquia ou status.",
      },
    },
  },
  args: {
    color: "accent",
    container: false,
  },
  argTypes: {
    color: { control: "inline-radio", options: colors },
    // cva types booleans as boolean | null, which infers an object control.
    container: { control: "boolean" },
    icon: {
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      control: "select",
    },
  },
} satisfies Meta<typeof IconColors>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Colors: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      {colors.map((color) => (
        <IconColors key={color} {...args} color={color} />
      ))}
    </div>
  ),
}

export const WithContainer: Story = {
  args: { container: true },
  render: Colors.render,
}
