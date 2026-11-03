import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Calendar03Icon } from "@hugeicons/core-free-icons"
import { fn } from "storybook/test"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Chip, ChipGroup, ChipMenu } from "@/components/ui/chip"
import { HugeiconsIcon } from "@/components/ui/icon"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { findHugeicon } from "../hugeicons"

// Story-only args: `icon` is a Hugeicons name ("Command", "Filter"…), empty
// for no icon (Figma Show Icon).
type ChipStoryArgs = Omit<React.ComponentProps<typeof Chip>, "icon"> & {
  label: string
  icon: string
}

// The chip as the args describe it, without state of its own.
function ChipView({ label, icon, ...args }: ChipStoryArgs) {
  const found = findHugeicon(icon)

  return (
    <Chip {...args} icon={found && <HugeiconsIcon icon={found} />}>
      {label}
    </Chip>
  )
}

// An interactive chip: a click toggles Active, and with Menu it opens the
// Dropdown and shows the picked options. Starts from the `active` / `values`
// args and follows them when the controls change.
function StoryChip({
  active = false,
  values = [],
  onClick,
  ...args
}: ChipStoryArgs) {
  const [pressed, setPressed] = React.useState(active)
  // Follows the `active` control (state adjusted while rendering).
  const [lastActive, setLastActive] = React.useState(active)
  if (active !== lastActive) {
    setLastActive(active)
    setPressed(active)
  }

  if (args.menu) {
    const { label, icon, size, disabled, maxLength } = args
    const found = findHugeicon(icon)

    return (
      <ChipMenu
        // Remounts with the new selection when the `values` control changes.
        key={values.join()}
        options={menuOptions}
        defaultValue={menuOptions
          .filter((option) => values.includes(option.label))
          .map((option) => option.value)}
        size={size}
        disabled={disabled}
        maxLength={maxLength}
        icon={found && <HugeiconsIcon icon={found} />}
      >
        {label}
      </ChipMenu>
    )
  }

  return (
    <ChipView
      {...args}
      active={pressed}
      onClick={(event) => {
        setPressed((value) => !value)
        onClick?.(event)
      }}
    />
  )
}

const menuOptions = [
  { value: "aberto", label: "Aberto" },
  { value: "em-andamento", label: "Em andamento" },
  { value: "aguardando", label: "Aguardando aprovação" },
  { value: "concluido", label: "Concluído" },
  { value: "cancelado", label: "Cancelado" },
  { value: "arquivado", label: "Arquivado" },
]

// No `component`: the table lists only the argTypes below, in their order
// (size, active, disabled, menu, label, values, maxLength, icon), instead of
// every Base UI Button prop in the order of the types.
const meta = {
  title: "Components/Chip",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A compact toggle for filters and quick choices. Mirrors the Figma Chip: Size (Small / Medium) × State (Default / Hover / Disabled) × Active × Menu, with Show Icon. Chip Group lays chips out with a label and help text.",
      },
    },
  },
  args: {
    size: "md",
    active: false,
    disabled: false,
    menu: false,
    label: "Label",
    values: [],
    maxLength: 40,
    icon: "",
    onClick: fn(),
  },
  argTypes: {
    size: {
      description: "Figma Size: Small (24px) or Medium (32px).",
      control: "inline-radio",
      options: ["sm", "md"],
      table: {
        type: { summary: '"sm" | "md"' },
        defaultValue: { summary: '"md"' },
      },
    },
    active: {
      description:
        "Figma Active: the selected chip, with the Accent fill. A Menu chip is Active while it has `values`, unless this is set.",
      control: "boolean",
      table: { type: { summary: "boolean" } },
    },
    disabled: {
      description: "Figma State=Disabled.",
      control: "boolean",
      table: { type: { summary: "boolean" } },
    },
    menu: {
      description:
        "Figma Menu: shows the Chevron Down and opens the Dropdown (ChipMenu), or any panel the chip is the trigger of.",
      control: "boolean",
      table: { type: { summary: "boolean" } },
    },
    label: {
      description: "The chip text (`children`), shown while nothing is picked.",
      control: "text",
      table: { type: { summary: "ReactNode" } },
    },
    values: {
      description:
        'Menu: the picked options\' labels. They replace the label, joined by ", " up to `maxLength` characters, then "+X".',
      control: "object",
      if: { arg: "menu" },
      table: { type: { summary: "string[]" } },
    },
    maxLength: {
      description: 'Characters of `values` shown before "+X".',
      control: "number",
      if: { arg: "menu" },
      table: { type: { summary: "number" }, defaultValue: { summary: "40" } },
    },
    icon: {
      description:
        "Figma Show Icon: the 16px leading icon. Here a Hugeicons name, empty for no icon.",
      control: "text",
      table: { type: { summary: "ReactNode" } },
    },
    onClick: { table: { disable: true } },
  },
  render: (args) => <StoryChip {...args} />,
} satisfies Meta<ChipStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

