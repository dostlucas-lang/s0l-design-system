import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { CommandIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { HugeiconsIcon } from "@/components/ui/icon"
import { ListItem, type ListItemTrend } from "@/components/ui/list-item"
import { cn } from "@/lib/utils"
import { findHugeicon } from "../hugeicons"

const types = ["discreet", "divider", "container"] as const
const ribbons = ["accent", "info", "success", "warning", "danger"] as const
const trends = ["none", "positive", "negative"] as const
const iconColors = ["accent", "info", "success", "warning", "danger"] as const
const buttonCounts = [1, 2, 3] as const

// Story-only args: the Figma List Item, Content Left and Content Right
// properties as flat controls.
type ListItemStoryArgs = {
  clickable: boolean
  type: (typeof types)[number]
  disabled: boolean
  showRibbon: boolean
  ribbon: (typeof ribbons)[number]
  label: string
  showDescription: boolean
  description: string
  showDetails: boolean
  details: string
  detailsTrend: (typeof trends)[number]
  showTag: boolean
  tag: string
  showDragHandle: boolean
  showCheckbox: boolean
  showIcon: boolean
  icon: string
  iconColor: (typeof iconColors)[number]
  showTextRight: boolean
  textRight: string
  textRightTrend: (typeof trends)[number]
  showTagRight: boolean
  tagRight: string
  showIconArrow: boolean
  showButtons: boolean
  buttons: (typeof buttonCounts)[number]
  onClick: () => void
  onAction: () => void
}

const trendOf = (trend: (typeof trends)[number]) =>
  trend === "none" ? undefined : (trend satisfies ListItemTrend)

// Figma Buttons slot: 1 to 3 Button Ghost with the Command icon.
function DemoActions({
  count = 3,
  onAction,
}: {
  count?: number
  onAction?: () => void
}) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
        <Button
          key={n}
          variant="ghost"
          iconOnly
          aria-label={`Action ${n}`}
          onClick={(event) => {
            event.stopPropagation()
            onAction?.()
          }}
        >
          <HugeiconsIcon icon={CommandIcon} />
        </Button>
      ))}
    </>
  )
}

function StoryListItem(args: ListItemStoryArgs) {
  return (
    <ListItem
      type={args.type}
      clickable={args.clickable}
      disabled={args.disabled}
      showRibbon={args.showRibbon}
      ribbon={args.ribbon}
      onClick={args.onClick}
      label={args.label}
      description={args.showDescription ? args.description : undefined}
      details={args.showDetails ? args.details : undefined}
      detailsTrend={trendOf(args.detailsTrend)}
      tag={args.showTag ? args.tag : undefined}
      dragHandle={args.showDragHandle}
      checkbox={
        args.showCheckbox && (
          <Checkbox
            aria-label={args.label}
            onClick={(event) => event.stopPropagation()}
          />
        )
      }
      icon={
        args.showIcon ? (findHugeicon(args.icon) ?? CommandIcon) : undefined
      }
      iconColor={args.iconColor}
      textRight={args.showTextRight ? args.textRight : undefined}
      textRightTrend={trendOf(args.textRightTrend)}
      tagRight={args.showTagRight ? args.tagRight : undefined}
      arrow={args.showIconArrow}
      actions={
        args.showButtons && (
          <DemoActions count={args.buttons} onAction={args.onAction} />
        )
      }
    />
  )
}

