import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs, useEffect, useRef } from "storybook/preview-api"
import { CommandIcon } from "@hugeicons/core-free-icons"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import type { ListItemTrend } from "@/components/ui/list-item"
import { argGates } from "../arg-gates"
import { findHugeicon } from "../hugeicons"

const variants = ["divider", "container"] as const
const ribbons = ["accent", "info", "success", "warning", "danger"] as const
const tagColors = [
  "neutral",
  "accent",
  "info",
  "success",
  "warning",
  "danger",
] as const
const iconColors = ["accent", "info", "success", "warning", "danger"] as const
const trends = ["none", "positive", "negative"] as const

const trendOf = (trend: (typeof trends)[number]) =>
  trend === "none" ? undefined : (trend satisfies ListItemTrend)

const summaryOf = (options: readonly string[]) =>
  options.map((o) => `"${o}"`).join(" | ")

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
const itemNumbers = items.map((_, index) => index + 1)

// Accordion props: shared by every item.
type AccordionArgs = {
  variant: (typeof variants)[number]
  allowMultiple: boolean
  contentCustom: boolean
  showRibbon: boolean
  showDescription: boolean
  showDetails: boolean
  showTag: boolean
  showDragHandle: boolean
  showCheckbox: boolean
  showIcon: boolean
}

// Accordion Item props: one set per item (item1Disabled, item2Expanded…),
// edited through the `item` picker.
type ItemFields = {
  disabled: boolean
  expanded: boolean
  ribbonColor: (typeof ribbons)[number]
  label: string
  description: string
  details: string
  detailsTrend: (typeof trends)[number]
  tagLabel: string
  tagColor: (typeof tagColors)[number]
  icon: string
  iconColor: (typeof iconColors)[number]
}
type ItemField = keyof ItemFields

type AccordionStoryArgs = AccordionArgs & {
  selectedItem: number
} & Record<string, unknown>

const itemKey = (item: number, field: ItemField) =>
  `item${item}${field[0].toUpperCase()}${field.slice(1)}`

const itemFieldsOf = (args: AccordionStoryArgs, item: number) =>
  Object.fromEntries(
    itemControls.map(({ field }) => [field, args[itemKey(item, field)]])
  ) as ItemFields

// When each Accordion Item control takes effect, besides being the picked item.
const showsParts = (a: AccordionStoryArgs) => !a.contentCustom
const itemControls: {
  field: ItemField
  description: string
  summary: string
  control: unknown
  options?: readonly string[]
  when?: (args: AccordionStoryArgs) => boolean
}[] = [
  {
    field: "disabled",
    description: "Figma State=Disabled: `disabled` on AccordionItem.",
    control: "boolean",
    summary: "boolean",
  },
  {
    field: "expanded",
    description:
      "Figma Expanded: the item's `value` in the Accordion `value` (or `defaultValue`).",
    control: "boolean",
    summary: "boolean",
  },
  {
    field: "ribbonColor",
    description: "Color of the Ribbon: `ribbon` on AccordionItem.",
    control: "select",
    options: ribbons,
    summary: summaryOf(ribbons),
    when: (a) => a.variant === "container" && a.showRibbon,
  },
  {
    field: "label",
    description:
      "Label/Medium in Text/Primary: `children` of AccordionTrigger.",
    control: "text",
    summary: "ReactNode",
    when: showsParts,
  },
  {
    field: "description",
    description: "`description` on AccordionTrigger.",
    control: "text",
    summary: "ReactNode",
    when: (a) => showsParts(a) && a.showDescription,
  },
  {
    field: "details",
    description: "`details`: Body/Small in Text/Secondary.",
    control: "text",
    summary: "ReactNode",
    when: (a) => showsParts(a) && a.showDetails,
  },
  {
    field: "detailsTrend",
    description: "Figma Show Icon Trend: `detailsTrend`.",
    control: "inline-radio",
    options: trends,
    summary: '"positive" | "negative"',
    when: (a) => showsParts(a) && a.showDetails,
  },
  {
    field: "tagLabel",
    description: "Text of the Tag: `tag` on AccordionTrigger.",
    control: "text",
    summary: "ReactNode",
    when: (a) => showsParts(a) && a.showTag,
  },
  {
    field: "tagColor",
    description: "Color of the Tag (Strong): `tagColor`.",
    control: "select",
    options: tagColors,
    summary: summaryOf(tagColors),
    when: (a) => showsParts(a) && a.showTag,
  },
  {
    field: "icon",
    description:
      "`icon`: any Hugeicons name (e.g. Command, User, Settings 01).",
    control: "text",
    summary: "IconSvgElement",
    when: (a) => showsParts(a) && a.showIcon,
  },
  {
    field: "iconColor",
    description: "`iconColor`: Color of the Icon Colors container.",
    control: "select",
    options: iconColors,
    summary: summaryOf(iconColors),
    when: (a) => showsParts(a) && a.showIcon,
  },
]

