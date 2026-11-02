import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import type { DateRange } from "react-day-picker"

import {
  Calendar,
  CalendarButton,
  type CalendarView,
} from "@/components/ui/calendar"

// Story-only args: the selection type changes with `range`, so the story
// keeps one state per variant.
type CalendarStoryArgs = {
  range: boolean
  type: CalendarView
  showOutsideDays: boolean
}

function CalendarStory({ range, type, ...args }: CalendarStoryArgs) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [period, setPeriod] = React.useState<DateRange | undefined>(() => {
    const from = new Date()
    const to = new Date()
    to.setDate(from.getDate() + 28)
    return { from, to }
  })

  if (range) {
    return <Calendar {...args} range selected={period} onSelect={setPeriod} />
  }

  return (
    <Calendar
      {...args}
      // Remounts when the type control changes, to open on that grid.
      key={type}
      type={type}
      selected={date}
      onSelect={setDate}
      onPeriodSelect={setDate}
    />
  )
}

const meta = {
  title: "Components/Calendar",
  component: CalendarStory,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lets users pick a day, a month, a year or a range of days. Mirrors the Figma Date Picker panel: Property 1 = Day / Month / Year, plus Range. It isn't a floating element, so it has no border or shadow; the Date Picker adds them around it.",
      },
    },
  },
  args: {
    range: false,
    type: "day",
    showOutsideDays: true,
  },
  argTypes: {
    range: { control: "boolean" },
    type: {
      control: "inline-radio",
      options: ["day", "month", "year"],
      if: { arg: "range", truthy: false },
    },
  },
} satisfies Meta<typeof CalendarStory>

export default meta

type Story = StoryObj<typeof meta>

export const Day: Story = {}

export const Month: Story = {
  args: { type: "month" },
}

export const Year: Story = {
  args: { type: "year" },
}

export const Range: Story = {
  args: { range: true },
}

// Figma Date Time Picker Button: one cell of the grids, with its own State
// (Default / Active / Disabled) and Today.
export const Button: StoryObj<typeof CalendarButton> = {
  render: (args) => <CalendarButton className="w-10" {...args} />,
  args: {
    children: "16",
    active: false,
    disabled: false,
    today: true,
  },
  argTypes: {
    children: { control: "text" },
  },
}
