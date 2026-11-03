import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/ui/progress-bar"

type ProgressBarStoryArgs = React.ComponentProps<typeof ProgressBar> & {
  value: number
}

// No `component`: the table lists only the argTypes below, in their order,
// instead of every Base UI Progress prop.
const meta = {
  title: "Components/Progress Bar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Shows how far a task has gone. Mirrors the Figma Progress Bar (Value 0–100, Color: Brand Gradient or Chart 1–9) and Progress Bar Label (Label Position: Top, Bottom or Side, with Show Label Left and Show Label Right).",
      },
    },
  },
  args: {
    value: 50,
    color: "brand-gradient",
    labelPosition: "top",
    showLabelLeft: true,
    labelLeft: "Progresso",
    showLabelRight: true,
    labelRight: "50%",
  },
  argTypes: {
    value: {
      description: "Figma Value: how much is done, from 0 to 100.",
      control: { type: "range", min: 0, max: 100, step: 1 },
      table: { type: { summary: "number" } },
    },
    color: {
      description:
        "Figma Color (.Progress Bar Fill): Brand Gradient or Chart/1 to Chart/9.",
      control: "select",
      options: ["brand-gradient", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      table: {
        type: { summary: '"brand-gradient" | "1" … "9"' },
        defaultValue: { summary: '"brand-gradient"' },
      },
    },
    labelPosition: {
      description: "Figma Label Position: above, below or beside the bar.",
      control: "inline-radio",
      options: ["top", "bottom", "side"],
      table: {
        type: { summary: '"top" | "bottom" | "side"' },
        defaultValue: { summary: '"top"' },
      },
    },
    showLabelLeft: {
      description: "Figma Show Label Left.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    labelLeft: {
      description: "Figma Label Left: the label at the start of the bar.",
      control: "text",
      if: { arg: "showLabelLeft" },
      table: { type: { summary: "ReactNode" } },
    },
    showLabelRight: {
      description: "Figma Show Label Right.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    labelRight: {
      description: "Figma Label Right: the label at the end of the bar.",
      control: "text",
      if: { arg: "showLabelRight" },
      table: { type: { summary: "ReactNode" } },
    },
  },
  render: (args) => <ProgressBar {...args} aria-label="Progresso" />,
} satisfies Meta<ProgressBarStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

// The fill follows the value as it changes.
export const Loading: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [value, setValue] = React.useState(0)
    const [running, setRunning] = React.useState(false)

    React.useEffect(() => {
      if (!running) return
      const timer = setInterval(() => {
        setValue((current) => {
          const next = Math.min(current + 10, 100)
          if (next === 100) setRunning(false)
          return next
        })
      }, 400)
      return () => clearInterval(timer)
    }, [running])

    return (
      <div className="flex flex-col items-start gap-6">
        <ProgressBar
          value={value}
          labelLeft="Enviando arquivo"
          labelRight={`${value}%`}
          aria-label="Enviando arquivo"
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setValue(0)
            setRunning(true)
          }}
        >
          {running ? "Enviando…" : "Iniciar"}
        </Button>
      </div>
    )
  },
}
