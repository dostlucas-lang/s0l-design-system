import { Mail01Icon } from "@hugeicons/core-free-icons"

import { findHugeicon } from "../hugeicons"

// The Figma Show Icon and Icon props of the Inputs, shared by their stories.
// `icon` is a Hugeicons name; the components take the icon itself.
export type LeadingIconArgs = {
  showIcon?: boolean
  icon?: string
}

export const leadingIconArgs = {
  showIcon: false,
  icon: "Mail",
}

export const leadingIconArgTypes = {
  showIcon: {
    description: "Figma Show Icon: pass a Hugeicons icon in `icon`.",
    control: "boolean",
    table: { type: { summary: "boolean" } },
  },
  icon: {
    description: "Any Hugeicons name (e.g. Mail, User, Settings 01).",
    control: "text",
    if: { arg: "showIcon" },
    table: { type: { summary: "IconSvgElement" } },
  },
} as const

export const getLeadingIcon = ({ showIcon, icon }: LeadingIconArgs) =>
  showIcon ? (findHugeicon(icon) ?? Mail01Icon) : undefined
