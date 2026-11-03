import type { Meta, StoryObj } from "@storybook/react-vite"

import { Stepper, type StepperStep } from "@/components/ui/stepper"

const stepNames = [
  "First Step",
  "Second Step",
  "Third Step",
  "Fourth Step",
  "Fifth Step",
]

// Story-only args: the Figma properties of the three components.
type StepperStoryArgs = {
  type: "horizontal" | "vertical" | "simple"
  steps: number
  currentStep: number
  accordion: boolean
  showDescription: boolean
}

// The Stepper at the Figma widths: 821px horizontal, 320px vertical and
// simple. The `currentStep` control moves the current step.
function StoryStepper({
  type,
  steps,
  currentStep,
  accordion,
  showDescription,
}: StepperStoryArgs) {
  const items: StepperStep[] = stepNames.slice(0, steps).map((label) => ({
    label,
    description: showDescription ? "Description" : undefined,
    content: (
      <p>
        Conteúdo da etapa “{label}”. Preencha os campos e avance para a próxima.
      </p>
    ),
  }))

  return (
    <Stepper
      // Remount so the open accordion step follows the current one.
      key={accordion ? currentStep : undefined}
      type={type}
      steps={type === "simple" ? steps : items}
      currentStep={currentStep}
      accordion={accordion}
      className={type === "horizontal" ? "w-[821px]" : "w-80"}
    />
  )
}

// No `component`: the table lists only the argTypes below, in their order.
const meta = {
  title: "Components/Stepper",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Shows the steps of a flow and where the user is. One component for the three Figma ones: Stepper Horizontal (Count), Stepper Vertical (Steps, Accordion) and Stepper Simple (Steps, Current Step). Each step is Success before the current one, Active on it and Default after it.",
      },
    },
  },
  args: {
    type: "horizontal",
    steps: 4,
    currentStep: 2,
    accordion: false,
    showDescription: true,
  },
  argTypes: {
    type: {
      description:
        "Figma component: Stepper Horizontal, Stepper Vertical or Stepper Simple.",
      control: "inline-radio",
      options: ["horizontal", "vertical", "simple"],
      table: {
        type: { summary: '"horizontal" | "vertical" | "simple"' },
        defaultValue: { summary: '"horizontal"' },
      },
    },
    steps: {
      description:
        "Figma Count / Steps: the steps (`{ label, description, content }[]`), or how many for Simple.",
      control: { type: "range", min: 2, max: 5, step: 1 },
      table: { type: { summary: "StepperStep[] | number" } },
    },
    currentStep: {
      description: "Figma Current Step, from 1 to 5.",
      control: { type: "range", min: 1, max: 5, step: 1 },
      table: { type: { summary: "number" } },
    },
    accordion: {
      description:
        "Figma Accordion (vertical): each step opens its `content`; the current one starts open.",
      control: "boolean",
      if: { arg: "type", eq: "vertical" },
      table: { type: { summary: "boolean" } },
    },
    showDescription: {
      description:
        "Figma Show Description (vertical): each step's `description`.",
      control: "boolean",
      if: { arg: "type", eq: "vertical" },
      table: { type: { summary: "boolean" } },
    },
  },
  render: (args) => <StoryStepper {...args} />,
} satisfies Meta<StepperStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

// Figma Stepper Horizontal.
export const Horizontal: Story = {
  args: { type: "horizontal" },
  argTypes: { type: { table: { disable: true } } },
}

// Figma Stepper Vertical, Accordion=False.
export const Vertical: Story = {
  args: { type: "vertical" },
  argTypes: { type: { table: { disable: true } } },
}

// Figma Stepper Vertical, Accordion=True: click a step to open or close it.
export const VerticalAccordion: Story = {
  args: { type: "vertical", accordion: true },
  argTypes: { type: { table: { disable: true } } },
}

// Figma Stepper Simple.
export const Simple: Story = {
  args: { type: "simple", currentStep: 3 },
  argTypes: { type: { table: { disable: true } } },
}