// Ends in "Gate", not "Color": the preview's color matcher would catch it.
const gateKey = (item: number, field: ItemField) =>
  `${itemKey(item, field)}Gate`

// A gate per item control with a `when`: picked item AND its condition.
const gates = argGates<AccordionStoryArgs>(
  Object.fromEntries(
    itemNumbers.flatMap((item) =>
      itemControls
        .filter((control) => control.when)
        .map(({ field, when }) => [
          gateKey(item, field),
          (a: AccordionStoryArgs) => a.selectedItem === item && when!(a),
        ])
    )
  )
)

const itemArgs = Object.fromEntries(
  items.flatMap((item, index) =>
    Object.entries({
      disabled: false,
      expanded: index === 0,
      ribbonColor: "accent",
      label: item.title,
      description: item.description,
      details: "Details",
      detailsTrend: "positive",
      tagLabel: "Label",
      tagColor: "accent",
      icon: "Command",
      iconColor: "accent",
    } satisfies ItemFields).map(([field, value]) => [
      itemKey(index + 1, field as ItemField),
      value,
    ])
  )
)

const itemArgTypes = Object.fromEntries(
  itemNumbers.flatMap((item) =>
    itemControls.map(({ field, summary, when, ...argType }) => [
      itemKey(item, field),
      {
        ...argType,
        name: field,
        if: when
          ? { arg: gateKey(item, field) }
          : { arg: "selectedItem", eq: item },
        table: { category: "Accordion Item", type: { summary } },
      },
    ])
  )
)

// Figma Content Custom: a slot in place of the .List Item Content Left parts.
// Any node passed in `contentCustom` on AccordionTrigger.
function ContentCustomSlot() {
  return (
    <span className="flex min-h-10 flex-1 items-center justify-center rounded-sm border border-dashed border-border-primary text-body-small text-text-secondary">
      Slot
    </span>
  )
}

// The Content Left parts only take effect without Content Custom.
const contentPart = (description: string, summary: string) => ({
  description,
  control: "boolean" as const,
  if: { arg: "contentCustom", truthy: false },
  table: { category: "Accordion", type: { summary } },
})

const defaultArgs: AccordionStoryArgs = {
  variant: "divider",
  allowMultiple: true,
  contentCustom: false,
  showRibbon: true,
  showDescription: true,
  showDetails: false,
  showTag: false,
  showDragHandle: false,
  showCheckbox: false,
  showIcon: false,
  selectedItem: 1,
  ...itemArgs,
}

// Story args with their gates filled in from the defaults.
const storyArgs = (args: Partial<AccordionStoryArgs>) =>
  gates.withGates(args, defaultArgs)