// Click toggles Active, like a filter. With Menu, the chip opens the
// Dropdown and shows the picked options (Active while it has any).
export const Playground: Story = {
  argTypes: {
    active: { if: { arg: "menu", truthy: false } },
  },
}

// Size: Small (24px) and Medium (32px).
export const Size: Story = {
  argTypes: { size: { table: { disable: true } } },
  render: (args) => (
    <div className="flex items-center gap-4">
      <StoryChip {...args} size="sm" />
      <StoryChip {...args} size="md" />
    </div>
  ),
}

// Menu=True: opens the Dropdown (Selection Multiple). The picked options
// show on the chip, joined by ", " up to 40 characters, then "+X".
export const Menu: Story = {
  argTypes: {
    active: { table: { disable: true } },
    menu: { table: { disable: true } },
  },
  render: ({ label, icon, size, disabled }) => {
    const found = findHugeicon(icon)

    return (
      <ChipMenu
        options={menuOptions}
        size={size}
        disabled={disabled}
        icon={found && <HugeiconsIcon icon={found} />}
      >
        {label}
      </ChipMenu>
    )
  },
}

// The Dropdown can be swapped for any panel: render the Menu chip as the
// panel's trigger and pass what was picked as `values`. Here, the Date
// Picker panel (Popover + Calendar).
export const MenuDatePicker: Story = {
  ...Menu,
  render: function Render({ size }) {
    const [date, setDate] = React.useState<Date>()
    const [open, setOpen] = React.useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Chip
              size={size}
              menu
              values={date ? [date.toLocaleDateString("pt-BR")] : []}
              icon={<HugeiconsIcon icon={Calendar03Icon} />}
            />
          }
        >
          Data
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto gap-0 p-0">
          <Calendar
            selected={date}
            onSelect={(next) => {
              setDate(next)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    )
  },
}

// Figma Show Icon: the 16px leading icon.
export const WithIcon: Story = {
  args: { icon: "Command" },
}

export const Disabled: Story = {
  args: { disabled: true },
}

// Figma Chip Group: Medium chips without icons, the first one Active, and a
// Ghost "Limpar" that clears the selection.
export const Group: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const chips = ["Chip 1", "Chip 2", "Chip 3", "Chip 4", "Chip 5", "Chip 6"]
    const [selected, setSelected] = React.useState<string[]>(["Chip 1"])

    return (
      <ChipGroup label="Label" helpText="Text Help" className="w-[394px]">
        {chips.map((chip) => (
          <Chip
            key={chip}
            active={selected.includes(chip)}
            onClick={() =>
              setSelected((current) =>
                current.includes(chip)
                  ? current.filter((value) => value !== chip)
                  : [...current, chip]
              )
            }
          >
            {chip}
          </Chip>
        ))}
        <Button variant="ghost" size="sm" onClick={() => setSelected([])}>
          Limpar
        </Button>
      </ChipGroup>
    )
  },
}
