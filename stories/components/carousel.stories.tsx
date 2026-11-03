import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselItem,
} from "@/components/ui/carousel"

// Story-only args matching the Figma Carousel: Items and Current Item
// (the slide it starts on).
type CarouselStoryArgs = {
  items: number
  startIndex: number
  loop: boolean
}

function CarouselStory({ items, startIndex, loop }: CarouselStoryArgs) {
  return (
    <Carousel
      // Remounts when the slides change, so Embla starts on startIndex.
      key={`${items}-${startIndex}-${loop}`}
      opts={{ startIndex: Math.min(startIndex, items - 1), loop }}
      className="w-80"
    >
      <CarouselContent>
        {Array.from({ length: items }, (_, index) => (
          <CarouselItem key={index}>
            <div className="flex h-40 items-center justify-center rounded-md border border-border-secondary bg-background-secondary text-heading-small text-text-primary">
              {index + 1}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselControls />
    </Carousel>
  )
}

const meta = {
  title: "Components/Carousel",
  component: CarouselStory,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Shows one slide at a time with arrows and indicators. Mirrors the Figma Carousel: Items (2 / 3 / 4 / 5 / > 5) × Current Item (First / Mid / Last). Above 5 slides only 5 indicators show, and an end one shrinks while more slides sit past it. Arrow keys, the arrows, the indicators and swiping all change the slide.",
      },
    },
  },
  args: {
    items: 2,
    startIndex: 0,
    loop: true,
  },
  argTypes: {
    items: { control: { type: "range", min: 2, max: 10 } },
    startIndex: { control: { type: "number", min: 0 } },
  },
} satisfies Meta<typeof CarouselStory>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const FiveItems: Story = {
  args: { items: 5 },
}

// Items > 5, Current Item = First / Mid / Last.
export const MoreThanFiveFirst: Story = {
  args: { items: 8, startIndex: 0 },
}

export const MoreThanFiveMid: Story = {
  args: { items: 8, startIndex: 4 },
}

export const MoreThanFiveLast: Story = {
  args: { items: 8, startIndex: 7 },
}
