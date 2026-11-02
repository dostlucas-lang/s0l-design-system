import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useArgs } from "storybook/preview-api"

import {
  LevelIndicator,
  LevelIndicatorGroup,
  type LevelIndicatorGroupProps,
  LevelIndicatorLabel,
  type LevelIndicatorLabelPosition,
  type LevelIndicatorProps,
} from "@/components/ui/level-indicator"

type GroupNumber = 1 | 2 | 3

type GroupFields = Pick<LevelIndicatorGroupProps, "count" | "active" | "color">

// One copy of the Group props per group. `selectedGroup` picks the one the panel shows.
type GroupArgs = Record<
  `group${GroupNumber}Count` | `group${GroupNumber}Active`,
  number
> &
  Record<`group${GroupNumber}Color`, GroupFields["color"]>

// The panel follows the three Figma levels. `groups` and `selectedGroup` only
// exist here: in code, add one child per group.
type LevelIndicatorStoryArgs = GroupArgs & {
  labelPosition: LevelIndicatorLabelPosition
  showLabelLeft: boolean
  showLabelRight: boolean
  labelLeft: string
  labelRight: string
  groups: GroupNumber
  size: LevelIndicatorProps["size"]
  selectedGroup: GroupNumber
}

const inSection = (category: string, type: string) => ({
  table: { category, type: { summary: type } },
})

const inLabel = (type: string) => inSection("Level Indicator Label", type)
const inIndicator = (type: string) => inSection("Level Indicator", type)
const inGroup = (type: string) => inSection("Level Indicator Group", type)

const groupNumbers: GroupNumber[] = [1, 2, 3]
const sizes: LevelIndicatorProps["size"][] = ["small", "medium", "large"]
const colors: GroupFields["color"][] = [
  "accent",
  "info",
  "success",
  "warning",
  "danger",
]

const labelControls = [
  "labelPosition",
  "showLabelLeft",
  "labelLeft",
  "showLabelRight",
  "labelRight",
] as const
const labelPositions: LevelIndicatorLabelPosition[] = ["top", "bottom", "side"]

// The stories that list a variant hide its control, and the ones it leaves idle.
const hideControls = (...names: (keyof LevelIndicatorStoryArgs)[]) =>
  Object.fromEntries(names.map((name) => [name, { table: { disable: true } }]))

const groupDefaults = { count: 3, active: 1, color: "accent" }

const groupControls = {
  count: {
    description: "Figma Count: the number of items, 1 to 10.",
    control: { type: "range", min: 1, max: 10, step: 1 },
    summary: "number",
  },
  active: {
    description: "How many items are active, from the first one.",
    control: { type: "range", min: 0, max: 10, step: 1 },
    summary: "number",
  },
  color: {
    description: "The color of the active items.",
    control: "select",
    options: colors,
    summary: "string",
  },
}

const groupKey = (group: GroupNumber, field: string) =>
  `group${group}${field[0].toUpperCase()}${field.slice(1)}` as keyof GroupArgs

const groupArgs = Object.fromEntries(
  groupNumbers.flatMap((group) =>
    Object.entries(groupDefaults).map(([field, value]) => [
      groupKey(group, field),
      value,
    ])
  )
) as GroupArgs

const groupArgTypes = Object.fromEntries(
  groupNumbers.flatMap((group) =>
    Object.entries(groupControls).map(([field, { summary, ...argType }]) => [
      groupKey(group, field),
      {
        ...argType,
        name: field,
        if: { arg: "selectedGroup", eq: group },
        ...inGroup(summary),
      },
    ])
  )
)

const getGroupProps = (args: GroupArgs, group: GroupNumber) =>
  Object.fromEntries(
    Object.keys(groupControls).map((field) => [
      field,
      args[groupKey(group, field)],
    ])
  ) as GroupFields

const renderGroups = (args: GroupArgs, groups: GroupNumber) =>
  groupNumbers
    .slice(0, groups)
    .map((group) => (
      <LevelIndicatorGroup key={group} {...getGroupProps(args, group)} />
    ))

// A group that isn't shown can't be edited.
const useShownSelectedGroup = (
  selectedGroup: GroupNumber,
  groups: GroupNumber
) => {
  const [, updateArgs] = useArgs<LevelIndicatorStoryArgs>()

  React.useEffect(() => {
    if (selectedGroup > groups) updateArgs({ selectedGroup: groups })
  }, [groups, selectedGroup, updateArgs])
}

