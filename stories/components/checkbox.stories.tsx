import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs } from "storybook/preview-api"
import { fn } from "storybook/test"

import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox"

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Toggles a single option on or off. Mirrors the Figma Checkbox: State (Default / Read Only / Disabled), Active, Indeterminate, Label, Label Position, Description and Nested.",
      },
    },
  },
  args: {
    label: "Label",
    description: "",
    labelPosition: "right",
    checked: false,
    indeterminate: false,
    readOnly: false,
    disabled: false,
    nested: false,
    showNestIndicator: true,
    onCheckedChange: fn(),
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    labelPosition: { control: "inline-radio", options: ["right", "left"] },
  },
  // Keeps the checked control in sync when the checkbox is clicked.
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    return (
      <Checkbox
        {...args}
        aria-label={args.label ? undefined : "Label"}
        onCheckedChange={(checked, details) => {
          updateArgs({ checked, indeterminate: false })
          args.onCheckedChange?.(checked, details)
        }}
      />
    )
  },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Checked: Story = {
  args: { checked: true },
}

export const Indeterminate: Story = {
  args: { indeterminate: true },
}

export const WithDescription: Story = {
  args: {
    label: "Email notifications",
    description: "Get notified about account activity.",
    checked: true,
  },
}

export const LabelLeft: Story = {
  args: { labelPosition: "left" },
}

export const NoLabel: Story = {
  args: { label: "" },
}

export const ReadOnly: Story = {
  args: { readOnly: true, checked: true },
}

export const Disabled: Story = {
  args: { disabled: true, checked: true },
}

export const Nested: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox label="All fruits" indeterminate />
      <Checkbox label="Apple" nested defaultChecked />
      <Checkbox label="Banana" nested />
      <Checkbox label="Without indicator" nested showNestIndicator={false} />
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <CheckboxGroup
      label="Fruits"
      helpText="Pick your favorites."
      defaultValue={["apple"]}
    >
      {["apple", "banana", "orange"].map((fruit) => (
        <Checkbox key={fruit} value={fruit} label={fruit} />
      ))}
    </CheckboxGroup>
  ),
}

export const GroupHorizontal: Story = {
  render: () => (
    <CheckboxGroup label="Label" direction="horizontal">
      {["one", "two", "three"].map((value) => (
        <Checkbox key={value} value={value} label="Label" />
      ))}
    </CheckboxGroup>
  ),
}
