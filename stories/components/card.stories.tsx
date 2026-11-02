import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"
import { CommandIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Card, CardMoreActions } from "@/components/ui/card"
import { HugeiconsIcon } from "@/components/ui/icon"
import type { ListItemTrend } from "@/components/ui/list-item"
import { findHugeicon } from "../hugeicons"

const footerTypes = [
  "button-primary",
  "button-secondary",
  "buttons",
  "button-ghost",
] as const
const iconColors = ["accent", "info", "success", "warning", "danger"] as const
const trends = ["none", "positive", "negative"] as const

type FooterType = (typeof footerTypes)[number]

// Story-only args: the Figma Card, .Card Body and .Card Footer properties as
// flat controls.
type CardStoryArgs = {
  clickable: boolean
  disabled: boolean
  label: string
  showDescription: boolean
  description: string
  showDetails: boolean
  details: string
  detailsTrend: (typeof trends)[number]
  showTag: boolean
  tag: string
  showIcon: boolean
  icon: string
  iconColor: (typeof iconColors)[number]
  showMoreActions: boolean
  showFooter: boolean
  footerType: FooterType
  onClick: () => void
  onAction: () => void
}

const trendOf = (trend: (typeof trends)[number]) =>
  trend === "none" ? undefined : (trend satisfies ListItemTrend)

// Figma .Card Footer types, with Medium Buttons that don't trigger the card.
function DemoFooter({
  type,
  onAction,
}: {
  type: FooterType
  onAction?: () => void
}) {
  const onClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    onAction?.()
  }
  switch (type) {
    case "button-primary":
      return <Button onClick={onClick}>Label</Button>
    case "button-secondary":
      return (
        <Button variant="secondary" onClick={onClick}>
          Label
        </Button>
      )
    case "buttons":
      return (
        <>
          <Button variant="secondary" onClick={onClick}>
            Label
          </Button>
          <Button onClick={onClick}>Label</Button>
        </>
      )
    case "button-ghost":
      return (
        <Button variant="ghost" onClick={onClick}>
          <HugeiconsIcon icon={CommandIcon} data-icon="inline-start" />
          Label
        </Button>
      )
  }
}

function StoryCard(args: CardStoryArgs) {
  return (
    <Card
      clickable={args.clickable}
      disabled={args.disabled}
      onClick={args.onClick}
      label={args.label}
      description={args.showDescription ? args.description : undefined}
      details={args.showDetails ? args.details : undefined}
      detailsTrend={trendOf(args.detailsTrend)}
      tag={args.showTag ? args.tag : undefined}
      icon={
        args.showIcon ? (findHugeicon(args.icon) ?? CommandIcon) : undefined
      }
      iconColor={args.iconColor}
      moreActions={
        args.showMoreActions && <CardMoreActions onClick={args.onAction} />
      }
      footer={
        args.showFooter && (
          <DemoFooter type={args.footerType} onAction={args.onAction} />
        )
      }
      footerType={args.footerType === "button-ghost" ? "ghost" : "default"}
    />
  )
}

