import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs } from "storybook/preview-api"
import { fn } from "storybook/test"
import {
  Home01Icon,
  Notification01Icon,
  Search01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"

import { BottomBar, BottomBarItem } from "@/components/ui/bottom-bar"
import { findHugeicon } from "../hugeicons"

const itemCounts = [2, 3, 4] as const

// `iconName` is what the icon control shows for each one.
const destinations = [
  { label: "Início", icon: Home01Icon, iconName: "Home 01" },
  { label: "Buscar", icon: Search01Icon, iconName: "Search 01" },
  { label: "Avisos", icon: Notification01Icon, iconName: "Notification 01" },
  { label: "Perfil", icon: UserIcon, iconName: "User" },
] as const

type Destination = (typeof destinations)[number]["label"]

// Story-only args: the Figma Bottom Bar properties, plus the .Bottom Bar
// Button ones (Label, Icon, Disabled, Show Badge) for the item picked in
// `item`.
type BottomBarStoryArgs = {
  items: (typeof itemCounts)[number]
  activeItem: number
  item: Destination
  label: string
  icon: string
  disabled: boolean
  showBadge: boolean
  badge: string
  onClick: () => void
}

function StoryBottomBar({
  onSelect,
  ...args
}: BottomBarStoryArgs & { onSelect: (index: number) => void }) {
  const items = destinations.slice(0, args.items)
  return (
    <BottomBar>
      {items.map((item, index) => {
        const edited = item.label === args.item
        return (
          <BottomBarItem
            key={item.label}
            icon={edited ? (findHugeicon(args.icon) ?? item.icon) : item.icon}
            label={edited ? args.label : item.label}
            active={index === args.activeItem}
            disabled={edited && args.disabled}
            badge={edited && args.showBadge ? args.badge : undefined}
            onClick={() => {
              onSelect(index)
              args.onClick()
            }}
          />
        )
      })}
    </BottomBar>
  )
}

// No `component`: the table lists only the argTypes below, in their order.
const meta = {
  title: "Components/Bottom Bar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The main navigation of a mobile screen: 2 to 4 destinations in a floating pill. Mirrors the Figma Bottom Bar (Items=2 / 3 / 4) and its .Bottom Bar Button (State: Default / Pressed / Active / Disabled + Focus, Show Badge). `BottomBar` only draws the bar; pin it to the bottom of the screen where it's used. Each `BottomBarItem` is a `<button>`, or a link through `render`.",
      },
    },
  },
  args: {
    items: 4,
    activeItem: 0,
    item: "Avisos",
    label: "Avisos",
    icon: "Notification 01",
    disabled: false,
    showBadge: false,
    badge: "3",
    onClick: fn(),
  },
  argTypes: {
    items: {
      description: "Figma Items: how many `BottomBarItem` the bar holds.",
      control: "inline-radio",
      options: itemCounts,
      table: { category: "Bottom Bar", type: { summary: "2 | 3 | 4" } },
    },
    activeItem: {
      description:
        "Figma State=Active: `active` on the current item (0 is the first).",
      control: { type: "number", min: 0, max: 3 },
      table: { category: "Bottom Bar", type: { summary: "boolean" } },
    },
    item: {
      description: "The `BottomBarItem` the controls below apply to.",
      control: "select",
      options: destinations.map((d) => d.label),
      table: { category: "Item", type: { summary: "story only" } },
    },
    label: {
      description: "Figma Label: `label`, cut with an ellipsis past one line.",
      control: "text",
      table: { category: "Item", type: { summary: "ReactNode" } },
    },
    icon: {
      description: "Figma Icon: any Hugeicons name (e.g. Home 01, Wallet 01).",
      control: "text",
      table: { category: "Item", type: { summary: "IconSvgElement" } },
    },
    disabled: {
      description: "Figma State=Disabled: `disabled`.",
      control: "boolean",
      table: { category: "Item", type: { summary: "boolean" } },
    },
    showBadge: {
      description: "Figma Show Badge: pass the count in `badge`.",
      control: "boolean",
      table: { category: "Item", type: { summary: "ReactNode" } },
    },
    badge: {
      control: "text",
      if: { arg: "showBadge" },
      table: { category: "Item", type: { summary: "ReactNode" } },
    },
    onClick: { table: { disable: true } },
  },
  // A click makes the item Active, like navigating to it. Storybook hooks
  // only run in the render function itself.
  render: function Render(args) {
    const [, updateArgs] = useArgs<BottomBarStoryArgs>()

    // Picking another item fills Label and Icon with its own, to edit from.
    const previousItem = React.useRef(args.item)
    React.useEffect(() => {
      if (previousItem.current === args.item) return
      previousItem.current = args.item
      const picked = destinations.find((d) => d.label === args.item)
      if (picked) updateArgs({ label: picked.label, icon: picked.iconName })
    }, [args.item, updateArgs])

    return (
      <StoryBottomBar
        {...args}
        onSelect={(index) => updateArgs({ activeItem: index })}
      />
    )
  },
} satisfies Meta<BottomBarStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithBadge: Story = { args: { showBadge: true } }

export const DisabledItem: Story = {
  args: { item: "Perfil", label: "Perfil", icon: "User", disabled: true },
}

// Each item can be a link (an <a> or a Next.js <Link>) through `render`.
export const AsLinks: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <BottomBar>
      {destinations.map((item, index) => (
        <BottomBarItem
          key={item.label}
          render={<a href={`#${item.label.toLowerCase()}`} />}
          icon={item.icon}
          label={item.label}
          active={index === 0}
        />
      ))}
    </BottomBar>
  ),
}
