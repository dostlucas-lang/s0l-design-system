import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs } from "storybook/preview-api"
import { fn } from "storybook/test"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { inputLabelArgTypes, labelArgs } from "./label.args"

// Story-only args: InputOTP's props are a render/children union, so the story
// exposes the props that change how it looks.
type InputOTPStoryArgs = {
  value: string
  maxLength: number
  label: string
  requirement?: string
  info: string
  helpText: string
  error: string
  separated: boolean
  disabled: boolean
  readOnly: boolean
  autoFocus: boolean
  onChange: (value: string) => void
}

const meta = {
  title: "Components/Input OTP",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "One-time password input split into items. Mirrors the Figma Input OTP component: Filled × Error, with the Active item following the caret.",
      },
    },
  },
  args: {
    ...labelArgs,
    value: "",
    maxLength: 6,
    helpText: "",
    error: "",
    separated: false,
    disabled: false,
    readOnly: false,
    autoFocus: false,
    onChange: fn(),
  },
  argTypes: {
    ...inputLabelArgTypes,
    maxLength: { control: { type: "range", min: 4, max: 8, step: 2 } },
  },
  render: function Render({ separated, onChange, ...args }) {
    const [, updateArgs] = useArgs()
    const half = Math.ceil(args.maxLength / 2)
    const slots = (from: number, to: number) =>
      Array.from({ length: to - from }, (_, index) => (
        <InputOTPSlot key={from + index} index={from + index} />
      ))

    return (
      <InputOTP
        {...args}
        onChange={(value: string) => {
          updateArgs({ value })
          onChange(value)
        }}
      >
        {separated ? (
          <>
            <InputOTPGroup>{slots(0, half)}</InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>{slots(half, args.maxLength)}</InputOTPGroup>
          </>
        ) : undefined}
      </InputOTP>
    )
  },
} satisfies Meta<InputOTPStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

// The Figma variant grid: Filled × Error.
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <InputOTP label="Label" maxLength={6} />
      <InputOTP label="Label" maxLength={6} value="111111" />
      <InputOTP label="Label" maxLength={6} error="Text Error" />
      <InputOTP label="Label" maxLength={6} value="111111" error="Text Error" />
    </div>
  ),
}

// State=Active on the first item.
export const Active: Story = {
  args: { autoFocus: true },
}

export const Filled: Story = {
  args: { value: "111111" },
}

export const WithHelpText: Story = {
  args: { helpText: "Enter the code we sent to your email." },
}

export const WithError: Story = {
  args: { value: "123456", error: "Text Error" },
}

export const WithSeparator: Story = {
  args: { separated: true },
}

export const Disabled: Story = {
  args: { value: "12", disabled: true },
}

export const ReadOnly: Story = {
  args: { value: "123456", readOnly: true },
}
