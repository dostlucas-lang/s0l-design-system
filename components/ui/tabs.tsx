"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon, type IconSvgElement } from "@/components/ui/icon"

// Mirrors the Figma Tabs component: Level (Primary / Secondary) × Count, with
// the .Tab Primary and .Tab Secondary partials as triggers:
// State (Default / Hover / Disabled) × Active, plus Show Icon and Show Badge.
// - Primary: 48px tabs on a Border/Primary bottom line; the active one turns
//   Text/Accent/Standard with a 4px Background/Accent/Strong ribbon.
// - Secondary: 40px pills 8px apart; the active one gets
//   Background/Accent/Soft and Text/Accent/Standard.
// Hover paints Background/Hover on inactive tabs. Count is simply the number
// of TabsTrigger children.
type TabsLevel = "primary" | "secondary"

const TabsLevelContext = React.createContext<TabsLevel>("primary")

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  level = "primary",
  ...props
}: TabsPrimitive.List.Props & {
  /** Figma "Level". */
  level?: TabsLevel
}) {
  return (
    <TabsLevelContext.Provider value={level}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-level={level}
        className={cn(
          "flex w-fit items-center",
          level === "primary" ? "border-b border-border-primary" : "gap-2",
          className
        )}
        {...props}
      />
    </TabsLevelContext.Provider>
  )
}

const triggerLevels = {
  // The tab overlaps the list's bottom line so the ribbon covers it.
  primary: {
    tab: "-mb-px min-h-12 rounded-t-md px-2 text-label-medium after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:rounded-t-sm after:bg-background-accent-strong after:opacity-0 data-active:after:opacity-100",
    icon: "pl-1.5 [&_svg]:size-5",
    label: "px-2",
    badge: "pr-1.5",
  },
  secondary: {
    tab: "min-h-10 rounded-md px-3 text-label-small data-active:bg-background-accent-soft",
    icon: "pr-0.5 pl-1 [&_svg]:size-4",
    label: "px-1",
    badge: "pr-1 pl-0.5",
  },
}

function TabsTrigger({
  className,
  icon,
  badge,
  children,
  ...props
}: TabsPrimitive.Tab.Props & {
  /** Figma "Show Icon": a Hugeicons icon before the label. */
  icon?: IconSvgElement
  /** Figma "Show Badge": a count after the label. */
  badge?: React.ReactNode
}) {
  const level = React.useContext(TabsLevelContext)
  const styles = triggerLevels[level]

  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "group/tabs-trigger relative inline-flex shrink-0 items-center whitespace-nowrap text-text-secondary transition-colors outline-none select-none",
        "not-data-active:not-data-disabled:hover:bg-background-hover data-disabled:cursor-not-allowed data-disabled:text-text-disabled data-active:text-text-accent-standard",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-border-accent-strong focus-visible:outline-solid",
        styles.tab,
        className
      )}
      {...props}
    >
      {icon && (
        <span
          data-slot="tabs-trigger-icon"
          className={cn(
            "flex shrink-0 text-icon-secondary group-data-disabled/tabs-trigger:text-icon-disabled group-data-active/tabs-trigger:text-icon-accent-standard",
            styles.icon
          )}
        >
          <HugeiconsIcon icon={icon} />
        </span>
      )}
      <span data-slot="tabs-trigger-label" className={cn("flex", styles.label)}>
        {children}
      </span>
      {badge != null && (
        <span
          data-slot="tabs-trigger-badge"
          className={cn("flex", styles.badge)}
        >
          <TabsBadge>{badge}</TabsBadge>
        </span>
      )}
    </TabsPrimitive.Tab>
  )
}

// Figma Badge inside a tab: the Accent Badge with a count, Background/
// Disabled/Strong when the tab is disabled.
function TabsBadge({
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "color">) {
  return (
    <Badge
      data-slot="tabs-badge"
      color="accent"
      className={cn(
        "group-data-disabled/tabs-trigger:bg-background-disabled-strong",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn(
        "flex-1 text-body-medium text-text-primary outline-none",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, type TabsLevel }
