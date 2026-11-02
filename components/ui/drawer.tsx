"use client"

import * as React from "react"
import { Dialog as DrawerPrimitive } from "@base-ui/react/dialog"
import { Cancel01Icon } from "@hugeicons/core-free-icons"

import { Backdrop } from "@/components/ui/backdrop"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

// Mirrors the Figma Drawer: a 460px side panel with Header (Title + close),
// a scrolling Body (the Slot) and an optional Footer (.Actions Footer).
function Drawer({ ...props }: DrawerPrimitive.Root.Props) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerOverlay({ ...props }: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      render={<Backdrop />}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  side = "right",
  ...props
}: DrawerPrimitive.Popup.Props & {
  /** Figma shows the right side; the other edges reuse the same styles. */
  side?: "top" | "right" | "bottom" | "left"
}) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Popup
        data-slot="drawer-content"
        data-side={side}
        className={cn(
          "fixed z-50 flex flex-col border-border-primary bg-background-primary text-text-primary shadow-xl transition duration-200 ease-in-out outline-none data-ending-style:opacity-0 data-starting-style:opacity-0",
          "data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:w-[min(460px,100%)] data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem]",
          "data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:w-[min(460px,100%)] data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem]",
          "data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:max-h-[80svh] data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem]",
          "data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:max-h-[80svh] data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem]",
          className
        )}
        {...props}
      >
        {children}
      </DrawerPrimitive.Popup>
    </DrawerPortal>
  )
}

// Title on the left (24px padding), close button top-right (16px padding).
function DrawerHeader({
  className,
  children,
  showCloseButton = true,
  closeLabel = "Close",
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
  closeLabel?: string
}) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex shrink-0 items-start", className)}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4 p-6">
        {children}
      </div>
      {showCloseButton && (
        <div className="flex py-4 pr-4">
          <DrawerPrimitive.Close
            data-slot="drawer-close"
            render={
              <Button
                variant="ghost"
                size="md"
                iconOnly
                className="text-icon-primary"
              />
            }
          >
            <HugeiconsIcon icon={Cancel01Icon} />
            <span className="sr-only">{closeLabel}</span>
          </DrawerPrimitive.Close>
        </div>
      )}
    </div>
  )
}

// Figma "Heading/Small" title in Text/Primary.
function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("min-w-0 text-heading-small text-text-primary", className)}
      {...props}
    />
  )
}

// The Slot: scrolls on overflow with the Figma Scroll Bar colors
// (Background/Inverse/Default thumb on a Background/Secondary track).
function DrawerBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-body"
      className={cn(
        "flex min-h-0 flex-1 [scrollbar-width:thin] [scrollbar-color:var(--s0l-background-inverse-default)_var(--s0l-background-secondary)] flex-col gap-6 overflow-y-auto px-6 text-body-medium last:pb-6",
        className
      )}
      {...props}
    />
  )
}

// Figma .Actions Footer: actions 16px apart, aligned to the end. Give the
// ghost Action 3 `className="mr-auto"` to pin it to the start, as in Figma.
function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "flex shrink-0 flex-wrap items-center justify-end gap-4 bg-background-primary p-6",
        className
      )}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
}
