"use client"

import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import {
  Alert02Icon,
  AlertCircleIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon, type IconSvgElement } from "@/components/ui/icon"
import { Spinner } from "@/components/ui/spinner"

// Mirrors the Figma Toast component: Color (Neutral / Accent / Info / Success
// / Warning / Danger) × Decoration (Icon / Avatar / Image), with Show Title,
// Show Actions (1 or 2) and Dismissable.
// - 380px wide on Background/Inverse/Default, Medium radius, text in
//   Text/Inverse: Title in bold, Description in Body/Medium.
// - Color: the `type` passed to toast.add(). Neutral (no type) has a white
//   icon; the others add a 6px ribbon and tint the icon with Toast/Icon/*.
//   "loading" shows the Spinner as the icon. "error" is kept as an alias of
//   "danger".
// - Decoration: the icon by default, `data.avatar` (a 32px Avatar) or
//   `data.image` (an 80px image along the left edge).
// - Actions: `actionProps` (Action 1) and `data.secondaryAction` (Action 2),
//   as Label/Medium text buttons 16px apart.
// - Button Close: a Button Inverse (32px, 16px X), 8px from the corner.
// Toasts shown at the same time are listed, not stacked on top of each other:
// the oldest on top, the newest at the bottom.
type ToastColor =
  "neutral" | "accent" | "info" | "success" | "warning" | "danger" | "loading"

type ToastData = {
  /** Decoration=Avatar: usually an <Avatar size="sm">. */
  avatar?: React.ReactNode
  /** Decoration=Image: the image URL. */
  image?: string
  imageAlt?: string
  /** Action 2, next to `actionProps`. */
  secondaryAction?: React.ComponentPropsWithoutRef<"button">
  /** Figma "Dismissable": set to false to hide Button Close. */
  dismissable?: boolean
}

const toast = ToastPrimitive.createToastManager<ToastData>()

function toastColor(type: string | undefined): ToastColor {
  if (type === "error") return "danger"
  if (
    type === "accent" ||
    type === "info" ||
    type === "success" ||
    type === "warning" ||
    type === "danger" ||
    type === "loading"
  ) {
    return type
  }
  return "neutral"
}

const toastIcons: Record<
  Exclude<ToastColor, "loading">,
  { icon: IconSvgElement; className: string; ribbon?: string }
> = {
  neutral: { icon: InformationCircleIcon, className: "text-icon-inverse" },
  accent: {
    icon: InformationCircleIcon,
    className: "text-toast-icon-accent",
    ribbon: "bg-toast-icon-accent",
  },
  info: {
    icon: InformationCircleIcon,
    className: "text-toast-icon-info",
    ribbon: "bg-toast-icon-info",
  },
  success: {
    icon: CheckmarkCircle02Icon,
    className: "text-toast-icon-success",
    ribbon: "bg-toast-icon-success",
  },
  warning: {
    icon: AlertCircleIcon,
    className: "text-toast-icon-warning",
    ribbon: "bg-toast-icon-warning",
  },
  danger: {
    icon: Alert02Icon,
    className: "text-toast-icon-danger",
    ribbon: "bg-toast-icon-danger",
  },
}

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        // Newest toast first in the list, so the column is reversed: the oldest
        // sits on top and the newest at the bottom, 12px apart.
        "pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto flex w-auto max-w-[380px] flex-col-reverse gap-3 outline-none sm:right-4 sm:left-auto sm:mx-0 sm:w-[380px]",
        className
      )}
      {...props}
    />
  )
}

function Toast({ className, ...props }: ToastPrimitive.Root.Props) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(
        "group/toast pointer-events-auto relative w-full shrink-0 overflow-hidden rounded-md bg-background-inverse-default text-text-inverse will-change-transform outline-none select-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-border-accent-strong focus-visible:outline-solid",
        "[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--toast-swipe-movement-y))] [transition:transform_300ms_cubic-bezier(0.22,1,0.36,1),opacity_300ms]",
        // Enters from below and fades out; a swipe throws it off that side.
        "data-ending-style:opacity-0 data-limited:hidden data-starting-style:[transform:translateY(100%)] data-starting-style:opacity-0",
        "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))]",
        "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))]",
        "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        className
      )}
      {...props}
    />
  )
}

