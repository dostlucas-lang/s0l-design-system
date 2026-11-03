import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Settings01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@/components/ui/icon"
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

// Story-only args matching the Figma Dropdown: Type × Sections × Mobile, plus
// the item and content toggles (Show Icon / Description / Header / Footer).
type DropdownStoryArgs = React.ComponentProps<typeof Dropdown> & {
  type: "actions" | "single" | "multiple"
  sections: number
  showIcon: boolean
  showDescription: boolean
  showHeader: boolean
  showFooter: boolean
  side: "top" | "right" | "bottom" | "left"
  align: "start" | "center" | "end"
}

function Items({
  type,
  section,
  showIcon,
  showDescription,
  checked,
  onToggle,
}: Pick<DropdownStoryArgs, "type" | "showIcon" | "showDescription"> & {
  section: number
  checked: string[]
  onToggle: (key: string, next: boolean) => void
}) {
  return [0, 1].map((item) => {
    const key = `${section}-${item}`
    const content = {
      icon: showIcon ? <HugeiconsIcon icon={Settings01Icon} /> : undefined,
      description: showDescription ? "Description" : undefined,
      children: "Label",
    }

    if (type === "single") {
      return (
        <DropdownRadioItem
          key={key}
          value={key}
          closeOnClick={false}
          {...content}
        />
      )
    }

    if (type === "multiple") {
      return (
        <DropdownCheckboxItem
          key={key}
          checked={checked.includes(key)}
          onCheckedChange={(next) => onToggle(key, next)}
          closeOnClick={false}
          {...content}
        />
      )
    }

    return <DropdownItem key={key} {...content} />
  })
}

const meta = {
  title: "Components/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A menu of actions or options triggered by a button. Mirrors the Figma Dropdown: Type (Actions / Selection Single / Selection Multiple) × Sections (1–4). Mobile=True shows the same menu as the Figma Bottom Sheet.",
      },
    },
  },
  args: {
    mobile: false,
    type: "actions",
    sections: 2,
    showIcon: false,
    showDescription: false,
    showHeader: false,
    showFooter: false,
    side: "bottom",
    align: "start",
  },
  argTypes: {
    mobile: { control: "boolean" },
    type: {
      control: "inline-radio",
      options: ["actions", "single", "multiple"],
    },
    sections: { control: { type: "range", min: 1, max: 4 } },
    // The Bottom Sheet is always at the bottom of the screen.
    side: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
      if: { arg: "mobile", truthy: false },
    },
    align: {
      control: "inline-radio",
      options: ["start", "center", "end"],
      if: { arg: "mobile", truthy: false },
    },
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
  },
  // The menu opens and closes on its own; the selection is local state.
  render: function Render({
    type,
    sections,
    showIcon,
    showDescription,
    showHeader,
    showFooter,
    side,
    align,
    ...args
  }) {
    const [value, setValue] = React.useState("0-0")
    const [checked, setChecked] = React.useState<string[]>(["0-0"])

    const groups = Array.from({ length: sections }, (_, section) => (
      <React.Fragment key={section}>
        {section > 0 && <DropdownSeparator />}
        <DropdownGroup>
          <Items
            type={type}
            section={section}
            showIcon={showIcon}
            showDescription={showDescription}
            checked={checked}
            onToggle={(key, next) =>
              setChecked((current) =>
                next
                  ? [...current, key]
                  : current.filter((item) => item !== key)
              )
            }
          />
        </DropdownGroup>
      </React.Fragment>
    ))

    return (
      <Dropdown {...args}>
        <DropdownTrigger render={<Button variant="secondary" />}>
          Open menu
        </DropdownTrigger>
        <DropdownContent
          side={side}
          align={align}
          header={
            showHeader && (
              <InputSearch
                placeholder="Search"
                onKeyDown={(event) => event.stopPropagation()}
              />
            )
          }
          footer={
            showFooter && (
              <>
                <Button variant="secondary" size="sm">
                  Clear
                </Button>
                <Button size="sm">Apply</Button>
              </>
            )
          }
        >
          {type === "single" ? (
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
  },
} satisfies Meta<DropdownStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Actions: Story = {}

export const SelectionSingle: Story = {
  args: { type: "single" },
}

export const SelectionMultiple: Story = {
  args: { type: "multiple" },
}

export const HeaderAndFooter: Story = {
  args: { type: "multiple", sections: 1, showHeader: true, showFooter: true },
}

export const IconsAndDescriptions: Story = {
  args: { showIcon: true, showDescription: true },
}

// Figma Dropdown on Bottom Sheet.
export const Mobile: Story = {
  args: { mobile: false, type: "multiple", showFooter: true },
  globals: { viewport: { value: "mobile1", isRotated: false } },
}
