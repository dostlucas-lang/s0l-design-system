import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { createToastManager, Toaster } from "@/components/ui/toast"

const colors = [
  "neutral",
  "accent",
  "info",
  "success",
  "warning",
  "danger",
] as const

const decorations = ["icon", "avatar", "image"] as const

const sampleImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 140"><rect width="80" height="140" fill="#f4a3a3"/><circle cx="40" cy="62" r="24" fill="#fff4ec"/></svg>'
  )

// Story-only args: toasts are created imperatively, so the controls set what
// the button sends to toast.add().
type ToastStoryArgs = {
  color: (typeof colors)[number]
  decoration: (typeof decorations)[number]
  title: string
  description: string
  action1: string
  action2: string
  dismissable: boolean
  timeout: number
}

// Each story gets its own manager and Toaster, so the docs page (which
// renders every story) doesn't show each toast once per story.
function ToastStory({
  color,
  decoration,
  title,
  description,
  action1,
  action2,
  dismissable,
  timeout,
}: ToastStoryArgs) {
  const [manager] = React.useState(() => createToastManager())

  function show() {
    const id = manager.add({
      type: color === "neutral" ? undefined : color,
      title: title || undefined,
      description: description || undefined,
      timeout,
      actionProps: action1
        ? { children: action1, onClick: () => manager.close(id) }
        : undefined,
      data: {
        dismissable,
        secondaryAction: action2
          ? { children: action2, onClick: () => manager.close(id) }
          : undefined,
        image: decoration === "image" ? sampleImage : undefined,
        avatar:
          decoration === "avatar" ? (
            <Avatar size="sm">
              <AvatarImage src="https://i.pravatar.cc/64?img=12" alt="" />
              <AvatarFallback>LD</AvatarFallback>
            </Avatar>
          ) : undefined,
      },
    })
  }

  return (
    <>
      <Toaster toastManager={manager} />
      <Button variant="secondary" onClick={show}>
        Show toast
      </Button>
    </>
  )
}

const meta = {
  title: "Components/Toast",
  component: ToastStory,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Serve para exibir mensagens rápidas e flutuantes em resposta a ações do usuário, com mínima interrupção da interface.",
      },
    },
  },
  args: {
    color: "neutral",
    decoration: "icon",
    title: "Title",
    description: "Lorem ipsum dolor sit amet, consectetur",
    action1: "Action 1",
    action2: "Action 2",
    dismissable: true,
    timeout: 5000,
  },
  argTypes: {
    color: { control: "select", options: colors },
    decoration: { control: "inline-radio", options: decorations },
    timeout: { control: { type: "number", min: 0, step: 1000 } },
  },
} satisfies Meta<typeof ToastStory>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Success: Story = {
  args: {
    color: "success",
    title: "Saved",
    description: "Your changes were saved.",
    action1: "",
    action2: "",
  },
}

export const Danger: Story = {
  args: {
    color: "danger",
    title: "Could not save",
    description: "Check your connection and try again.",
    action1: "Retry",
    action2: "",
  },
}

export const WithAvatar: Story = {
  args: { decoration: "avatar" },
}

export const WithImage: Story = {
  args: { decoration: "image" },
}

export const PromiseToast: Story = {
  render: function Render() {
    const [manager] = React.useState(() => createToastManager())

    return (
      <>
        <Toaster toastManager={manager} />
        <Button
          variant="secondary"
          onClick={() =>
            manager.promise(
              new Promise((resolve) => setTimeout(resolve, 2000)),
              {
                loading: { title: "Saving…", type: "loading" },
                success: { title: "Saved", type: "success" },
                error: { title: "Could not save", type: "danger" },
              }
            )
          }
        >
          Save changes
        </Button>
      </>
    )
  },
}
