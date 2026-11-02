import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@/components/ui/icon"
import { Link } from "@/components/ui/link"
import { findHugeicon } from "../hugeicons"

const colors = ["neutral", "accent", "danger", "inverse"] as const

// Story-only args: the icons are Hugeicons names ("Arrow Left 02"…), empty
// for none, and `label` is the link text.
type LinkStoryArgs = Omit<
  React.ComponentProps<typeof Link>,
  "iconLeft" | "iconRight"
> & {
  label: string
  iconLeft: string
  iconRight: string
}

function LinkStory({ label, iconLeft, iconRight, ...args }: LinkStoryArgs) {
  const left = findHugeicon(iconLeft)
  const right = findHugeicon(iconRight)

  return (
    <Link
      {...args}
      iconLeft={left && <HugeiconsIcon icon={left} />}
      iconRight={right && <HugeiconsIcon icon={right} />}
    >
      {label}
    </Link>
  )
}

// The whole story box: Background/Inverse/Default behind Inverse, as in
// Figma. The stories use the fullscreen layout, so it fills the canvas (or
// the story box on the Docs page) edge to edge.
function Surface({
  inverse,
  fill,
  className,
  children,
}: {
  inverse: boolean
  /** Canvas: take the whole viewport height. */
  fill: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-1 items-center justify-center gap-6 p-6",
        fill ? "min-h-dvh" : "min-h-32",
        inverse && "bg-background-inverse-default",
        className
      )}
    >
      {children}
    </div>
  )
}

// Fills the canvas; on the Docs page each story keeps a short box.
const fillCanvas = (viewMode: string) => viewMode === "story"

const meta = {
  title: "Components/Link",
  component: LinkStory,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A text link to another page or section. Mirrors the Figma Link component: Color (Neutral / Accent, named Brand in Figma / Danger / Inverse) × Size (Small / Medium) × State (Default / Hover / Disabled), with Icon Left and Icon Right. Hover underlines the label and follows the browser; Disabled comes from props.",
      },
    },
  },
  args: {
    label: "Label",
    href: "#",
    color: "neutral",
    size: "md",
    disabled: false,
    iconLeft: "Arrow Left 02",
    iconRight: "Arrow Right 02",
  },
  argTypes: {
    color: { control: "inline-radio", options: colors },
    size: { control: "inline-radio", options: ["sm", "md"] },
    iconLeft: { control: "text" },
    iconRight: { control: "text" },
    render: { table: { disable: true } },
  },
  render: (args, { viewMode }) => (
    <Surface inverse={args.color === "inverse"} fill={fillCanvas(viewMode)}>
      <LinkStory {...args} />
    </Surface>
  ),
} satisfies Meta<typeof LinkStory>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

// Size: Small and Medium.
export const Size: Story = {
  argTypes: { size: { table: { disable: true } } },
  render: (args, { viewMode }) => (
    <Surface inverse={args.color === "inverse"} fill={fillCanvas(viewMode)}>
      <LinkStory {...args} size="sm" />
      <LinkStory {...args} size="md" />
    </Surface>
  ),
}

// Every Color: the top half light, the bottom half Background/Inverse/Default
// edge to edge for Inverse.
export const Colors: Story = {
  argTypes: { color: { table: { disable: true } } },
  render: (args, { viewMode }) => (
    <div
      className={cn(
        "flex w-full flex-col",
        fillCanvas(viewMode) ? "min-h-dvh" : "min-h-64"
      )}
    >
      <Surface inverse={false} fill={false}>
        {colors
          .filter((color) => color !== "inverse")
          .map((color) => (
            <LinkStory key={color} {...args} color={color} label={color} />
          ))}
      </Surface>
      <Surface inverse fill={false}>
        <LinkStory {...args} color="inverse" label="inverse" />
      </Surface>
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const WithoutIcons: Story = {
  args: { iconLeft: "", iconRight: "" },
}