// No `component`: the table lists only the argTypes below, in their order.
const meta = {
  title: "Components/List Item",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A row of a list: label and description with optional drag handle, checkbox, icon, details and tag on the left, and text, tag, arrow or buttons on the right. Mirrors the Figma List Item: Type (Discreet / Divider / Container) × State (Default / Pressed / Disabled), with the .List Item Content Left and Content Right partials as props. With `clickable` (the default when `onClick` is set) the whole item is clickable and shows Pressed on hover and press; with `clickable={false}` it has no hover and only the nested Buttons and Checkboxes respond. Stop propagation in nested buttons and checkboxes so they don't also trigger a clickable item.",
      },
    },
  },
  args: {
    clickable: true,
    type: "discreet",
    disabled: false,
    showRibbon: true,
    ribbon: "accent",
    label: "Label",
    showDescription: true,
    description: "Description",
    showDetails: false,
    details: "Details",
    detailsTrend: "positive",
    showTag: false,
    tag: "Label",
    showDragHandle: false,
    showCheckbox: false,
    showIcon: true,
    icon: "Command",
    iconColor: "accent",
    showTextRight: false,
    textRight: "Text right",
    textRightTrend: "positive",
    showTagRight: false,
    tagRight: "Label",
    showIconArrow: false,
    showButtons: true,
    buttons: 3,
    onClick: fn(),
    onAction: fn(),
  },
  argTypes: {
    clickable: {
      description:
        "`clickable`: the whole item is clickable, with Pressed on hover and press. Off: no hover, only the nested Buttons and Checkboxes respond.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true when onClick is set" },
      },
    },
    type: {
      description: "Figma Type.",
      control: "inline-radio",
      options: types,
      table: {
        type: { summary: types.map((t) => `"${t}"`).join(" | ") },
        defaultValue: { summary: '"discreet"' },
      },
    },
    disabled: {
      description: "Figma State=Disabled.",
      control: "boolean",
      table: { type: { summary: "boolean" } },
    },
    showRibbon: {
      description: "Figma Show Ribbon (Container).",
      control: "boolean",
      if: { arg: "type", eq: "container" },
      table: { type: { summary: "boolean" } },
    },
    ribbon: {
      description: "Color of the Ribbon.",
      control: "select",
      options: ribbons,
      if: { arg: "type", eq: "container" },
      table: { type: { summary: ribbons.map((r) => `"${r}"`).join(" | ") } },
    },
    label: {
      description: "`label`: Label/Medium in Text/Primary.",
      control: "text",
      table: { category: "Content Left", type: { summary: "ReactNode" } },
    },
    showDescription: {
      description: "Figma Show Description: pass `description`.",
      control: "boolean",
      table: { category: "Content Left", type: { summary: "boolean" } },
    },
    description: {
      description: "`description`: Body/Medium in Text/Secondary.",
      control: "text",
      if: { arg: "showDescription" },
      table: { category: "Content Left", type: { summary: "ReactNode" } },
    },
    showDetails: {
      description: "Figma Show Details: pass `details`.",
      control: "boolean",
      table: { category: "Content Left", type: { summary: "boolean" } },
    },
    details: {
      description: "`details`: Body/Small in Text/Secondary.",
      control: "text",
      if: { arg: "showDetails" },
      table: { category: "Content Left", type: { summary: "ReactNode" } },
    },
    detailsTrend: {
      description: "Figma Show Icon Trend: `detailsTrend`.",
      control: "inline-radio",
      options: trends,
      if: { arg: "showDetails" },
      table: {
        category: "Content Left",
        type: { summary: '"positive" | "negative"' },
      },
    },
    showTag: {
      description: "Figma Show Tag: pass `tag` (Small Accent Strong).",
      control: "boolean",
      table: { category: "Content Left", type: { summary: "boolean" } },
    },
    tag: {
      control: "text",
      if: { arg: "showTag" },
      table: { category: "Content Left", type: { summary: "ReactNode" } },
    },
    showDragHandle: {
      description: "Figma Show Drag Handle: `dragHandle`.",
      control: "boolean",
      table: { category: "Content Left", type: { summary: "boolean" } },
    },
    showCheckbox: {
      description: "Figma Show Checkbox: pass a `<Checkbox />` in `checkbox`.",
      control: "boolean",
      table: { category: "Content Left", type: { summary: "ReactNode" } },
    },
    showIcon: {
      description: "Figma Show Icon: pass a Hugeicons icon in `icon`.",
      control: "boolean",
      table: { category: "Content Left", type: { summary: "boolean" } },
    },
    icon: {
      description: "Any Hugeicons name (e.g. Command, User, Settings 01).",
      control: "text",
      if: { arg: "showIcon" },
      table: { category: "Content Left", type: { summary: "IconSvgElement" } },
    },
    iconColor: {
      description: "`iconColor`: Color of the Icon Colors container.",
      control: "select",
      options: iconColors,
      if: { arg: "showIcon" },
      table: {
        category: "Content Left",
        type: { summary: iconColors.map((c) => `"${c}"`).join(" | ") },
        defaultValue: { summary: '"accent"' },
      },
    },
    showTextRight: {
      description: "Figma Show Text Right: pass `textRight`.",
      control: "boolean",
      table: { category: "Content Right", type: { summary: "boolean" } },
    },
    textRight: {
      description: "`textRight`: Body/Medium in Text/Secondary.",
      control: "text",
      if: { arg: "showTextRight" },
      table: { category: "Content Right", type: { summary: "ReactNode" } },
    },
    textRightTrend: {
      description: "Figma Show Trend Icon: `textRightTrend`.",
      control: "inline-radio",
      options: trends,
      if: { arg: "showTextRight" },
      table: {
        category: "Content Right",
        type: { summary: '"positive" | "negative"' },
      },
    },
    showTagRight: {
      description: "Figma Show Tag: pass `tagRight` (Small Accent Strong).",
      control: "boolean",
      table: { category: "Content Right", type: { summary: "boolean" } },
    },
    tagRight: {
      control: "text",
      if: { arg: "showTagRight" },
      table: { category: "Content Right", type: { summary: "ReactNode" } },
    },
    showIconArrow: {
      description: "Figma Show Icon Arrow: `arrow`.",
      control: "boolean",
      table: { category: "Content Right", type: { summary: "boolean" } },
    },
    showButtons: {
      description:
        "Figma Show Buttons: 1 to 3 icon-only Ghost Buttons in `actions`, 12px apart.",
      control: "boolean",
      table: { category: "Content Right", type: { summary: "ReactNode" } },
    },
    buttons: {
      description: "How many Buttons the `actions` slot holds.",
      control: "inline-radio",
      options: buttonCounts,
      if: { arg: "showButtons" },
      table: { category: "Content Right", type: { summary: "1 | 2 | 3" } },
    },
    onClick: { table: { disable: true } },
    onAction: { table: { disable: true } },
  },
  // The width comes from the `width` parameter (360px by default). The
  // centered layout shrinks to fit, so it's capped by the viewport minus its
  // 1rem padding, not by max-w-full.
  decorators: [
    (Story, { parameters }) => (
      <div
        className={cn(parameters.width ?? "w-90", "max-w-[calc(100vw-2rem)]")}
      >
        <Story />
      </div>
    ),
  ],
  render: (args) => <StoryListItem {...args} />,
} satisfies Meta<ListItemStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Discreet: Story = { args: { type: "discreet" } }

