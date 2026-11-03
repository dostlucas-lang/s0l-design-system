import type { Meta, StoryObj } from "@storybook/react-vite"

import { DatePicker } from "@/components/ui/date-picker"
import { inputLabelArgTypes, labelArgs } from "./label.args"

const meta = {
  title: "Components/Date Picker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A date field with a calendar. Mirrors the Figma Input Date and Input Date Range components: State (Default / Hover / Active / Disabled / Read Only) × Filled × Error. Type picks a Day (DD/MM/AAAA), Month (MM/AAAA) or Year (AAAA), typed or picked in the Date Picker panel (Calendar in a Popover). Range=True shows Data inicial and Data final with a two-month panel. Show Footer adds Cancelar / Aplicar; without it, picking applies right away.",
      },
    },
  },
  args: {
    ...labelArgs,
    type: "day",
    range: false,
    mobile: false,
    label: "Data",
    icon: false,
    showFooter: true,
    disabled: false,
    readOnly: false,
    clearable: true,
  },
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["day", "month", "year"],
      if: { arg: "range", truthy: false },
    },
    range: { control: "boolean" },
    mobile: { control: "boolean" },
    resetLabel: { control: "text", if: { arg: "mobile" } },
    icon: { control: "boolean" },
    ...inputLabelArgTypes,
    helpText: { control: "text" },
    error: { control: "text" },
    calendarProps: { control: false },
    className: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
    onClear: { table: { disable: true } },
  },
} satisfies Meta<typeof DatePicker>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Month: Story = {
  args: { type: "month", label: "Mês" },
}

export const Year: Story = {
  args: { type: "year", label: "Ano" },
}

export const WithIcon: Story = {
  args: { icon: true },
}

export const WithoutFooter: Story = {
  args: { showFooter: false },
}

export const WithError: Story = {
  args: { error: "Text Error" },
}

// Figma Input Date Range.
export const Range: Story = {
  args: {
    range: true,
    label: "Data inicial",
  },
}

// Figma Date Picker on Bottom Sheet.
export const Mobile: Story = {
  args: { mobile: true },
  globals: { viewport: { value: "mobile1", isRotated: false } },
}
