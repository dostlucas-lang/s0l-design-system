import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs } from "storybook/preview-api"
import { fn } from "storybook/test"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

// Story-only args matching the Figma Drawer parts: side, header close button
// and the .Actions Footer (1–3 actions, Destructive = None / Primary / Ghost).
type DrawerStoryArgs = React.ComponentProps<typeof Drawer> & {
  side: "top" | "right" | "bottom" | "left"
  title: string
  showCloseButton: boolean
  actions: 0 | 1 | 2 | 3
  destructive: "none" | "primary" | "ghost"
  paragraphs: number
}

const meta = {
  title: "Components/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A panel that slides in from an edge of the screen over the page.",
      },
    },
  },
  args: {
    open: false,
    side: "right",
    title: "Title",
    showCloseButton: true,
    actions: 2,
    destructive: "none",
    paragraphs: 3,
    onOpenChange: fn(),
  },
  argTypes: {
    side: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
    },
    actions: { control: "inline-radio", options: [0, 1, 2, 3] },
    destructive: {
      control: "inline-radio",
      options: ["none", "primary", "ghost"],
    },
    paragraphs: { control: { type: "range", min: 1, max: 20 } },
  },
  // Keeps the open control in sync with the trigger, Escape and close button.
  render: function Render({
    side,
    title,
    showCloseButton,
    actions,
    destructive,
    paragraphs,
    ...args
  }) {
    const [, updateArgs] = useArgs()

    return (
      <Drawer
        {...args}
        onOpenChange={(open, details) => {
          updateArgs({ open })
          args.onOpenChange?.(open, details)
        }}
      >
        <DrawerTrigger render={<Button variant="secondary" />}>
          Open drawer
        </DrawerTrigger>
        <DrawerContent side={side}>
          <DrawerHeader showCloseButton={showCloseButton}>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            {Array.from({ length: paragraphs }, (_, index) => (
              <p key={index} className="text-text-secondary">
                Paragraph {index + 1}. Long content scrolls inside the body
                while the header and footer stay in place.
              </p>
            ))}
          </DrawerBody>
          {actions > 0 && (
            <DrawerFooter>
              {actions >= 3 && (
                <Button
                  variant="ghost"
                  danger={destructive === "ghost"}
                  className="mr-auto"
                >
                  Action 3
                </Button>
              )}
              {actions >= 2 && <Button variant="secondary">Action 2</Button>}
              <Button danger={destructive === "primary"}>Action 1</Button>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    )
  },
} satisfies Meta<DrawerStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ThreeActions: Story = {
  args: { actions: 3, paragraphs: 12 },
}

export const DestructivePrimary: Story = {
  args: { destructive: "primary" },
}

export const WithoutFooter: Story = {
  args: { actions: 0 },
}

export const Bottom: Story = {
  args: { side: "bottom" },
}
