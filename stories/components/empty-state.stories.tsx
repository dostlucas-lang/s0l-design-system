import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateTitle,
} from "@/components/ui/empty-state"

// Story-only args matching the Figma toggles and texts; the component itself
// is composed from parts.
type EmptyStateStoryArgs = React.ComponentProps<typeof EmptyState> & {
  showIcon: boolean
  showTitle: boolean
  showActions: boolean
  showAction2: boolean
  title: string
  description: string
}

const meta = {
  title: "Components/Empty State",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Serve para representar a ausência de conteúdo ou resultados em uma interface, orientando o usuário sobre o motivo e o próximo passo a ser tomado.",
      },
    },
  },
  args: {
    direction: "inline",
    showIcon: true,
    showTitle: true,
    showActions: true,
    showAction2: true,
    title: "Title",
    description: "Description",
  },
  argTypes: {
    direction: { control: "inline-radio", options: ["inline", "stacked"] },
  },
  render: ({
    showIcon,
    showTitle,
    showActions,
    showAction2,
    title,
    description,
    ...args
  }) => (
    <EmptyState {...args} className="w-90">
      {showIcon && <EmptyStateIcon />}
      <EmptyStateHeader>
        {showTitle && <EmptyStateTitle>{title}</EmptyStateTitle>}
        <EmptyStateDescription>{description}</EmptyStateDescription>
      </EmptyStateHeader>
      {showActions && (
        <EmptyStateActions>
          <Button>Label</Button>
          {showAction2 && <Button variant="secondary">Label</Button>}
        </EmptyStateActions>
      )}
    </EmptyState>
  ),
} satisfies Meta<EmptyStateStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Inline: Story = {}

export const Stacked: Story = {
  args: { direction: "stacked" },
}

export const DescriptionOnly: Story = {
  args: { showIcon: false, showTitle: false, showActions: false },
}
