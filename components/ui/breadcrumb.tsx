import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"

import { HugeiconsIcon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

// Mirrors the Figma Breadcrumbs component. Its "Property 1" (2–6 items) is
// just how many items you compose; each item follows .Breadcrumbs Item:
// Default / Hover / Disabled for links and Active for the current page.
function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn(className)}
      {...props}
    />
  )
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center", className)}
      {...props}
    />
  )
}

const itemClassName =
  "inline-flex h-6 items-center rounded-sm text-label-medium outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-border-accent-strong focus-visible:outline-solid"

// Hover is a 1.4px bottom stroke (Icon/Secondary), not a text underline.
function BreadcrumbLink({
  className,
  render,
  disabled = false,
  ...props
}: useRender.ComponentProps<"a"> & {
  /** Figma State=Disabled. */
  disabled?: boolean
}) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          itemClassName,
          "text-text-secondary transition-shadow hover:shadow-[inset_0_-1.4px_0_0_var(--s0l-icon-secondary)] data-disabled:pointer-events-none data-disabled:text-text-disabled",
          className
        ),
        ...(disabled && {
          "aria-disabled": true,
          tabIndex: -1,
          "data-disabled": "",
        }),
      },
      props
    ),
    render,
    state: {
      slot: "breadcrumb-link",
    },
  })
}

// Figma State=Active.
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(itemClassName, "text-text-primary", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("flex text-icon-secondary [&>svg]:size-5", className)}
      {...props}
    >
      {children ?? <HugeiconsIcon icon={ArrowRight01Icon} />}
    </li>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
}