const meta = {
  title: "Components/Level Indicator",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Shows a level as rows of items. Mirrors the three Figma levels: Level Indicator Label adds the text around the indicator, Level Indicator sets Size and holds the groups, and each Level Indicator Group has its own Count, Active and Color.",
      },
    },
  },
  args: {
    labelPosition: "top",
    showLabelLeft: false,
    labelLeft: "Label",
    showLabelRight: false,
    labelRight: "Value",
    groups: 1,
    size: "medium",
    selectedGroup: 1,
    ...groupArgs,
  },
  argTypes: {
    labelPosition: {
      description:
        "Figma Label Position: where the labels sit around the indicator.",
      control: "select",
      options: labelPositions,
      ...inLabel("string"),
    },
    showLabelLeft: {
      description:
        "Figma Show Label Left. With both off, the indicator shows on its own, like without a `LevelIndicatorLabel`.",
      control: "boolean",
      ...inLabel("boolean"),
    },
    labelLeft: {
      description: "The text on the left of the indicator.",
      control: "text",
      if: { arg: "showLabelLeft" },
      ...inLabel("ReactNode"),
    },
    showLabelRight: {
      description: "Figma Show Label Right.",
      control: "boolean",
      ...inLabel("boolean"),
    },
    labelRight: {
      description: "The text on the right of the indicator.",
      control: "text",
      if: { arg: "showLabelRight" },
      ...inLabel("ReactNode"),
    },
    groups: {
      description:
        "Figma Groups. In code, one `LevelIndicatorGroup` child per group.",
      control: "select",
      options: [1, 2, 3],
      ...inIndicator("children"),
    },
    size: {
      description: "The item width of every group.",
      control: "select",
      options: sizes,
      ...inIndicator("string"),
    },
    selectedGroup: {
      name: "group",
      description:
        "The group that the controls below edit. It can't go past `groups`. In code, each `LevelIndicatorGroup` has its own props.",
      control: "select",
      options: groupNumbers,
      ...inGroup("number"),
    },
    ...groupArgTypes,
  },
  // `args` leaves out the hidden controls, `allArgs` has the three groups.
  render: function Render(
    {
      labelPosition,
      showLabelLeft,
      labelLeft,
      showLabelRight,
      labelRight,
      groups,
      size,
      selectedGroup,
    },
    { allArgs }
  ) {
    useShownSelectedGroup(selectedGroup, groups)

    return (
      <LevelIndicatorLabel
        labelPosition={labelPosition}
        showLabelLeft={showLabelLeft}
        labelLeft={labelLeft}
        showLabelRight={showLabelRight}
        labelRight={labelRight}
      >
        <LevelIndicator size={size}>
          {renderGroups(allArgs, groups)}
        </LevelIndicator>
      </LevelIndicatorLabel>
    )
  },
} satisfies Meta<LevelIndicatorStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithLabel: Story = {
  args: { showLabelLeft: true, showLabelRight: true, groups: 3 },
  argTypes: hideControls("labelPosition"),
  render: function Render(
    {
      showLabelLeft,
      labelLeft,
      showLabelRight,
      labelRight,
      groups,
      size,
      selectedGroup,
    },
    { allArgs }
  ) {
    useShownSelectedGroup(selectedGroup, groups)

    return (
      <div className="flex flex-col gap-6">
        {labelPositions.map((labelPosition) => (
          <LevelIndicatorLabel
            key={labelPosition}
            labelPosition={labelPosition}
            showLabelLeft={showLabelLeft}
            labelLeft={labelLeft}
            showLabelRight={showLabelRight}
            labelRight={labelRight}
          >
            <LevelIndicator size={size}>
              {renderGroups(allArgs, groups)}
            </LevelIndicator>
          </LevelIndicatorLabel>
        ))}
      </div>
    )
  },
}

export const Groups: Story = {
  argTypes: hideControls(...labelControls, "groups"),
  render: ({ size }, { allArgs }) => (
    <div className="flex flex-col gap-4">
      {groupNumbers.map((groups) => (
        <LevelIndicator key={groups} size={size}>
          {renderGroups(allArgs, groups)}
        </LevelIndicator>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  argTypes: hideControls(...labelControls, "size"),
  render: function Render({ groups, selectedGroup }, { allArgs }) {
    useShownSelectedGroup(selectedGroup, groups)

    return (
      <div className="flex flex-col gap-4">
        {sizes.map((size) => (
          <LevelIndicator key={size} size={size}>
            {renderGroups(allArgs, groups)}
          </LevelIndicator>
        ))}
      </div>
    )
  },
}

export const Colors: Story = {
  argTypes: hideControls(
    ...labelControls,
    "groups",
    "selectedGroup",
    "group1Color",
    "group2Count",
    "group2Active",
    "group2Color",
    "group3Count",
    "group3Active",
    "group3Color"
  ),
  render: ({ size, group1Count, group1Active }) => (
    <div className="flex flex-col gap-4">
      {colors.map((color) => (
        <LevelIndicator key={color} size={size}>
          <LevelIndicatorGroup
            count={group1Count}
            active={group1Active}
            color={color}
          />
        </LevelIndicator>
      ))}
    </div>
  ),
}
