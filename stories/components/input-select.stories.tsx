import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs } from "storybook/preview-api"
import { fn } from "storybook/test"

import {
  InputSelect,
  InputSelectGroup,
  InputSelectGroupLabel,
  InputSelectItem,
  InputSelectSeparator,
} from "@/components/ui/input-select"
import { inputLabelArgTypes, labelArgs } from "./label.args"
import {
  getLeadingIcon,
  leadingIconArgs,
  leadingIconArgTypes,
  type LeadingIconArgs,
} from "./leading-icon.args"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
]

const vegetables = [
  { value: "carrot", label: "Carrot" },
  { value: "potato", label: "Potato" },
]

const fruitItems = fruits.map((fruit) => (
  <InputSelectItem key={fruit.value} value={fruit.value}>
    {fruit.label}
  </InputSelectItem>
))

type StoryArgs = Omit<
  React.ComponentProps<typeof InputSelect<string>>,
  "icon"
> &
  LeadingIconArgs

const meta = {
  title: "Components/Input Select",
  component: InputSelect<string> as React.ComponentType<StoryArgs>,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Picks a value from a list of options. Mirrors the Figma Input Select component: State (Default / Hover / Active / Disabled / Read Only) × Filled × Error. Active is the open list, which is the Figma Dropdown. Pass `items` so the field can show the label of the selected value.",
      },
    },
  },
  args: {
    ...labelArgs,
    ...leadingIconArgs,
    placeholder: "Placeholder",
    items: fruits,
    value: null,
    disabled: false,
    readOnly: false,
    clearable: true,
    className: "w-60",
    onValueChange: fn(),
    onClear: fn(),
    children: fruitItems,
  },
  argTypes: {
    value: {
      control: "select",
      options: [null, ...fruits.map((fruit) => fruit.value)],
    },
    ...inputLabelArgTypes,
    helpText: { control: "text" },
    error: { control: "text" },
    prefix: { control: "text" },
    ...leadingIconArgTypes,
    items: { control: false },
    children: { control: false },
  },
  // Keeps the value control in sync when an option is picked or cleared.
  render: function Render({ onValueChange, showIcon, icon, ...args }) {
    const [, updateArgs] = useArgs()

    return (
      <InputSelect
        {...args}
        icon={getLeadingIcon({ showIcon, icon })}
        onValueChange={(value) => {
          updateArgs({ value })
          onValueChange?.(value)
        }}
      />
    )
  },
} satisfies Meta<StoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

// The Figma variant grid: Filled=False on top, Filled=True below.
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid w-fit grid-cols-3 gap-x-10 gap-y-8">
      <InputSelect
        className="w-60"
        label="Label"
        placeholder="Placeholder"
        items={fruits}
      >
        {fruitItems}
      </InputSelect>
      <InputSelect
        className="w-60"
        label="Label"
        placeholder="Placeholder"
        items={fruits}
        error="Text Error"
      >
        {fruitItems}
      </InputSelect>
      <InputSelect
        className="w-60"
        label="Label"
        placeholder="Placeholder"
        items={fruits}
        disabled
      >
        {fruitItems}
      </InputSelect>
      <InputSelect
        className="w-60"
        label="Label"
        items={fruits}
        defaultValue="apple"
      >
        {fruitItems}
      </InputSelect>
      <InputSelect
        className="w-60"
        label="Label"
        items={fruits}
        defaultValue="apple"
        error="Text Error"
      >
        {fruitItems}
      </InputSelect>
      <InputSelect
        className="w-60"
        label="Label"
        items={fruits}
        defaultValue="apple"
        readOnly
      >
        {fruitItems}
      </InputSelect>
    </div>
  ),
}

export const Filled: Story = {
  args: { value: "banana" },
}

export const WithHelpText: Story = {
  args: { helpText: "Text Help" },
}

export const WithError: Story = {
  args: { value: "banana", error: "Text Error" },
}

export const WithIconAndPrefix: Story = {
  args: {
    label: "Country",
    showIcon: true,
    icon: "Location",
    prefix: "+55",
    placeholder: "Select a country",
    items: { br: "Brasil", pt: "Portugal" },
    value: "br",
    children: [
      <InputSelectItem key="br" value="br">
        Brasil
      </InputSelectItem>,
      <InputSelectItem key="pt" value="pt">
        Portugal
      </InputSelectItem>,
    ],
  },
}

export const Groups: Story = {
  args: {
    label: "Food",
    placeholder: "Select food",
    items: [...fruits, ...vegetables],
    children: (
      <>
        <InputSelectGroup>
          <InputSelectGroupLabel>Fruits</InputSelectGroupLabel>
          {fruitItems}
        </InputSelectGroup>
        <InputSelectSeparator />
        <InputSelectGroup>
          <InputSelectGroupLabel>Vegetables</InputSelectGroupLabel>
          {vegetables.map((vegetable) => (
            <InputSelectItem key={vegetable.value} value={vegetable.value}>
              {vegetable.label}
            </InputSelectItem>
          ))}
        </InputSelectGroup>
      </>
    ),
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const ReadOnly: Story = {
  args: { readOnly: true, value: "banana" },
}

// State=Active: the list open below the field.
export const Open: Story = {
  tags: ["!autodocs"],
  args: { value: "banana", defaultOpen: true },
}
