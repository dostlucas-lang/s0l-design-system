import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { cn } from "@/lib/utils"
import { Badge, BadgeObject } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const colors = [
  "neutral",
  "accent",
  "info",
  "success",
  "warning",
  "danger",
  "inverse",
  "on-color",
] as const

type Color = (typeof colors)[number]

// Inverse and On Color go on dark surfaces, as in Figma.
const darkColors: ReadonlyArray<string> = ["inverse", "on-color"]

// Info / Success / Warning / Danger are dots only, so Show Label is ignored.
const dotOnlyColors = ["info", "success", "warning", "danger"] as const
const isDotOnly = (color: Color): color is (typeof dotOnlyColors)[number] =>
  (dotOnlyColors as readonly string[]).includes(color)

// Story-only args for the Figma Show Label and the label text.
type BadgeStoryArgs = Omit<
  React.ComponentProps<"span">,
  "color" | "children"
> & {
  color: Color
  showLabel: boolean
  label: string
}

function BadgeStory({ color, showLabel, label, ...args }: BadgeStoryArgs) {
  if (isDotOnly(color)) return <Badge {...args} color={color} />

  return (
    <Badge {...args} color={color}>
      {showLabel ? label : undefined}
    </Badge>
  )
}

// The whole story box, Background/Inverse/Default behind the dark colors.
function Surface({
  dark,
  fill,
  children,
}: {
  dark: boolean
  /** Canvas: take the whole viewport height. */
  fill: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-1 items-center justify-center gap-6 p-6",
        fill ? "min-h-dvh" : "min-h-24",
        dark && "bg-background-inverse-default"
      )}
    >
      {children}
    </div>
  )
}

const fillCanvas = (viewMode: string) => viewMode === "story"

const meta = {
  title: "Components/Badge",
  component: BadgeStory,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A small count or status dot, often on the corner of another element. Mirrors the Figma Badge component: Show Label × Color (Neutral / Accent, named Brand in Figma / Info / Success / Warning / Danger / Inverse / On Color), and Badge Object for the corner placement.",
      },
    },
  },
  args: {
    color: "accent",
    showLabel: true,
    label: "1",
  },
  argTypes: {
    color: { control: "select", options: colors },
    label: { if: { arg: "showLabel" } },
  },
  render: (args, { viewMode }) => (
    <Surface
      dark={darkColors.includes(args.color ?? "")}
      fill={fillCanvas(viewMode)}
    >
      <BadgeStory {...args} />
    </Surface>
  ),
} satisfies Meta<typeof BadgeStory>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

// Every Color with and without the label; the dark colors on their surface.
export const Colors: Story = {
  argTypes: { color: { table: { disable: true } } },
  render: (args, { viewMode }) => (
    <div
      className={cn(
        "flex w-full flex-col",
        fillCanvas(viewMode) ? "min-h-dvh" : "min-h-48"
      )}
    >
      {[false, true].map((dark) => (
        <Surface key={String(dark)} dark={dark} fill={false}>
          {colors
            .filter((color) => darkColors.includes(color) === dark)
            .map((color) => (
              <div key={color} className="flex items-center gap-3">
                <BadgeStory {...args} color={color} showLabel={false} />
                {!isDotOnly(color) && (
                  <BadgeStory {...args} color={color} showLabel />
                )}
              </div>
            ))}
        </Surface>
      ))}
    </div>
  ),
}

// Show Label=False.
export const Dot: Story = {
  args: { showLabel: false },
}

// Figma Badge Object: the Badge on the top-right corner of any element.
export const Object: Story = {
  render: (args, { viewMode }) => (
    <Surface
      dark={darkColors.includes(args.color ?? "")}
      fill={fillCanvas(viewMode)}
    >
      <BadgeObject badge={<BadgeStory {...args} />}>
        <Button variant="secondary">Notifications</Button>
      </BadgeObject>
    </Surface>
  ),
}
