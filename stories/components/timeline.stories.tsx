import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { Button } from "@/components/ui/button"
import { Timeline, TimelineItem } from "@/components/ui/timeline"

// Story-only args: the Figma Timeline Item properties, applied to every item.
type TimelineStoryArgs = {
  date: string
  title: string
  showTag: boolean
  tag: string
  description: string
  showActions: boolean
  showAction2: boolean
  onAction: () => void
}

function StoryItem({
  date,
  title,
  showTag,
  tag,
  description,
  showActions,
  showAction2,
  onAction,
}: TimelineStoryArgs) {
  return (
    <TimelineItem
      date={date}
      title={title}
      tag={showTag ? tag : undefined}
      actions={
        showActions && (
          <>
            <Button onClick={onAction}>Label</Button>
            {showAction2 && (
              <Button variant="ghost" onClick={onAction}>
                Label
              </Button>
            )}
          </>
        )
      }
    >
      {description}
    </TimelineItem>
  )
}

// No `component`: the table lists only the argTypes below, in their order.
const meta = {
  title: "Components/Timeline",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lists events in order along a dotted line. Mirrors the Figma Timeline and Timeline Item: date, title, Show Tag, description, Show Actions and Show Action 2.",
      },
    },
  },
  args: {
    date: "Fevereiro 2026",
    title: "Title",
    showTag: true,
    tag: "Mais recente",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque commodo, ipsum vel egestas vehicula, ligula ipsum sagittis metus, ut porta risus velit eget tellus.",
    showActions: true,
    showAction2: true,
    onAction: fn(),
  },
  argTypes: {
    date: {
      description: "`date`: Label/Small in Text/Secondary.",
      control: "text",
      table: { type: { summary: "ReactNode" } },
    },
    title: {
      description: "`title`: bold Body/Medium in Text/Primary.",
      control: "text",
      table: { type: { summary: "ReactNode" } },
    },
    showTag: {
      description: "Figma Show Tag: pass `tag` to show it.",
      control: "boolean",
      table: { type: { summary: "boolean" } },
    },
    tag: {
      description: "`tag`: the Small Accent Soft Tag next to the title.",
      control: "text",
      if: { arg: "showTag" },
      table: { type: { summary: "ReactNode" } },
    },
    description: {
      description: "`children`: Body/Medium in Text/Primary.",
      control: "text",
      table: { type: { summary: "ReactNode" } },
    },
    showActions: {
      description: "Figma Show Actions: pass the buttons in `actions`.",
      control: "boolean",
      table: { type: { summary: "boolean" } },
    },
    showAction2: {
      description: "Figma Show Action 2: the Button Ghost after the Primary.",
      control: "boolean",
      if: { arg: "showActions" },
      table: { type: { summary: "boolean" } },
    },
    onAction: { table: { disable: true } },
  },
  // Figma Timeline: two Timeline Items.
  render: (args) => (
    <Timeline>
      <StoryItem {...args} />
      <StoryItem {...args} />
    </Timeline>
  ),
} satisfies Meta<TimelineStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

// Figma Timeline Item on its own.
export const Item: Story = {
  render: (args) => (
    <Timeline>
      <StoryItem {...args} />
    </Timeline>
  ),
}

// A real history: only the latest event has the Tag and actions.
export const History: Story = {
  parameters: { controls: { disable: true } },
  render: ({ onAction }) => (
    <Timeline>
      <TimelineItem
        date="Fevereiro 2026"
        title="Plano Premium"
        tag="Mais recente"
        actions={
          <>
            <Button onClick={onAction}>Ver detalhes</Button>
            <Button variant="ghost" onClick={onAction}>
              Cancelar
            </Button>
          </>
        }
      >
        Assinatura renovada por mais 12 meses.
      </TimelineItem>
      <TimelineItem date="Agosto 2025" title="Upgrade de plano">
        Mudança do plano Básico para o Premium.
      </TimelineItem>
      <TimelineItem date="Fevereiro 2025" title="Conta criada">
        Primeiro acesso à plataforma.
      </TimelineItem>
    </Timeline>
  ),
}