// No `component`: the table lists only the argTypes below, in their order.
const meta = {
  title: "Components/Accordion",
  tags: ["autodocs"],
  parameters: {
    // Fills the canvas: the Accordion takes the full width of its parent.
    layout: "padded",
    docs: {
      description: {
        component:
          "Serve para organizar conteúdos em seções expansíveis, exibindo ou ocultando informações sob demanda para reduzir a complexidade visual.",
      },
    },
  },
  decorators: [gates.decorator],
  args: storyArgs(defaultArgs),
  argTypes: {
    ...gates.argTypes,
    variant: {
      name: "style",
      description: "Figma Style: `variant` on Accordion.",
      control: "inline-radio",
      options: variants,
      table: {
        category: "Accordion",
        type: { summary: summaryOf(variants) },
        defaultValue: { summary: '"divider"' },
      },
    },
    allowMultiple: {
      description:
        "`allowMultiple`: several items can be open at once. Off: opening an item closes the others.",
      control: "boolean",
      table: {
        category: "Accordion",
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    contentCustom: {
      description:
        "Figma Content Custom: a slot in place of the Content Left parts. Pass any node in `contentCustom` on AccordionTrigger.",
      control: "boolean",
      table: { category: "Accordion", type: { summary: "ReactNode" } },
    },
    showRibbon: {
      description:
        "Figma Show Ribbon (Container): `showRibbon` on AccordionItem.",
      control: "boolean",
      if: { arg: "variant", eq: "container" },
      table: {
        category: "Accordion",
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    showDescription: contentPart(
      "Figma Show Description: pass `description`.",
      "ReactNode"
    ),
    showDetails: contentPart("Figma Show Details: pass `details`.", "boolean"),
    showTag: contentPart(
      "Figma Show Tag: pass `tag` (Small, Strong).",
      "ReactNode"
    ),
    showDragHandle: contentPart(
      "Figma Show Drag Handle: `dragHandle`.",
      "boolean"
    ),
    showCheckbox: contentPart(
      "Figma Show Checkbox: pass a `<Checkbox />` in `checkbox`.",
      "ReactNode"
    ),
    showIcon: contentPart(
      "Figma Show Icon: pass a Hugeicons icon in `icon`.",
      "IconSvgElement"
    ),
    selectedItem: {
      name: "item",
      description: "The item that the controls below edit.",
      control: {
        type: "select",
        labels: Object.fromEntries(
          itemNumbers.map((item) => [item, `Item ${item}`])
        ),
      },
      options: itemNumbers,
      table: {
        category: "Accordion Item",
        type: { summary: itemNumbers.join(" | ") },
      },
    },
    ...itemArgTypes,
  },
  // Expanded is controlled by the args, and opening or closing an item in the
  // canvas writes it back. Storybook hooks only run in the render function.
  // `args` leaves out the hidden controls, `allArgs` has every item.
  render: function Render(_args, { allArgs }) {
    const [, updateArgs] = useArgs<AccordionStoryArgs>()
    const args = allArgs as AccordionStoryArgs
    const fields = itemNumbers.map((item) => itemFieldsOf(args, item))
    const parts = !args.contentCustom
    const expanded = items
      .filter((_, index) => fields[index].expanded)
      .map((item) => item.value)

    const setExpanded = (value: string[]) =>
      updateArgs(
        Object.fromEntries(
          items.map((item, index) => [
            itemKey(index + 1, "expanded"),
            value.includes(item.value),
          ])
        )
      )

    // Without allowMultiple, the Expanded controls follow the Accordion: the
    // item just expanded stays open (or the first one, when allowMultiple is
    // turned off with several open).
    const previous = useRef(expanded)
    const expandedKey = expanded.join()
    useEffect(() => {
      const before = previous.current
      previous.current = expanded
      if (args.allowMultiple || expanded.length <= 1) return
      const opened = expanded.filter((value) => !before.includes(value))
      setExpanded([opened.at(-1) ?? expanded[0]])
      // `expanded` is a new array each render; `expandedKey` is its value.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expandedKey, args.allowMultiple])

    return (
      <Accordion
        variant={args.variant}
        allowMultiple={args.allowMultiple}
        value={expanded}
        onValueChange={setExpanded}
      >
        {items.map((item, index) => {
          const f = fields[index]
          return (
            <AccordionItem
              key={item.value}
              value={item.value}
              disabled={f.disabled}
              showRibbon={args.showRibbon}
              ribbon={f.ribbonColor}
            >
              <AccordionTrigger
                contentCustom={
                  args.contentCustom ? <ContentCustomSlot /> : undefined
                }
                description={
                  parts && args.showDescription ? f.description : undefined
                }
                details={parts && args.showDetails ? f.details : undefined}
                detailsTrend={trendOf(f.detailsTrend)}
                tag={parts && args.showTag ? f.tagLabel : undefined}
                tagColor={f.tagColor}
                dragHandle={parts && args.showDragHandle}
                checkbox={
                  parts &&
                  args.showCheckbox && (
                    <Checkbox
                      aria-label={f.label}
                      onClick={(event) => event.stopPropagation()}
                    />
                  )
                }
                icon={
                  parts && args.showIcon
                    ? (findHugeicon(f.icon) ?? CommandIcon)
                    : undefined
                }
                iconColor={f.iconColor}
              >
                {f.label}
              </AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    )
  },
} satisfies Meta<AccordionStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Divider: Story = {}

export const Container: Story = {
  args: storyArgs({ variant: "container" }),
}

export const RibbonColors: Story = {
  args: storyArgs({
    variant: "container",
    ...Object.fromEntries(
      ribbons
        .slice(1, 4)
        .map((ribbon, index) => [itemKey(index + 1, "ribbonColor"), ribbon])
    ),
  }),
}

// Every .List Item Content Left part at once.
export const ContentLeftParts: Story = {
  args: storyArgs({
    showDragHandle: true,
    showCheckbox: true,
    showIcon: true,
    showDetails: true,
    showTag: true,
  }),
}

export const WithoutDescription: Story = {
  args: storyArgs({ showDescription: false }),
}

export const DisabledItem: Story = {
  args: storyArgs({ selectedItem: 2, [itemKey(2, "disabled")]: true }),
}

// Only one item open at a time: opening an item closes the others.
export const SingleOpen: Story = {
  args: storyArgs({ allowMultiple: false }),
}
