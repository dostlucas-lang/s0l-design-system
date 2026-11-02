"use client"

import * as React from "react"
import { Dialog as ModalPrimitive } from "@base-ui/react/dialog"
import { Cancel01Icon } from "@hugeicons/core-free-icons"

import { Backdrop } from "@/components/ui/backdrop"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

// Mirrors the Figma Modal: a centered 496px card with Header (Title + close),
// a scrolling Body and an optional Footer (.Actions Footer). Content=Text puts
// a ModalDescription in the Body; Content=Custom puts any content (the Slot).
function Modal({ ...props }: ModalPrimitive.Root.Props) {
  return <ModalPrimitive.Root data-slot="modal" {...props} />
}

function ModalTrigger({ ...props }: ModalPrimitive.Trigger.Props) {
  return <ModalPrimitive.Trigger data-slot="modal-trigger" {...props} />
}

function ModalClose({ ...props }: ModalPrimitive.Close.Props) {
  return <ModalPrimitive.Close data-slot="modal-close" {...props} />
}

function ModalPortal({ ...props }: ModalPrimitive.Portal.Props) {
  return <ModalPrimitive.Portal data-slot="modal-portal" {...props} />
}

function ModalOverlay({ ...props }: ModalPrimitive.Backdrop.Props) {
  return (
    <ModalPrimitive.Backdrop
      data-slot="modal-overlay"
      render={<Backdrop />}
      {...props}
    />
  )
}

// Background/Primary, Border/Secondary, Border/Radius/Medium, Shadow/X-Large.
function ModalContent({
  className,
  children,
  ...props
}: ModalPrimitive.Popup.Props) {
  return (
    <ModalPortal>
      <ModalOverlay />
      <ModalPrimitive.Popup
        data-slot="modal-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[min(496px,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-md border border-border-secondary bg-background-primary text-text-primary shadow-xl transition duration-150 ease-in-out outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
          className
        )}
        {...props}
      >
        {children}
      </ModalPrimitive.Popup>
    </ModalPortal>
  )
}

// Title on the left (24px padding), close button top-right (16px padding).
function ModalHeader({
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
      data-slot="modal-header"
      className={cn("flex shrink-0 items-start", className)}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4 p-6">
        {children}
      </div>
      {showCloseButton && (
        <div className="flex py-4 pr-4">
          <ModalPrimitive.Close
            data-slot="modal-close"
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
          </ModalPrimitive.Close>
        </div>
      )}
    </div>
  )
}

// Figma "Heading/Small" title in Text/Primary.
function ModalTitle({ className, ...props }: ModalPrimitive.Title.Props) {
  return (
    <ModalPrimitive.Title
      data-slot="modal-title"
      className={cn("min-w-0 text-heading-small text-text-primary", className)}
      {...props}
    />
  )
}

// Body: 24px side/bottom padding; scrolls on overflow with the Figma Scroll
// Bar colors (Background/Inverse/Default thumb on a Background/Secondary track).
function ModalBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-body"
      className={cn(
        "flex min-h-0 flex-1 [scrollbar-width:thin] [scrollbar-color:var(--s0l-background-inverse-default)_var(--s0l-background-secondary)] flex-col overflow-y-auto px-6 pb-6 text-body-medium",
        className
      )}
      {...props}
    />
  )
}

// Content=Text: "Body/Medium" text in Text/Primary.
function ModalDescription({
  className,
  ...props
}: ModalPrimitive.Description.Props) {
  return (
    <ModalPrimitive.Description
      data-slot="modal-description"
      className={cn("text-body-medium text-text-primary", className)}
      {...props}
    />
  )
}

// Figma .Actions Footer: actions 16px apart, aligned to the end. Give the
// ghost Action 3 `className="mr-auto"` to pin it to the start, as in Figma.
function ModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-footer"
      className={cn(
        "flex shrink-0 flex-wrap items-center justify-end gap-4 px-6 pb-6",
        className
      )}
      {...props}
    />
  )
}

export {
  Modal,
  ModalTrigger,
  ModalClose,
  ModalPortal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalDescription,
  ModalFooter,
}
