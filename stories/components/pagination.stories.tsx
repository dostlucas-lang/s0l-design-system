import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs } from "storybook/preview-api"
import { fn } from "storybook/test"

import { Pagination } from "@/components/ui/pagination"

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Serve para dividir grandes volumes de conteúdo em múltiplas páginas, permitindo navegação entre elas.",
      },
    },
  },
  args: {
    type: "buttons",
    size: "md",
    page: 5,
    pageCount: 10,
    itemCount: 50,
    pageSize: 5,
    onPageChange: fn(),
  },
  argTypes: {
    type: { control: "inline-radio", options: ["buttons", "simple"] },
    size: { control: "inline-radio", options: ["sm", "md"] },
    page: { control: { type: "number", min: 1 } },
    pageCount: { control: { type: "number", min: 1 } },
  },
  // Clicking a page or an arrow updates the page control.
  render: function Render({ onPageChange, ...args }) {
    const [, updateArgs] = useArgs()

    return (
      <Pagination
        {...args}
        onPageChange={(page) => {
          updateArgs({ page })
          onPageChange?.(page)
        }}
      />
    )
  },
} satisfies Meta<typeof Pagination>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

// The Figma variant grid: Small on top, Medium below, then Simple.
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-10">
      {(["sm", "md"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-10">
          <Pagination size={size} page={1} pageCount={7} />
          <Pagination size={size} page={1} pageCount={10} />
          <Pagination size={size} page={5} pageCount={10} />
          <Pagination size={size} page={10} pageCount={10} />
        </div>
      ))}
      <Pagination
        type="simple"
        page={1}
        pageCount={10}
        itemCount={50}
        pageSize={5}
      />
    </div>
  ),
}

export const Small: Story = {
  args: { size: "sm" },
}

export const FewPages: Story = {
  args: { page: 1, pageCount: 7 },
}

export const LastPage: Story = {
  args: { page: 10 },
}

export const Simple: Story = {
  args: { type: "simple", page: 1 },
}

export const AsLinks: Story = {
  args: { getPageHref: (page: number) => `?page=${page}` },
}

export const CustomLabels: Story = {
  args: {
    type: "simple",
    page: 2,
    labels: {
      previous: "Página anterior",
      next: "Próxima página",
      page: "Page",
      to: "to",
      of: "of",
      items: "items",
    },
  },
}
