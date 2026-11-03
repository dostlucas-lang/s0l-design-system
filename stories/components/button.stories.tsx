import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { CommandIcon } from "@hugeicons/core-free-icons"
import { useArgs } from "storybook/preview-api"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@/components/ui/icon"
import { findHugeicon } from "../hugeicons"

const levels = ["primary", "secondary", "ghost"] as const

// Story-only args named after the Figma properties:
// - Level picks Button Primary / Secondary / Ghost (the `variant` prop).
// - Inverse picks the version for a dark surface. Secondary and Ghost have one
//   (the `secondary-inverse` and `inverse` variants) and Primary doesn't, so
//   the control hides on Primary.
// - Label is the text; Icon Left / Icon Right take any Hugeicons name (like
//   "search", "Arrow Right 01" or "Delete02Icon"), empty for none.
// - Icon Only shows just Icon Left (Command when none is picked) and uses the
//   label as its accessible name.
type ButtonStoryArgs = {
  label: string
  level: (typeof levels)[number]
  inverse: boolean
  iconLeft: string
  iconRight: string
  size: "sm" | "md" | "lg"
  iconOnly: boolean
  danger: boolean
  loading: boolean
  disabled: boolean
}

// The Inverse buttons sit on Background/Inverse/Default, as in Figma, filling the
// whole story area: the canvas of a single story (`fill="canvas"`) or the
// story block on the Docs page (`fill="block"`). The block can't be reached
// with positioning (its zoom wrapper is transformed), so there a solid
// box-shadow paints the color out to the block's edges, where its overflow
// clips it without scrollbars. Without `fill` a dark box wraps the buttons.
function Surface({
  inverse,
  fill,
  children,
}: {
  inverse: boolean
  fill?: "canvas" | "block"
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-4",
        inverse && !fill && "rounded-md bg-background-inverse-default p-6",
        inverse &&
          fill === "block" &&
          "bg-background-inverse-default shadow-[0_0_0_100vmax_var(--color-background-inverse-default)]"
      )}
    >
      {inverse && fill === "canvas" && (
        <div
          aria-hidden
          data-slot="inverse-surface"
          className="fixed inset-0 -z-10 bg-background-inverse-default"
        />
      )}
      {children}
    </div>
  )
}

const inverseVariants: Record<string, "secondary-inverse" | "inverse"> = {
  secondary: "secondary-inverse",
  ghost: "inverse",
}

function StoryButton({
  label,
  level,
  inverse,
  iconLeft,
  iconRight,
  ...props
}: ButtonStoryArgs) {
  const left = findHugeicon(iconLeft)
  const right = findHugeicon(iconRight)

  return (
    <Button
      variant={
        inverseVariants[inverse && level !== "primary" ? level : ""] ?? level
      }
      aria-label={props.iconOnly ? label : undefined}
      {...props}
    >
      {props.iconOnly ? (
        <HugeiconsIcon icon={left ?? CommandIcon} />
      ) : (
        <>
          {left && <HugeiconsIcon icon={left} data-icon="inline-start" />}
          {label}
          {right && <HugeiconsIcon icon={right} data-icon="inline-end" />}
        </>
      )}
    </Button>
  )
}

const meta = {
  title: "Components/Button",
  component: StoryButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Triggers an action or event. Mirrors the Figma Button Primary / Secondary / Ghost components. In code, Level is the `variant` prop, Inverse is `secondary-inverse` for Secondary and `inverse` for Ghost, the label is the children and the icons are Hugeicons icons with `data-icon="inline-start"` or `"inline-end"`.',
      },
    },
  },
  args: {
    label: "Label",
    level: "primary",
    inverse: false,
    iconLeft: "",
    iconRight: "",
    size: "md",
    iconOnly: false,
    danger: false,
    loading: false,
    disabled: false,
  },
  argTypes: {
    label: { control: "text" },
    level: { control: "inline-radio", options: levels },
    inverse: { control: "boolean", if: { arg: "level", neq: "primary" } },
    iconLeft: { control: "text" },
    iconRight: {
      control: "text",
      if: { arg: "iconOnly", truthy: false },
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  render: function Render(args, context) {
    const [, updateArgs] = useArgs()
    const { inverse, level } = context.allArgs

    // The control is hidden on Primary: it can't stay on for the next Level.
    React.useEffect(() => {
      if (inverse && level === "primary") updateArgs({ inverse: false })
    }, [inverse, level, updateArgs])

    return (
      <Surface
        inverse={args.inverse}
        fill={context.viewMode === "story" ? "canvas" : "block"}
      >
        <StoryButton {...args} />
      </Surface>
    )
  },
} satisfies Meta<typeof StoryButton>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

// Every Level side by side; Inverse has its own story.
const allLevels: Story["render"] = (args) => (
  <Surface inverse={false}>
    {levels.map((level) => (
      <StoryButton key={level} {...args} level={level} inverse={false} />
    ))}
  </Surface>
)

export const Levels: Story = {
  render: allLevels,
}

export const Sizes: Story = {
  render: (args) => (
    <Surface inverse={args.inverse}>
      <StoryButton {...args} size="sm" />
      <StoryButton {...args} size="md" />
      <StoryButton {...args} size="lg" />
    </Surface>
  ),
}

export const WithIcons: Story = {
  args: { iconLeft: "Command", iconRight: "Command" },
  render: allLevels,
}

export const IconOnly: Story = {
  args: { iconLeft: "Plus Sign", iconOnly: true },
  render: allLevels,
}

export const Danger: Story = {
  args: { danger: true },
  render: allLevels,
}

export const Loading: Story = {
  args: { loading: true },
  render: allLevels,
}

export const Disabled: Story = {
  args: { disabled: true },
  render: allLevels,
}

// The whole story area takes Background/Inverse/Default (Storybook backgrounds),
// so the buttons sit on it directly instead of in a dark box.
const inverseStory: Story = {
  parameters: {
    backgrounds: {
      options: {
        inverse: {
          name: "Inverse",
          value: "var(--s0l-background-inverse-default)",
        },
      },
    },
  },
  globals: { backgrounds: { value: "inverse" } },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <StoryButton {...args} level="secondary" />
      <StoryButton {...args} level="ghost" />
    </div>
  ),
}

export const Inverse: Story = {
  ...inverseStory,
  args: { inverse: true, level: "ghost" },
}

export const InverseDisabled: Story = {
  ...inverseStory,
  args: { inverse: true, level: "ghost", disabled: true },
}
