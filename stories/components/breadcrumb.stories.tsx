import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Story-only args: Figma "Property 1" (2–6 items) is how many items you
// compose, so the story builds them.
type BreadcrumbStoryArgs = React.ComponentProps<typeof Breadcrumb> & {
  items: number
  currentPage: string
  disableFirstLink: boolean
}

const meta = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Shows the path to the current resource in a hierarchy. Mirrors the Figma Breadcrumbs: 2 to 6 items, with Default / Hover / Disabled links and the Active page.",
      },
    },
  },
  args: {
    items: 4,
    currentPage: "Página Atual",
    disableFirstLink: false,
  },
  argTypes: {
    items: { control: { type: "range", min: 2, max: 6, step: 1 } },
  },
  render: ({ items, currentPage, disableFirstLink, ...args }) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        {Array.from({ length: items - 1 }, (_, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="#"
                disabled={disableFirstLink && index === 0}
              >
                Página {index + 1}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </React.Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>{currentPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
} satisfies Meta<BreadcrumbStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const TwoItems: Story = {
  args: { items: 2 },
}

export const SixItems: Story = {
  args: { items: 6 },
}

export const DisabledLink: Story = {
  args: { disableFirstLink: true },
}
