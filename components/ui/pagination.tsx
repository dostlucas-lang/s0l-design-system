"use client"

import * as React from "react"
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@/components/ui/icon"

// Mirrors the Figma Pagination component: Type (Buttons / Simple) × Size
// (Small / Medium) × Page Count (≤ 7 / > 7) × Current Page (First / Mid /
// Last). `Pagination` builds the whole thing from `page` and `pageCount`;
// the parts below compose custom layouts.
//
// - Buttons: Button Ghost arrows, .Pagination Button pages (Button Primary
//   colors on the current one) and Pagination Ellipsis, 8px apart.
// - Simple (Medium only): arrows around "Página 1 | 1 a 5 de 50 itens".

type PaginationSize = "sm" | "md"

const PaginationSizeContext = React.createContext<PaginationSize>("md")

// Figma Page Count: up to 7 pages show them all; past that the list keeps 7
// slots, the first and last page plus the current one with its neighbours,
// and an ellipsis for each gap.
function getPaginationRange(page: number, pageCount: number) {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }
  if (page <= 4) return [1, 2, 3, 4, 5, "ellipsis", pageCount] as const
  if (page >= pageCount - 3) {
    return [
      1,
      "ellipsis",
      pageCount - 4,
      pageCount - 3,
      pageCount - 2,
      pageCount - 1,
      pageCount,
    ] as const
  }
  return [
    1,
    "ellipsis",
    page - 1,
    page,
    page + 1,
    "ellipsis",
    pageCount,
  ] as const
}

type PaginationLabels = {
  /** Accessible name of the previous arrow. */
  previous?: string
  /** Accessible name of the next arrow. */
  next?: string
  /** Simple: text before the current page. */
  page?: string
  /** Simple: between the first and last item of the page. */
  to?: string
  /** Simple: before the item count. */
  of?: string
  /** Simple: after the item count. */
  items?: string
}

const defaultLabels: Required<PaginationLabels> = {
  previous: "Previous page",
  next: "Next page",
  page: "Página",
  to: "a",
  of: "de",
  items: "itens",
}

type PaginationProps = Omit<React.ComponentProps<"nav">, "onChange"> & {
  /** Figma Type. */
  type?: "buttons" | "simple"
  /** Figma Size. Simple only exists in Medium. */
  size?: PaginationSize
  /** The current page, starting at 1. */
  page: number
  pageCount: number
  onPageChange?: (page: number) => void
  /** Renders the pages as links instead of buttons. */
  getPageHref?: (page: number) => string
  /** Simple: total number of items. */
  itemCount?: number
  /** Simple: items per page. */
  pageSize?: number
  labels?: PaginationLabels
}

function Pagination({
  type = "buttons",
  size = "md",
  page,
  pageCount,
  onPageChange,
  getPageHref,
  itemCount = 0,
  pageSize = 1,
  labels,
  ...props
}: PaginationProps) {
  const text = { ...defaultLabels, ...labels }
  const clamp = (next: number) => Math.min(Math.max(next, 1), pageCount)
  const target = (next: number) =>
    getPageHref
      ? {
          href: getPageHref(clamp(next)),
          onClick: () => onPageChange?.(clamp(next)),
        }
      : { onClick: () => onPageChange?.(clamp(next)) }

  return (
    <PaginationRoot size={type === "simple" ? "md" : size} {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-label={text.previous}
            {...target(page - 1)}
          />
        </PaginationItem>
        {type === "simple" ? (
          <PaginationItem>
            <PaginationSummary
              page={page}
              from={Math.min((page - 1) * pageSize + 1, itemCount)}
              to={Math.min(page * pageSize, itemCount)}
              itemCount={itemCount}
              labels={text}
            />
          </PaginationItem>
        ) : (
          getPaginationRange(page, pageCount).map((value, index) => (
            <PaginationItem key={`${value}-${index}`}>
              {value === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink isActive={value === page} {...target(value)}>
                  {value}
                </PaginationLink>
              )}
            </PaginationItem>
          ))
        )}
        <PaginationItem>
          <PaginationNext aria-label={text.next} {...target(page + 1)} />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  )
}

