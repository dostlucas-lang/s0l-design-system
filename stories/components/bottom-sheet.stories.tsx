import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetSearch,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Dropdown,
  DropdownCheckboxItem,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSeparator,
  DropdownTrigger,
} from "@/components/ui/dropdown"
import { InputSearch } from "@/components/ui/input-search"

const contents = [
  "custom",
  "actions",
  "selection-single",
  "selection-multiple",
  "date-picker",
  "date-picker-month",
  "date-picker-year",
  "date-picker-range",
] as const

// Story-only args matching the Figma Bottom Sheet: Content plus the Show
// Handler / Header / Search / Scroll Bar / Footer toggles of Content=Custom.
type BottomSheetStoryArgs = {
  content: (typeof contents)[number]
  title: string
  showHandler: boolean
  showHeader: boolean
  showSearch: boolean
  showScrollBar: boolean
  showFooter: boolean
}

function CustomSheet({
  title,
  showHandler,
  showHeader,
  showSearch,
  showScrollBar,
  showFooter,
}: Omit<BottomSheetStoryArgs, "content">) {
  return (
    <BottomSheet>
      <BottomSheetTrigger render={<Button variant="secondary" />}>
        Open bottom sheet
      </BottomSheetTrigger>
      <BottomSheetContent showHandler={showHandler}>
        {showHeader && (
          <BottomSheetHeader>
            <BottomSheetTitle>{title}</BottomSheetTitle>
          </BottomSheetHeader>
        )}
        {showSearch && (
          <BottomSheetSearch>
            <InputSearch placeholder="Buscar" />
          </BottomSheetSearch>
        )}
        <BottomSheetBody className="gap-4">
          {/* Show Scroll Bar: content taller than the sheet. */}
          {Array.from({ length: showScrollBar ? 16 : 2 }, (_, index) => (
            <p key={index} className="text-text-primary">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              non dolor vitae velit fermentum faucibus.
            </p>
          ))}
        </BottomSheetBody>
        {showFooter && (
          <BottomSheetFooter>
            <Button variant="ghost" size="sm" className="mr-auto">
              Limpar
            </Button>
            <BottomSheetClose render={<Button variant="secondary" size="sm" />}>
              Voltar
            </BottomSheetClose>
            <BottomSheetClose render={<Button size="sm" />}>
              Aplicar
            </BottomSheetClose>
          </BottomSheetFooter>
        )}
      </BottomSheetContent>
    </BottomSheet>
  )
}

// Content=Actions / Selection Single / Selection Multiple: the Dropdown with
// Mobile=True, two sections of three items as in Figma.
function DropdownSheet({
  content,
  showFooter,
}: Pick<BottomSheetStoryArgs, "content" | "showFooter">) {
  const [value, setValue] = React.useState("0-0")
  const [checked, setChecked] = React.useState<string[]>([])
  const multiple = content === "selection-multiple"

  const groups = [0, 1].map((section) => (
    <React.Fragment key={section}>
      {section > 0 && <DropdownSeparator />}
      <DropdownGroup>
        {[0, 1, 2].map((item) => {
          const key = `${section}-${item}`
          if (content === "selection-single") {
            return (
              <DropdownRadioItem key={key} value={key} closeOnClick={false}>
                Label
              </DropdownRadioItem>
            )
          }
          if (multiple) {
            return (
              <DropdownCheckboxItem
                key={key}
                checked={checked.includes(key)}
                onCheckedChange={(next) =>
                  setChecked((current) =>
                    next
                      ? [...current, key]
                      : current.filter((other) => other !== key)
                  )
                }
                closeOnClick={false}
              >
                Label
              </DropdownCheckboxItem>
            )
          }
          return <DropdownItem key={key}>Label</DropdownItem>
        })}
      </DropdownGroup>
    </React.Fragment>
  ))

  return (
    <Dropdown mobile>
      <DropdownTrigger render={<Button variant="secondary" />}>
        Open bottom sheet
      </DropdownTrigger>
      <DropdownContent
        footer={
          multiple &&
          showFooter && (
            <>
              <Button variant="ghost" size="sm" className="mr-auto">
                Limpar
              </Button>
              <Button variant="secondary" size="sm">
                Voltar
              </Button>
              <Button size="sm">Aplicar</Button>
            </>
          )
        }
      >
        {content === "selection-single" ? (
          <DropdownRadioGroup
            value={value}
            onValueChange={(next) => setValue(next as string)}
          >
            {groups}
          </DropdownRadioGroup>
        ) : (
          groups
        )}
      </DropdownContent>
    </Dropdown>
  )
}

function BottomSheetStory({ content, ...args }: BottomSheetStoryArgs) {
  if (content === "custom") return <CustomSheet {...args} />

  if (content.startsWith("date-picker")) {
    const common = { mobile: true, showFooter: args.showFooter }
    if (content === "date-picker-range") {
      return <DatePicker {...common} range label="Data inicial" />
    }
    const type =
      content === "date-picker-month"
        ? "month"
        : content === "date-picker-year"
          ? "year"
          : "day"
    return <DatePicker {...common} type={type} label="Data" />
  }

  return <DropdownSheet content={content} showFooter={args.showFooter} />
}

const meta = {
  title: "Components/Bottom Sheet",
  component: BottomSheetStory,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Serve para exibir conteúdos, ações ou seletores em dispositivos móveis, substituindo menus flutuantes em geral.",
      },
    },
  },
  globals: { viewport: { value: "mobile1", isRotated: false } },
  args: {
    content: "custom",
    title: "Title",
    showHandler: true,
    showHeader: true,
    showSearch: false,
    showScrollBar: false,
    showFooter: true,
  },
  argTypes: {
    content: { control: "select", options: contents },
    title: { if: { arg: "content", eq: "custom" } },
    showHandler: { if: { arg: "content", eq: "custom" } },
    showHeader: { if: { arg: "content", eq: "custom" } },
    showSearch: { if: { arg: "content", eq: "custom" } },
    showScrollBar: { if: { arg: "content", eq: "custom" } },
  },
} satisfies Meta<typeof BottomSheetStory>

export default meta

type Story = StoryObj<typeof meta>

export const Custom: Story = {}

export const WithSearch: Story = {
  args: { showSearch: true },
}

export const ScrollBar: Story = {
  args: { showScrollBar: true },
}

export const Actions: Story = {
  args: { content: "actions" },
}

export const SelectionSingle: Story = {
  args: { content: "selection-single" },
}

export const SelectionMultiple: Story = {
  args: { content: "selection-multiple" },
}

export const DatePickerDay: Story = {
  args: { content: "date-picker" },
}

export const DatePickerMonth: Story = {
  args: { content: "date-picker-month" },
}

export const DatePickerYear: Story = {
  args: { content: "date-picker-year" },
}

export const DatePickerRange: Story = {
  args: { content: "date-picker-range" },
}
