import type { Meta, StoryObj } from "@storybook/react-vite"
import { CommandIcon } from "@hugeicons/core-free-icons"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import type { ListItemTrend } from "@/components/ui/list-item"
import { findHugeicon } from "../hugeicons"

const ribbons = ["accent", "info", "success", "warning", "danger"] as const
const iconColors = ["accent", "info", "success", "warning", "danger"] as const
const trends = ["none", "positive", "negative"] as const

const trendOf = (trend: (typeof trends)[number]) =>
  trend === "none" ? undefined : (trend satisfies ListItemTrend)

const items = [
  {
    value: "shipping",
    title: "Shipping options",
    description: "Delivery times and costs",
    content: "We ship worldwide with standard and express delivery.",
  },
  {
    value: "returns",
    title: "Return policy",
    description: "How to send an item back",
    content: "Items can be returned within 30 days of purchase.",
  },
  {
    value: "support",
    title: "Contact support",
    description: "Talk to our team",
    content: "Reach out through the help center or by email.",
  },
]

// Story-only args for the item parts (ribbon and the .List Item Content Left
// properties as flat controls), which live on AccordionItem / AccordionTrigger
// rather than the root.
type AccordionStoryArgs = React.ComponentProps<typeof Accordion> & {
  showRibbon: boolean
  ribbon: (typeof ribbons)[number]
  showDescription: boolean
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
}

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Stacked headings that reveal a section of content. Mirrors the Figma Accordion: Style (Divider / Container) and Ribbon color. The header is the .List Item Content Left, with the same props as List Item (`description`, `details`, `tag`, `dragHandle`, `checkbox`, `icon`, `iconColor`, `contentLeft`) on AccordionTrigger and `children` as the label. Stop propagation in a nested checkbox so it doesn't toggle the item.",
      },
    },
  },
  args: {
    variant: "divider",
    disabled: false,
    showRibbon: true,
    ribbon: "accent",
    showDescription: true,
    showDetails: false,
    details: "Details",
    detailsTrend: "positive",
    showTag: false,
    tag: "Label",
    showDragHandle: false,
    showCheckbox: false,
    showIcon: false,
    icon: "Command",
    iconColor: "accent",
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["divider", "container"] },
    showRibbon: {
      description:
        "Figma Show Ribbon (Container): `showRibbon` on AccordionItem.",
      control: "boolean",
      if: { arg: "variant", eq: "container" },
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    ribbon: {
      description: "Color of the Ribbon: `ribbon` on AccordionItem.",
      control: "inline-radio",
      options: ribbons,
      if: { arg: "variant", eq: "container" },
      table: { type: { summary: ribbons.map((r) => `"${r}"`).join(" | ") } },
    },
    multiple: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    showDescription: {
      description: "Figma Show Description: pass `description`.",
      control: "boolean",
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
  },
  render: ({
    showRibbon,
    ribbon,
    showDescription,
    showDetails,
    details,
    detailsTrend,
    showTag,
    tag,
    showDragHandle,
    showCheckbox,
    showIcon,
    icon,
    iconColor,
    ...args
  }) => (
    <Accordion {...args} defaultValue={["shipping"]} className="w-md">
      {items.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          showRibbon={showRibbon}
          ribbon={ribbon}
        >
          <AccordionTrigger
            description={showDescription ? item.description : undefined}
            details={showDetails ? details : undefined}
            detailsTrend={trendOf(detailsTrend)}
            tag={showTag ? tag : undefined}
            dragHandle={showDragHandle}
            checkbox={
              showCheckbox && (
                <Checkbox
                  aria-label={item.title}
                  onClick={(event) => event.stopPropagation()}
                />
              )
            }
            icon={showIcon ? (findHugeicon(icon) ?? CommandIcon) : undefined}
            iconColor={iconColor}
          >
            {item.title}
          </AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
} satisfies Meta<AccordionStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Divider: Story = {}

export const Container: Story = {
  args: { variant: "container" },
}

export const RibbonColors: Story = {
  args: { variant: "container" },
  render: (args) => (
    <Accordion variant={args.variant} className="w-md">
      {ribbons.map((ribbon) => (
        <AccordionItem key={ribbon} value={ribbon} ribbon={ribbon}>
          <AccordionTrigger description={`ribbon="${ribbon}"`}>
            {ribbon[0].toUpperCase() + ribbon.slice(1)}
          </AccordionTrigger>
          <AccordionContent>
            The ribbon only shows in the container style.
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
}

// Every .List Item Content Left part at once.
export const ContentLeft: Story = {
  args: {
    showDragHandle: true,
    showCheckbox: true,
    showIcon: true,
    showDetails: true,
    showTag: true,
  },
}

export const WithoutDescription: Story = {
  args: { showDescription: false },
}
