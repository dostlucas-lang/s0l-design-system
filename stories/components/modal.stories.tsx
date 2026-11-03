import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import { InputText } from "@/components/ui/input-text"
import { Label } from "@/components/ui/label"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal"

// Story-only args matching the Figma Modal properties: Content (Text /
// Custom), Show Scroll Bar, Show Footer and the .Actions Footer (1–3 actions,
// Destructive = None / Primary / Ghost).
type ModalStoryArgs = React.ComponentProps<typeof Modal> & {
  content: "text" | "custom"
  title: string
  description: string
  showCloseButton: boolean
  showScrollBar: boolean
  showFooter: boolean
  actions: 1 | 2 | 3
  destructive: "none" | "primary" | "ghost"
}

// Show Scroll Bar repeats the content until the Body overflows and scrolls.
const SCROLL_REPEAT = 8

const meta = {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: { component: "A window overlaid on the page." },
    },
  },
  args: {
    content: "text",
    title: "Title",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non dolor vitae velit fermentum faucibus. Nam quis erat consequat felis semper molestie.",
    showCloseButton: true,
    showScrollBar: false,
    showFooter: true,
    actions: 2,
    destructive: "none",
  },
  argTypes: {
    open: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    content: { control: "inline-radio", options: ["text", "custom"] },
    description: { if: { arg: "content", eq: "text" } },
    actions: {
      control: "inline-radio",
      options: [1, 2, 3],
      if: { arg: "showFooter" },
    },
    destructive: {
      control: "inline-radio",
      options: ["none", "primary", "ghost"],
      if: { arg: "showFooter" },
    },
  },
  render: function Render({
    content,
    title,
    description,
    showCloseButton,
    showScrollBar,
    showFooter,
    actions,
    destructive,
    ...args
  }) {
    const repeat = showScrollBar ? SCROLL_REPEAT : 1

    return (
      <Modal {...args}>
        <ModalTrigger render={<Button variant="secondary" />}>
          Open modal
        </ModalTrigger>
        <ModalContent>
          <ModalHeader showCloseButton={showCloseButton}>
            <ModalTitle>{title}</ModalTitle>
          </ModalHeader>
          <ModalBody>
            {content === "text" ? (
              <ModalDescription render={<div />}>
                {Array.from({ length: repeat }, (_, index) => (
                  <p key={index} className="not-first:mt-4">
                    {description}
                  </p>
                ))}
              </ModalDescription>
            ) : (
              <div className="flex flex-col gap-4">
                {Array.from({ length: repeat * 2 }, (_, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <Label
                      htmlFor={`story-modal-field-${index}`}
                      label={`Field ${index + 1}`}
                    />
                    <InputText id={`story-modal-field-${index}`} />
                  </div>
                ))}
              </div>
            )}
          </ModalBody>
          {showFooter && (
            <ModalFooter>
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
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    )
  },
} satisfies Meta<ModalStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Custom: Story = {
  args: { content: "custom", title: "Edit profile" },
}

export const ScrollBar: Story = {
  args: { showScrollBar: true },
}

export const ThreeActions: Story = {
  args: { actions: 3 },
}

export const DestructivePrimary: Story = {
  args: { destructive: "primary" },
}

export const WithoutFooter: Story = {
  args: { showFooter: false },
}