// The row behind the ribbon or image, the body and Button Close.
function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn("flex items-stretch", className)}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn(
        "text-body-medium font-(--s0l-text-font-weight-bold) text-text-inverse",
        className
      )}
      {...props}
    />
  )
}

function ToastDescription({
  className,
  ...props
}: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-body-medium text-text-inverse", className)}
      {...props}
    />
  )
}

// Figma Action: a Label/Medium text button in Text/Inverse.
const toastActionClassName =
  "inline-flex min-h-5 shrink-0 cursor-pointer items-center rounded-xs text-label-medium text-text-inverse underline-offset-4 outline-none hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-border-accent-strong focus-visible:outline-solid"

function ToastAction({ className, ...props }: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={cn(toastActionClassName, className)}
      {...props}
    />
  )
}

function ToastClose({
  className,
  children,
  render = <Button variant="inverse" size="sm" iconOnly />,
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close toast"
      render={render}
      className={cn("shrink-0", className)}
      {...props}
    >
      {children ?? <HugeiconsIcon icon={Cancel01Icon} aria-hidden="true" />}
    </ToastPrimitive.Close>
  )
}

function ToastIcon({ color }: { color: ToastColor }) {
  return (
    <span
      data-slot="toast-icon"
      className="flex min-h-6 shrink-0 items-center [&_svg]:pointer-events-none"
    >
      {color === "loading" ? (
        <Spinner size={20} className="text-icon-inverse" aria-hidden="true" />
      ) : (
        <HugeiconsIcon
          icon={toastIcons[color].icon}
          aria-hidden="true"
          className={cn("size-5", toastIcons[color].className)}
        />
      )}
    </span>
  )
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager<ToastData>()

  return toasts.map((toastItem) => {
    const color = toastColor(toastItem.type)
    const data = toastItem.data ?? {}
    const ribbon = color === "loading" ? undefined : toastIcons[color].ribbon
    const hasActions = Boolean(toastItem.actionProps || data.secondaryAction)

    return (
      <Toast key={toastItem.id} toast={toastItem} data-color={color}>
        <ToastContent>
          {data.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              data-slot="toast-image"
              src={data.image}
              alt={data.imageAlt ?? ""}
              className="w-20 shrink-0 self-stretch object-cover"
            />
          ) : (
            ribbon && (
              <span
                data-slot="toast-ribbon"
                aria-hidden="true"
                className={cn("w-1.5 shrink-0 self-stretch", ribbon)}
              />
            )
          )}
          <div className="flex min-w-0 flex-1 items-start gap-3 p-4">
            {data.image ? null : data.avatar ? (
              <span data-slot="toast-avatar" className="flex shrink-0">
                {data.avatar}
              </span>
            ) : (
              <ToastIcon color={color} />
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div
                className={cn(
                  "flex flex-col justify-center",
                  data.avatar && !data.image ? "min-h-8" : "min-h-6"
                )}
              >
                <ToastTitle />
                <ToastDescription />
              </div>
              {hasActions && (
                <div data-slot="toast-actions" className="flex gap-4">
                  {toastItem.actionProps && <ToastAction />}
                  {data.secondaryAction && (
                    <button
                      type="button"
                      data-slot="toast-action"
                      {...data.secondaryAction}
                      className={cn(
                        toastActionClassName,
                        data.secondaryAction.className
                      )}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          {data.dismissable !== false && (
            <div className="flex shrink-0 items-start py-2 pr-2">
              <ToastClose />
            </div>
          )}
        </ToastContent>
      </Toast>
    )
  })
}

function Toaster({
  children,
  toastManager = toast,
  ...props
}: ToastPrimitive.Provider.Props) {
  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  )
}

const createToastManager = () => ToastPrimitive.createToastManager<ToastData>()
const useToastManager = ToastPrimitive.useToastManager<ToastData>

export {
  Toaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  toast,
  useToastManager,
  type ToastColor,
  type ToastData,
}
