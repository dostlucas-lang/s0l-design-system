"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import {
  Alert02Icon,
  AlertCircleIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"
import { cva, type VariantProps } from "class-variance-authority"

import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

// Mirrors the Figma Alert component: Color × Direction, with Title,
// Description (children), Icon, Actions and Dismissable as props.
const alertVariants = cva(
  "group/alert flex w-full items-stretch rounded-md border",
  {
    variants: {
      color: {
        brand:
          "border-border-accent-soft bg-background-accent-soft text-text-accent-standard [&_svg]:text-icon-accent-standard",
        info: "border-border-info-soft bg-background-info-soft text-text-info-standard [&_svg]:text-icon-info-standard",
        success:
          "border-border-success-soft bg-background-success-soft text-text-success-standard [&_svg]:text-icon-success-standard",
        warning:
          "border-border-warning-soft bg-background-warning-soft text-text-warning-standard [&_svg]:text-icon-warning-standard",
        danger:
          "border-border-danger-soft bg-background-danger-soft text-text-danger-standard [&_svg]:text-icon-danger-standard",
      },
      direction: {
        inline: "",
        stacked: "",
      },
    },
    defaultVariants: {
      color: "brand",
      direction: "inline",
    },
  }
)

type AlertColor = NonNullable<VariantProps<typeof alertVariants>["color"]>

const defaultIcons = {
  brand: InformationCircleIcon,
  info: InformationCircleIcon,
  success: CheckmarkCircle02Icon,
  warning: AlertCircleIcon,
  danger: Alert02Icon,
} satisfies Record<AlertColor, unknown>

function Alert({
  className,
  color = "brand",
  direction = "inline",
  title,
  icon,
  actions,
  dismissible = false,
  dismissLabel = "Dismiss",
  onDismiss,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "color" | "title"> &
  VariantProps<typeof alertVariants> & {
    /** Figma "Title"; omit to hide it (Show Title). */
    title?: React.ReactNode
    /** Figma "Icon"; defaults to the color's icon, `false` hides it (Show Icon). */
    icon?: React.ReactNode | false
    /** Figma "Actions": one or two <AlertAction>s. */
    actions?: React.ReactNode
    /** Figma "Dismissable": shows the close button. */
    dismissible?: boolean
    dismissLabel?: string
    onDismiss?: () => void
  }) {
  const [dismissed, setDismissed] = React.useState(false)
  const stacked = direction === "stacked"
  const tone = color ?? "brand"

  if (dismissed) {
    return null
  }

  return (
    <div
      data-slot="alert"
      data-color={tone}
      data-direction={direction}
      role={tone === "warning" || tone === "danger" ? "alert" : "status"}
      className={cn(alertVariants({ color, direction }), className)}
      {...props}
    >
      <div
        className={cn(
          "flex min-w-0 flex-1 gap-3 p-4",
          stacked ? "items-start" : "items-center"
        )}
      >
        {icon !== false && (
          <span
            data-slot="alert-icon"
            className="flex h-6 shrink-0 items-center [&_svg:not([class*='size-'])]:size-5"
          >
            {icon ?? <HugeiconsIcon icon={defaultIcons[tone]} />}
          </span>
        )}
        <div
          className={cn(
            "flex min-w-0 flex-1 gap-3",
            stacked ? "flex-col" : "items-center"
          )}
        >
          <div
            className={cn(
              "flex min-w-0 flex-1",
              stacked ? "flex-col" : "items-center gap-2"
            )}
          >
            {title && (
              <div
                data-slot="alert-title"
                className="shrink-0 text-label-medium"
              >
                {title}
              </div>
            )}
            {children && (
              <div
                data-slot="alert-description"
                className="min-w-0 text-body-medium"
              >
                {children}
              </div>
            )}
          </div>
          {actions && (
            <div
              data-slot="alert-actions"
              className="flex shrink-0 items-center gap-4"
            >
              {actions}
            </div>
          )}
        </div>
      </div>
      {dismissible && (
        <div
          className={cn(
            "flex py-2 pr-2",
            stacked ? "items-start" : "items-center"
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            aria-label={dismissLabel}
            onClick={() => {
              setDismissed(true)
              onDismiss?.()
            }}
          >
            <HugeiconsIcon icon={Cancel01Icon} />
          </Button>
        </div>
      )}
    </div>
  )
}

// A Small Link in the alert's color (the Figma Link instances inside Alert).
function AlertAction({
  className,
  render,
  ...props
}: useRender.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        ...(render ? {} : { type: "button" as const }),
        className: cn(
          "rounded-sm text-label-small underline-offset-2 outline-none hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-border-accent-strong focus-visible:outline-solid disabled:pointer-events-none disabled:text-text-disabled",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "alert-action",
    },
  })
}

export { Alert, AlertAction, alertVariants }
