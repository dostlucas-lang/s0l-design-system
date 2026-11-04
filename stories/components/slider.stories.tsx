import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs } from "storybook/preview-api"
import { fn } from "storybook/test"

import { Slider } from "@/components/ui/slider"

const meta = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Serve para selecionar valores dentro de um intervalo, por meio de interação direta com um controle deslizante.",
      },
    },
  },
  args: {
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    scale: true,
    disabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    scale: { control: "boolean" },
  },
  // Keeps the value control in sync while dragging.
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    return (
      <div className="w-[472px]">
        <Slider
          {...args}
          onValueChange={(value, details) => {
            updateArgs({ value })
            args.onValueChange?.(value, details)
          }}
        />
      </div>
    )
  },
} satisfies Meta<typeof Slider>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

// The Figma variant grid: Property 1=False (one value) and True (range).
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[472px] flex-col gap-10">
      <Slider defaultValue={50} scale />
      <Slider defaultValue={[25, 75]} scale />
    </div>
  ),
}

export const Range: Story = {
  args: { value: [25, 75], step: 5 },
}

export const WithoutScale: Story = {
  args: { scale: false },
}

export const CustomScale: Story = {
  args: {
    value: 40,
    scale: [0, 20, 40, 60, 80, 100],
    formatScaleLabel: (value: number) => `${value}%`,
  },
}

export const Disabled: Story = {
  args: { disabled: true, value: 30 },
}