// No `component`: the table lists only the argTypes below, in their order.
const meta = {
  title: "Components/Card",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A surface that groups a title, description and actions about one subject. Mirrors the Figma Card: State (Default / Pressed / Disabled) + Focus, with the .Card Body and .Card Footer partials as props. With `clickable` (the default when `onClick` is set) the whole surface is clickable and shows Pressed on hover and press; with `clickable={false}` it has no hover and only the nested Buttons respond. Stop propagation in nested buttons so they don't also trigger a clickable card (`CardMoreActions` already does).",
      },
    },
  },
  args: {
    clickable: true,
    disabled: false,
    label: "Title",
    showDescription: true,
    description: "Description",
    showDetails: false,
    details: "Details",
    detailsTrend: "positive",
    showTag: false,
    tag: "Label",
    showIcon: false,
    icon: "Command",
    iconColor: "accent",
    showMoreActions: true,
    showFooter: true,
    footerType: "button-secondary",
    onClick: fn(),
    onAction: fn(),
  },
  argTypes: {
    clickable: {
      description:
        "`clickable`: the whole surface is clickable, with Pressed on hover and press. Off: no hover, only the nested Buttons respond.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true when onClick is set" },
      },
    },
    disabled: {
      description: "Figma State=Disabled.",
      control: "boolean",
      table: { type: { summary: "boolean" } },
    },
    label: {
      description: "`label`: the title, Label/Medium in Text/Primary.",
      control: "text",
      table: { category: "Body", type: { summary: "ReactNode" } },
    },
    showDescription: {
      description: "Figma Show Description: pass `description`.",
      control: "boolean",
      table: { category: "Body", type: { summary: "boolean" } },
    },
    description: {
      description: "`description`: Body/Medium in Text/Secondary.",
      control: "text",
      if: { arg: "showDescription" },
      table: { category: "Body", type: { summary: "ReactNode" } },
    },
    showDetails: {
      description: "Figma Show Details: pass `details`.",
      control: "boolean",
      table: { category: "Body", type: { summary: "boolean" } },
    },
    details: {
      description: "`details`: Body/Small in Text/Secondary.",
      control: "text",
      if: { arg: "showDetails" },
      table: { category: "Body", type: { summary: "ReactNode" } },
    },
    detailsTrend: {
      description: "Figma Show Icon Trend: `detailsTrend`.",
      control: "inline-radio",
      options: trends,
      if: { arg: "showDetails" },
      table: {
        category: "Body",
        type: { summary: '"positive" | "negative"' },
      },
    },
    showTag: {
      description: "Figma Show Tag: pass `tag` (Small Accent Strong).",
      control: "boolean",
      table: { category: "Body", type: { summary: "boolean" } },
    },
    tag: {
      control: "text",
      if: { arg: "showTag" },
      table: { category: "Body", type: { summary: "ReactNode" } },
    },
    showIcon: {
      description: "Figma Show Icon: pass a Hugeicons icon in `icon`.",
      control: "boolean",
      table: { category: "Body", type: { summary: "boolean" } },
    },
    icon: {
      description: "Any Hugeicons name (e.g. Command, User, Settings 01).",
      control: "text",
      if: { arg: "showIcon" },
      table: { category: "Body", type: { summary: "IconSvgElement" } },
    },
    iconColor: {
      description: "`iconColor`: Color of the Icon Colors container.",
      control: "select",
      options: iconColors,
      if: { arg: "showIcon" },
      table: {
        category: "Body",
        type: { summary: iconColors.map((c) => `"${c}"`).join(" | ") },
        defaultValue: { summary: '"accent"' },
      },
    },
    showMoreActions: {
      description:
        "Figma Show More Actions: pass a `<CardMoreActions />` in `moreActions`.",
      control: "boolean",
      table: { category: "Body", type: { summary: "ReactNode" } },
    },
    showFooter: {
      description: "Figma Show Footer: pass the Buttons in `footer`.",
      control: "boolean",
      table: { category: "Footer", type: { summary: "ReactNode" } },
    },
    footerType: {
      description:
        'Figma Footer Type. Button Ghost also needs `footerType="ghost"`.',
      control: "select",
      options: footerTypes,
      if: { arg: "showFooter" },
      table: {
        category: "Footer",
        type: { summary: '"default" | "ghost"' },
        defaultValue: { summary: '"default"' },
      },
    },
    onClick: { table: { disable: true } },
    onAction: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="w-60 max-w-[calc(100vw-2rem)]">
        <Story />
      </div>
    ),
  ],
  render: (args) => <StoryCard {...args} />,
} satisfies Meta<CardStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

// The surface does nothing and has no hover; the Buttons still respond.
export const NotClickable: Story = { args: { clickable: false } }

export const Disabled: Story = { args: { disabled: true } }

// Every .Card Body part at once.
export const Body: Story = {
  args: {
    showIcon: true,
    showDetails: true,
    showTag: true,
  },
}

export const FooterButtonPrimary: Story = {
  args: { footerType: "button-primary" },
}

export const FooterButtons: Story = {
  args: { footerType: "buttons" },
}

export const FooterButtonGhost: Story = {
  args: { footerType: "button-ghost" },
}

export const WithoutFooter: Story = {
  args: { showFooter: false },
}

// Figma Body Type=Custom: `children` replace the built-in body content.
export const CustomBody: Story = {
  parameters: { controls: { disable: true } },
  render: ({ onClick, onAction }) => (
    <Card
      onClick={onClick}
      footer={
        <Button
          variant="secondary"
          onClick={(event) => {
            event.stopPropagation()
            onAction()
          }}
        >
          Ver extrato
        </Button>
      }
    >
      <div className="flex flex-col">
        <span className="text-body-small text-text-secondary">
          Saldo disponível
        </span>
        <span className="text-label-medium text-text-primary">
          R$ 12.480,00
        </span>
      </div>
    </Card>
  ),
}