export const Divider: Story = { args: { type: "divider" } }

export const Container: Story = { args: { type: "container" } }

// The item does nothing and has no hover; the Buttons still respond.
export const NotClickable: Story = {
  args: { type: "container", clickable: false },
}

// Every .List Item Content Left part at once.
export const ContentLeft: Story = {
  args: {
    type: "divider",
    showDragHandle: true,
    showCheckbox: true,
    showDetails: true,
    showTag: true,
    showButtons: false,
    showIconArrow: true,
  },
}

// The .List Item Content Right combinations from Figma.
export const ContentRight: Story = {
  parameters: { controls: { disable: true }, width: "w-140" },
  render: ({ onClick, onAction }) => {
    const base = {
      type: "divider" as const,
      label: "Label",
      description: "Description",
      icon: CommandIcon,
      onClick,
    }
    return (
      <div className="flex flex-col">
        <ListItem {...base} arrow />
        <ListItem
          {...base}
          textRight="Text right"
          textRightTrend="positive"
          arrow
        />
        <ListItem {...base} tagRight="Label" arrow />
        <ListItem {...base} tagRight="Label" />
        <ListItem {...base} actions={<DemoActions onAction={onAction} />} />
        <ListItem
          {...base}
          textRight="Text right"
          textRightTrend="negative"
          actions={<DemoActions onAction={onAction} />}
        />
        <ListItem {...base} textRight="Text right" textRightTrend="positive" />
      </div>
    )
  },
}
