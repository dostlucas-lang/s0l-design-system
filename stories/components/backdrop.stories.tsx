import type { Meta, StoryObj } from "@storybook/react-vite"

import { Backdrop } from "@/components/ui/backdrop"
import { Button } from "@/components/ui/button"

// What the Backdrop covers, to show how it dims the page.
function PageContent() {
  return (
    <div className="flex flex-col items-start gap-4 p-8">
      <h1 className="text-heading-small text-text-primary">Título da página</h1>
      <p className="text-body-medium text-text-secondary">
        O Backdrop cobre a tela inteira e escurece o conteúdo atrás dele.
      </p>
      <Button>Ação</Button>
    </div>
  )
}

const meta = {
  title: "Components/Backdrop",
  component: Backdrop,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Serve para atenuar visualmente o conteúdo ao fundo, direcionando o foco para um elemento sobreposto.",
      },
      // It's fixed to the screen: inline, it would cover this page.
      story: { inline: false, iframeHeight: 360 },
    },
  },
  argTypes: {
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Backdrop>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <>
      <PageContent />
      <Backdrop {...args} />
    </>
  ),
}
