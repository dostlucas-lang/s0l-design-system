"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { HugeiconsIcon, type IconSvgElement } from "@/components/ui/icon"

// Mirrors the Figma Tile: Size (Small / Medium / Large) × State (Default /
// Hover / Disabled) + Focus.
// - The surface is Background/Surface with Shadow/Small, Border/Radius/Medium
//   corners and an Inside Border/Secondary stroke (an inset ring, so it takes
//   no room).
// - Hover is Background/Hover, an overlay painted by ::after on top of the
//   surface (like the stacked Figma fills).
// - Disabled stacks Background/Disabled/Soft instead, with the
//   Border/Disabled/Soft stroke, no shadow, and the icon and label in
//   Icon/Disabled and Text/Disabled.
// - Focus is the 3px Border/Accent/Strong ring, 2px away from the surface.
// - The icon is 20px in Icon/Primary.
const tileSurfaceVariants = cva(
  "relative isolate flex rounded-md bg-background-surface shadow-sm inset-ring inset-ring-border-secondary group-focus-visible/tile:outline-3 group-focus-visible/tile:outline-offset-2 group-focus-visible/tile:outline-border-accent-strong group-focus-visible/tile:outline-solid group-data-disabled/tile:shadow-none group-data-disabled/tile:inset-ring-border-disabled-soft after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] group-hover/tile:after:bg-background-hover group-data-pressed/tile:after:bg-background-hover group-data-disabled/tile:after:bg-background-disabled-soft",
  {
    variants: {
      size: {
        // Small: a 56px square with the icon in the middle; the label sits
        // under it, outside the surface.
        sm: "size-14 items-center justify-center p-3",
        // Medium: a 96px square, icon at the top and Label/Small at the
        // bottom, both on the left.
        md: "size-24 flex-col items-start justify-between p-3",
        // Large: 117–144px wide, at least 92px tall, icon over a centered
        // Label/Medium, 16px apart.
        lg: "min-h-23 w-full min-w-[117px] flex-col items-center justify-center gap-4 px-3 py-2",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
)

const tileLabelVariants = cva(
  "text-text-primary group-data-disabled/tile:text-text-disabled",
  {
    variants: {
      size: {
        sm: "w-full text-center text-label-small",
        md: "w-full text-left text-label-small",
        lg: "w-full text-center text-label-medium",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
)

type TileProps = Omit<useRender.ComponentProps<"button">, "children"> &
  VariantProps<typeof tileSurfaceVariants> & {
    /** Figma Icon: any Hugeicons icon, 20px. */
    icon: IconSvgElement
    /** Figma Label. */
    label: React.ReactNode
    /** Figma State=Disabled. */
    disabled?: boolean
  }

/**
 * A shortcut to an action or a page. Renders a `<button>`; pass `render`
 * (an `<a>` or a Next.js `<Link>`) to navigate instead.
 */
function Tile({
  className,
  size = "sm",
  icon,
  label,
  disabled = false,
  render,
  ...props
}: TileProps) {
  const isButton = render == null

  const iconElement = (
    <HugeiconsIcon
      data-slot="tile-icon"
      icon={icon}
      aria-hidden="true"
      className="size-5 shrink-0 text-icon-primary group-data-disabled/tile:text-icon-disabled"
    />
  )
  const labelElement = (
    <span data-slot="tile-label" className={tileLabelVariants({ size })}>
      {label}
    </span>
  )

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(
          "group/tile flex shrink-0 text-left outline-none select-none data-disabled:pointer-events-none",
          // Small: the surface and the label under it, 12px apart.
          size === "sm" && "w-14 flex-col items-center gap-3",
          size === "lg" && "max-w-36",
          className
        ),
        ...(isButton
          ? { type: "button", disabled }
          : // A link can't be disabled: take it out of the tab order instead.
            disabled && { "aria-disabled": true, tabIndex: -1 }),
        children:
          size === "sm" ? (
            <>
              <span
                data-slot="tile-surface"
                className={tileSurfaceVariants({ size })}
              >
                {iconElement}
              </span>
              {labelElement}
            </>
          ) : (
            <span
              data-slot="tile-surface"
              className={tileSurfaceVariants({ size })}
            >
              {iconElement}
              {labelElement}
            </span>
          ),
      },
      props
    ),
    render,
    state: {
      slot: "tile",
      size,
      disabled,
    },
  })
}

// Figma Tile Carousel: Button Ghost arrows at both ends, 16px from the Tiles,
// which sit 24px apart and scroll a page at a time. The arrows turn Disabled
// at the first and last page.
function TileCarousel({
  className,
  children,
  "aria-label": ariaLabel = "Shortcuts",
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Carousel
      data-slot="tile-carousel"
      opts={{
        loop: false,
        align: "start",
        containScroll: "trimSnaps",
        slidesToScroll: "auto",
      }}
      aria-label={ariaLabel}
      className={cn("flex-row items-center gap-4", className)}
      {...props}
    >
      <CarouselPrevious label="Previous tiles" />
      {/* 12px of room above and below, so the Tiles' shadow and focus ring
          aren't cut by the scroll area. */}
      <div className="-my-3 min-w-0 flex-1">
        <CarouselContent className="-ml-6 items-start py-3">
          {React.Children.map(children, (child) =>
            child == null || typeof child === "boolean" ? null : (
              <CarouselItem className="basis-auto pl-6">{child}</CarouselItem>
            )
          )}
        </CarouselContent>
      </div>
      <CarouselNext label="Next tiles" />
    </Carousel>
  )
}

export { Tile, TileCarousel, tileSurfaceVariants, type TileProps }
