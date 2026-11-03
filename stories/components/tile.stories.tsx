import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import {
  ArrowDataTransferHorizontalIcon,
  BarCode02Icon,
  CommandIcon,
  CreditCardIcon,
  Invoice01Icon,
  MoneyReceive02Icon,
  MoneySend02Icon,
  QrCodeIcon,
  SmartPhone01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons"

import { Tile, TileCarousel } from "@/components/ui/tile"
import { findHugeicon } from "../hugeicons"

const sizes = ["sm", "md", "lg"] as const

// Story-only args: the Figma Tile properties as flat controls.
type TileStoryArgs = {
  size: (typeof sizes)[number]
  label: string
  icon: string
  disabled: boolean
  onClick: () => void
}

const shortcuts = [
  { label: "Pix", icon: QrCodeIcon },
  { label: "Pagar", icon: BarCode02Icon },
  { label: "Transferir", icon: ArrowDataTransferHorizontalIcon },
  { label: "Depositar", icon: MoneyReceive02Icon },
  { label: "Sacar", icon: MoneySend02Icon },
  { label: "Cartões", icon: CreditCardIcon },
  { label: "Recarga", icon: SmartPhone01Icon },
  { label: "Boletos", icon: Invoice01Icon },
  { label: "Carteira", icon: Wallet01Icon },
]

// No `component`: the table lists only the argTypes below, in their order.
const meta = {
  title: "Components/Tile",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A shortcut to an action or a page: an icon and a label on a raised surface. Mirrors the Figma Tile: Size (Small / Medium / Large) × State (Default / Hover / Disabled) + Focus. Renders a `<button>`, or a link through `render`. `TileCarousel` is the Figma Tile Carousel: a row of Tiles between two arrows.",
      },
    },
  },
  args: {
    size: "sm",
    label: "Label",
    icon: "Command",
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    size: {
      description: "Figma Size: Small / Medium / Large.",
      control: "inline-radio",
      options: sizes,
      table: {
        type: { summary: '"sm" | "md" | "lg"' },
        defaultValue: { summary: '"sm"' },
      },
    },
    label: {
      description: "Figma Label: `label`.",
      control: "text",
      table: { type: { summary: "ReactNode" } },
    },
    icon: {
      description: "Figma Icon: any Hugeicons name (e.g. Command, Wallet 01).",
      control: "text",
      table: { type: { summary: "IconSvgElement" } },
    },
    disabled: {
      description: "Figma State=Disabled.",
      control: "boolean",
      table: { type: { summary: "boolean" } },
    },
    onClick: { table: { disable: true } },
  },
  render: (args) => (
    <Tile
      size={args.size}
      label={args.label}
      icon={findHugeicon(args.icon) ?? CommandIcon}
      disabled={args.disabled}
      onClick={args.onClick}
    />
  ),
} satisfies Meta<TileStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Small: Story = { args: { size: "sm" } }

export const Medium: Story = { args: { size: "md" } }

export const Large: Story = { args: { size: "lg" } }

export const Disabled: Story = { args: { disabled: true } }

// Figma Tile Carousel: Large Tiles, 24px apart, between two arrows.
export const Carousel: Story = {
  parameters: { controls: { include: ["size"] } },
  args: { size: "lg" },
  decorators: [
    (Story) => (
      <div className="w-180 max-w-[calc(100vw-2rem)]">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <TileCarousel>
      {shortcuts.map((shortcut) => (
        <Tile
          key={shortcut.label}
          size={args.size}
          label={shortcut.label}
          icon={shortcut.icon}
          onClick={args.onClick}
        />
      ))}
    </TileCarousel>
  ),
}
