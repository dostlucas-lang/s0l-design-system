import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const sizes = ["xs", "sm", "md", "lg", "xl"] as const

const colors = ["accent", "blue", "green", "yellow", "red"] as const

// Story-only args: Type is implicit in the component (an image renders Photo,
// initials render when there is no image), so the story picks the parts.
type AvatarStoryArgs = React.ComponentProps<typeof Avatar> & {
  type: "photo" | "initials"
  src: string
  initials: string
}

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "An image element with a fallback for representing the user. Mirrors the Figma Avatar: Size × Color, Type Photo or Initials.",
      },
    },
  },
  args: {
    type: "initials",
    size: "md",
    color: "accent",
    src: "https://github.com/shadcn.png",
    initials: "AA",
  },
  argTypes: {
    type: { control: "inline-radio", options: ["photo", "initials"] },
    size: { control: "inline-radio", options: sizes },
    color: { control: "inline-radio", options: colors },
    src: { if: { arg: "type", eq: "photo" } },
  },
  render: ({ type, src, initials, ...args }) => (
    <Avatar {...args}>
      {type === "photo" && <AvatarImage src={src} alt="Avatar" />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  ),
} satisfies Meta<AvatarStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Initials: Story = {}

export const Photo: Story = {
  args: { type: "photo" },
}

export const Sizes: Story = {
  render: ({ type, src, initials, ...args }) => (
    <div className="flex items-center gap-4">
      {sizes.map((size) => (
        <Avatar key={size} {...args} size={size}>
          {type === "photo" && <AvatarImage src={src} alt="Avatar" />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}

export const Colors: Story = {
  render: ({ initials, size }) => (
    <div className="flex items-center gap-4">
      {colors.map((color) => (
        <Avatar key={color} size={size} color={color}>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}

export const BrokenImage: Story = {
  args: { type: "photo", src: "/missing-avatar.png", initials: "SL" },
}
