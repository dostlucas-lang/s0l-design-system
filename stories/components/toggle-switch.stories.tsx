import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useArgs } from "storybook/preview-api"
import { fn } from "storybook/test"

import { ToggleSwitch } from "@/components/ui/toggle-switch"

const meta = {
  title: "Components/Toggle Switch",
  component: ToggleSwitch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Toggles a setting on or off. Mirrors the Figma Toggle Switch component: State (Default / Read Only / Disabled) × Active × Show Label × Label Position.",
      },
    },
  },
  args: {
    label: "Label",
    description: "",
    labelPosition: "right",
    checked: true,
    disabled: false,
    readOnly: false,
    onCheckedChange: fn(),
  },
  argTypes: {
    labelPosition: { control: "inline-radio", options: ["right", "left"] },
    label: { control: "text" },
    description: { control: "text" },
  },
  // Keeps the checked control in sync when the switch is clicked.
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    return (
      <ToggleSwitch
        {...args}
        onCheckedChange={(checked, details) => {
          updateArgs({ checked })
          args.onCheckedChange?.(checked, details)
        }}
      />
    )
  },
} satisfies Meta<typeof ToggleSwitch>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

// The Figma grid: one row per State, Active=False / True, without a label,
// with the label on the right and on the left.
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
          {[false, true].map((checked) => (
            <ToggleSwitch
              key={String(checked)}
              {...state}
              defaultChecked={checked}
              aria-label={`${name} ${checked ? "on" : "off"}`}
            />
          ))}
          {(["right", "left"] as const).map((position) =>
            [false, true].map((checked) => (
              <ToggleSwitch
                key={`${position}-${checked}`}
                {...state}
                defaultChecked={checked}
                label="Label"
                labelPosition={position}
              />
            ))
          )}
        </div>
      ))}
    </div>
  ),
}

export const WithDescription: Story = {
  args: {
    label: "Notifications",
    description: "Email me when something changes.",
  },
}

export const LabelLeft: Story = {
  args: { labelPosition: "left" },
}

export const NoLabel: Story = {
  args: { label: undefined, "aria-label": "Toggle" },
}

export const ReadOnly: Story = {
  args: { readOnly: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}
