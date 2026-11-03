import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const

// Story-only args for the positioning and text, which live on TooltipContent.
type TooltipStoryArgs = React.ComponentProps<typeof Tooltip> & {
  side: (typeof sides)[number]
  align: (typeof aligns)[number]
  content: string
}

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Shows a hint when hovering or focusing an element. Mirrors the Figma Tooltip component: Pointer Position is the opposite of `side` (a tooltip on top points down) and Pointer Align follows `align` (Left = start, Right = end).",
      },
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  args: {
    side: "top",
    align: "center",
    content: "Tooltip label",
  },
  argTypes: {
    side: { control: "inline-radio", options: sides },
    align: { control: "inline-radio", options: aligns },
    // Opening is driven by hover and focus, not by a control.
    open: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
  },
  render: ({ side, align, content, ...args }) => (
    <Tooltip {...args}>
      <TooltipTrigger render={<Button variant="secondary" />}>
        Hover me
      </TooltipTrigger>
      <TooltipContent side={side} align={align}>
        {content}
      </TooltipContent>
    </Tooltip>
  ),
} satisfies Meta<TooltipStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sides: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {sides.map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger render={<Button variant="secondary" />}>
            {side}
          </TooltipTrigger>
          <TooltipContent side={side}>Tooltip on the {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
}

// Pointer Align: start (Left), center and end (Right).
export const Align: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {aligns.map((align) => (
        <Tooltip key={align}>
          <TooltipTrigger render={<Button variant="secondary" />}>
            {align}
          </TooltipTrigger>
          <TooltipContent align={align}>Tooltip aligned {align}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
}
