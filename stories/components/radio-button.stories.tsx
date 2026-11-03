import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs } from "storybook/preview-api"
import { fn } from "storybook/test"

import { RadioButton, RadioGroup } from "@/components/ui/radio-button"

const options = [
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
]

const meta = {
  title: "Components/Radio Button",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A set of options where only one can be selected. Mirrors the Figma Radio Button (State × Active × Show Label × Label Position) and Radio Group (Direction) components.",
      },
    },
  },
  args: {
    label: "Label",
    helpText: "",
    direction: "vertical",
    value: "comfortable",
    disabled: false,
    readOnly: false,
    onValueChange: fn(),
  },
  argTypes: {
    direction: { control: "inline-radio", options: ["vertical", "horizontal"] },
    value: {
      control: "inline-radio",
      options: options.map((option) => option.value),
    },
  },
  // Keeps the value control in sync when an option is picked.
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    return (
      <RadioGroup
        {...args}
        onValueChange={(value, details) => {
          updateArgs({ value })
          args.onValueChange?.(value, details)
        }}
      >
        {options.map((option) => (
          <RadioButton
            key={option.value}
            value={option.value}
            label={option.label}
          />
        ))}
      </RadioGroup>
    )
  },
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

// The Figma Radio Button grid: one row per State, Active=False / True,
// without a label, with the label on the right and on the left.
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-10">
      {(
        [
          ["Default", {}],
          ["Read Only", { readOnly: true }],
          ["Disabled", { disabled: true }],
        ] as const
      ).map(([name, state]) => (
        <div key={name} className="flex items-center gap-10">
          {(["off", "on"] as const).map((value) => (
            <RadioGroup key={value} {...state} defaultValue="on">
              <RadioButton value={value} aria-label={`${name} ${value}`} />
            </RadioGroup>
          ))}
          {(["right", "left"] as const).map((position) =>
            (["off", "on"] as const).map((value) => (
              <RadioGroup
                key={`${position}-${value}`}
                {...state}
                defaultValue="on"
              >
                <RadioButton
                  value={value}
                  label="Label"
                  labelPosition={position}
                />
              </RadioGroup>
            ))
          )}
        </div>
      ))}
    </div>
  ),
}

export const Horizontal: Story = {
  args: { direction: "horizontal" },
}

export const WithHelpText: Story = {
  args: { helpText: "Text Help" },
}

export const WithDescription: Story = {
  render: () => (
    <RadioGroup label="Plan" defaultValue="pro">
      <RadioButton
        value="starter"
        label="Starter"
        description="For personal projects."
      />
      <RadioButton value="pro" label="Pro" description="For growing teams." />
    </RadioGroup>
  ),
}

export const ReadOnly: Story = {
  args: { readOnly: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}
