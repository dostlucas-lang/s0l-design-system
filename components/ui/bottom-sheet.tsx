"use client"

import * as React from "react"
import { Drawer as BottomSheetPrimitive } from "@base-ui/react/drawer"
import { Cancel01Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Backdrop } from "@/components/ui/backdrop"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@/components/ui/icon"

// Mirrors the Figma Bottom Sheet: a panel pinned to the bottom of the screen
// with Handler, Header (Title + close), Search, a scrolling Body (the Slot)
// and Footer, each one optional. Built on the Base UI Drawer (the shadcn
// Sheet), so it can be dragged down by the Handler to close.
//
// Content=Custom is this component, and the Date Picker uses it for
// Mobile=True. The Mobile=True Dropdown keeps its Base UI Menu popup (its
// items need the menu) and reuses the surface classes exported below, so it
// looks the same but can't be dragged.

// Background/Primary, Border/Secondary, 16px top corners and Shadow/Large.
const surfaceClassName =
  "flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-t-xl border border-b-0 border-border-secondary bg-background-primary text-text-primary shadow-lg outline-none"

// Floating popups (Menu) pinned to the bottom of the screen: the !important
// classes beat the floating position.
const bottomSheetPositionerClassName =
  "isolate z-50 outline-none fixed! inset-x-0! top-auto! bottom-0! transform-none!"

// The surface for floating popups, sliding up from the bottom.
const bottomSheetPopupClassName = cn(
  surfaceClassName,
  "z-50 duration-200 data-open:animate-in data-open:slide-in-from-bottom data-closed:animate-out data-closed:slide-out-to-bottom"
)

// Body: 20px on the sides and bottom.
const bottomSheetBodyClassName = "px-5 pb-5"

// Footer: Border/Secondary on top, 20 / 16px padding, actions 12px apart.
const bottomSheetFooterClassName =
  "flex shrink-0 items-center justify-end gap-3 border-t border-border-secondary px-5 py-4"

// Handler: a 32 × 4 Icon/Primary bar at 30% in an 8px band.
function BottomSheetHandler({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      data-slot="bottom-sheet-handler"
      className={cn(
        "flex shrink-0 cursor-grab justify-center py-2 active:cursor-grabbing",
        className
      )}
    >
      <span className="h-1 w-8 rounded-full bg-icon-primary opacity-30" />
    </div>
  )
}

function BottomSheet({
  ...props
}: Omit<BottomSheetPrimitive.Root.Props, "swipeDirection">) {
  return (
    <BottomSheetPrimitive.Root
      data-slot="bottom-sheet"
      swipeDirection="down"
      {...props}
    />
  )
}

function BottomSheetTrigger({ ...props }: BottomSheetPrimitive.Trigger.Props) {
  return (
    <BottomSheetPrimitive.Trigger data-slot="bottom-sheet-trigger" {...props} />
  )
}

function BottomSheetClose({ ...props }: BottomSheetPrimitive.Close.Props) {
  return (
    <BottomSheetPrimitive.Close data-slot="bottom-sheet-close" {...props} />
  )
}

// The Backdrop fades with the drag, like the shadcn Sheet.
function BottomSheetOverlay({
  className,
  ...props
}: BottomSheetPrimitive.Backdrop.Props) {
  return (
    <BottomSheetPrimitive.Backdrop
      data-slot="bottom-sheet-overlay"
      render={<Backdrop />}
      className={cn(
        "min-h-dvh opacity-[calc(1-var(--drawer-swipe-progress,0))] duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:pointer-events-none data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-swiping:duration-0",
        className
      )}
      {...props}
    />
  )
}

function BottomSheetContent({
  className,
  children,
  showHandler = true,
  ...props
}: BottomSheetPrimitive.Popup.Props & {
  /** Figma Show Handler: also the area that drags the sheet down. */
  showHandler?: boolean
}) {
  return (
    <BottomSheetPrimitive.Portal>
      <BottomSheetOverlay />
      <BottomSheetPrimitive.Viewport
        data-slot="bottom-sheet-viewport"
        className="pointer-events-none fixed inset-0 z-50"
      >
        <BottomSheetPrimitive.Popup
          data-slot="bottom-sheet-content"
          className={cn(
            surfaceClassName,
            "pointer-events-auto fixed inset-x-0 bottom-0 z-50 origin-bottom select-none",
            // Follows the finger while dragging and slides from below.
            "transform-[translate3d(0,var(--translate-y),0)] transition-transform duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform [--closed-transform:translate3d(0,calc(100%+2px),0)] [--translate-y:var(--drawer-swipe-movement-y,0px)]",
            "data-ending-style:transform-(--closed-transform) data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-starting-style:transform-(--closed-transform) data-swiping:duration-0",
            className
          )}
          {...props}
        >
          {showHandler && <BottomSheetHandler />}
          <BottomSheetPrimitive.Content
            data-slot="bottom-sheet-inner"
            className="flex min-h-0 flex-1 flex-col overflow-hidden select-text"
          >
            {children}
          </BottomSheetPrimitive.Content>
        </BottomSheetPrimitive.Popup>
      </BottomSheetPrimitive.Viewport>
    </BottomSheetPrimitive.Portal>
  )
}

// Figma Header: the Title with 20px padding and the ghost close button
// 12px from the top-right corner.
function BottomSheetHeader({
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
      data-slot="bottom-sheet-header"
      className={cn("flex shrink-0 items-start", className)}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center p-5">{children}</div>
      {showCloseButton && (
        <div className="flex py-3 pr-3">
          <BottomSheetPrimitive.Close
            data-slot="bottom-sheet-close"
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
          </BottomSheetPrimitive.Close>
        </div>
      )}
    </div>
  )
}

// Figma "Heading/Small" title in Text/Primary.
function BottomSheetTitle({
  className,
  ...props
}: BottomSheetPrimitive.Title.Props) {
  return (
    <BottomSheetPrimitive.Title
      data-slot="bottom-sheet-title"
      className={cn("min-w-0 text-heading-small text-text-primary", className)}
      {...props}
    />
  )
}

// Figma Search: an Input Search with 20 / 12px padding.
function BottomSheetSearch({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bottom-sheet-search"
      className={cn("shrink-0 px-5 py-3", className)}
      {...props}
    />
  )
}

// Figma Body (the Slot): scrolls on overflow with the Figma Scroll Bar
// colors (Background/Inverse/Default thumb on a Background/Secondary track).
function BottomSheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bottom-sheet-body"
      className={cn(
        "flex min-h-0 flex-1 [scrollbar-width:thin] [scrollbar-color:var(--s0l-background-inverse-default)_var(--s0l-background-secondary)] flex-col overflow-y-auto overscroll-contain text-body-medium",
        bottomSheetBodyClassName,
        className
      )}
      {...props}
    />
  )
}

// Figma Footer (.Actions Footer): give the ghost Action 3
// `className="mr-auto"` to pin it to the start, as in Figma.
function BottomSheetFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bottom-sheet-footer"
      className={cn(bottomSheetFooterClassName, className)}
      {...props}
    />
  )
}

export {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetClose,
  BottomSheetOverlay,
  BottomSheetContent,
  BottomSheetHandler,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetSearch,
  BottomSheetBody,
  BottomSheetFooter,
  // Shared with the Mobile=True Dropdown.
  bottomSheetBodyClassName,
  bottomSheetFooterClassName,
  bottomSheetPopupClassName,
  bottomSheetPositionerClassName,
}