function PaginationRoot({
  className,
  size = "md",
  ...props
}: React.ComponentProps<"nav"> & { size?: PaginationSize }) {
  return (
    <PaginationSizeContext.Provider value={size}>
      <nav
        aria-label="pagination"
        data-slot="pagination"
        data-size={size}
        className={cn("flex", className)}
        {...props}
      />
    </PaginationSizeContext.Provider>
  )
}

// Items 8px apart.
function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" className="flex" {...props} />
}

type PaginationControlProps = Omit<
  React.ComponentProps<typeof Button>,
  "variant" | "size" | "iconOnly" | "render" | "nativeButton"
> & {
  /** Renders a link instead of a button. */
  href?: string
}

// A Button that renders as a link when given an href.
function PaginationControl({
  href,
  ...props
}: PaginationControlProps & {
  variant: "primary" | "ghost"
  iconOnly?: boolean
}) {
  const size = React.useContext(PaginationSizeContext)
  return (
    <Button
      size={size}
      {...(href
        ? { nativeButton: false, render: <a href={href} /> }
        : { type: "button" as const })}
      {...props}
    />
  )
}

// Figma .Pagination Button (Small 32px / Medium 40px): at least square, 4px
// padding for wider numbers, Label/Small or Label/Medium in Button Ghost
// colors; the current page takes Button Primary colors.
function PaginationLink({
  className,
  isActive,
  ...props
}: PaginationControlProps & { isActive?: boolean }) {
  const size = React.useContext(PaginationSizeContext)
  return (
    <PaginationControl
      variant={isActive ? "primary" : "ghost"}
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive || undefined}
      className={cn("px-1", size === "sm" ? "min-w-8" : "min-w-10", className)}
      {...props}
    />
  )
}

// Figma Button Ghost with Arrow Left (16px Small / 20px Medium).
function PaginationPrevious({ children, ...props }: PaginationControlProps) {
  return (
    <PaginationControl
      variant="ghost"
      iconOnly
      aria-label="Previous page"
      data-slot="pagination-previous"
      {...props}
    >
      {children ?? <HugeiconsIcon icon={ArrowLeft02Icon} />}
    </PaginationControl>
  )
}

// Figma Button Ghost with Arrow Right (16px Small / 20px Medium).
function PaginationNext({ children, ...props }: PaginationControlProps) {
  return (
    <PaginationControl
      variant="ghost"
      iconOnly
      aria-label="Next page"
      data-slot="pagination-next"
      {...props}
    >
      {children ?? <HugeiconsIcon icon={ArrowRight02Icon} />}
    </PaginationControl>
  )
}

// Figma Pagination Ellipsis: more-horizontal in Icon/Disabled, in a square
// the size of a page button.
function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const size = React.useContext(PaginationSizeContext)
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex items-center justify-center text-icon-disabled",
        size === "sm" ? "size-8 [&_svg]:size-4" : "size-10 [&_svg]:size-5",
        className
      )}
      {...props}
    >
      <HugeiconsIcon icon={MoreHorizontalIcon} />
    </span>
  )
}

// Figma Type=Simple: "Página 1 | 1 a 5 de 50 itens" in Body/Medium,
// Text/Primary, numbers in bold, words 6px apart and a 24px Border/Primary
// divider between the two halves.
function PaginationSummary({
  className,
  page,
  from,
  to,
  itemCount,
  labels,
  ...props
}: React.ComponentProps<"p"> & {
  page: number
  from: number
  to: number
  itemCount: number
  labels?: PaginationLabels
}) {
  const text = { ...defaultLabels, ...labels }
  const strong = "font-(--s0l-text-font-weight-bold)"
  return (
    <p
      data-slot="pagination-summary"
      aria-live="polite"
      className={cn(
        "flex items-center gap-2 text-body-medium whitespace-nowrap text-text-primary",
        className
      )}
      {...props}
    >
      <span className="flex gap-1.5">
        {text.page} <span className={strong}>{page}</span>
      </span>
      <span aria-hidden className="h-6 w-px bg-border-primary" />
      <span className="flex gap-1.5">
        <span className={strong}>{from}</span> {text.to}{" "}
        <span className={strong}>{to}</span> {text.of}{" "}
        <span className={strong}>{itemCount}</span> {text.items}
      </span>
    </p>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationRoot,
  PaginationSummary,
  getPaginationRange,
  type PaginationProps,
}
