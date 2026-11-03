import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs } from "storybook/preview-api"
import { fn } from "storybook/test"

import { Button } from "@/components/ui/button"
import { InputText } from "@/components/ui/input-text"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

const sides = ["top", "right", "bottom", "left"] as const

// Story-only args for the positioning and content, which live on
// PopoverContent rather than the root.
type PopoverStoryArgs = React.ComponentProps<typeof Popover> & {
  side: (typeof sides)[number]
  align: "start" | "center" | "end"
  sideOffset: number
  title: string
  description: string
}

const meta = {
  title: "Components/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Rich content in a floating panel anchored to a trigger.",
      },
    },
  },
  args: {
    open: false,
    side: "bottom",
    align: "center",
    sideOffset: 4,
    title: "Dimensions",
    description: "Set the dimensions for the layer.",
    onOpenChange: fn(),
  },
  argTypes: {
    side: { control: "inline-radio", options: sides },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
  },
  // Keeps the open control in sync with the trigger and outside clicks.
  render: function Render({
    side,
    align,
    sideOffset,
    title,
    description,
    ...args
  }) {
    const [, updateArgs] = useArgs()

    return (
      <Popover
        {...args}
        onOpenChange={(open, details) => {
          updateArgs({ open })
          args.onOpenChange?.(open, details)
        }}
      >
        <PopoverTrigger render={<Button variant="secondary" />}>
          {title}
        </PopoverTrigger>
        <PopoverContent side={side} align={align} sideOffset={sideOffset}>
          <PopoverHeader>
            <PopoverTitle>{title}</PopoverTitle>
            {description && (
              <PopoverDescription>{description}</PopoverDescription>
            )}
          </PopoverHeader>
          <div className="grid grid-cols-3 items-center gap-2">
            <Label htmlFor="story-popover-width" label="Width" />
            <InputText
              id="story-popover-width"
              defaultValue="100%"
              className="col-span-2"
            />
            <Label htmlFor="story-popover-height" label="Height" />
            <InputText
              id="story-popover-height"
              defaultValue="25px"
              className="col-span-2"
            />
          </div>
        </PopoverContent>
      </Popover>
    )
  },
} satisfies Meta<PopoverStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sides: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {sides.map((side) => (
        <Popover key={side}>
          <PopoverTrigger render={<Button variant="secondary" />}>
            {side}
          </PopoverTrigger>
          <PopoverContent side={side} className="w-auto">
            Opens on the {side}.
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
}
