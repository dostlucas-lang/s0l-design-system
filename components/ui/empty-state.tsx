import { Search01Icon } from "@hugeicons/core-free-icons"
import { cva, type VariantProps } from "class-variance-authority"

import { IconColors } from "@/components/ui/icon-colors"
import { cn } from "@/lib/utils"

// Mirrors the Figma Empty State component: Direction (Inline / Stacked) sets how
// the actions are laid out. Icon, Title and Actions are optional parts, like the
// Show Icon / Show Title / Show Actions toggles in Figma.
const emptyStateVariants = cva(
  "group/empty-state flex w-full max-w-90 min-w-0 flex-col items-center gap-6 text-center",
  {
    variants: {
      direction: {
        inline: "",
        stacked: "",
      },
    },
    defaultVariants: {
      direction: "inline",
    },
  }
)

function EmptyState({
  className,
  direction = "inline",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyStateVariants>) {
  return (
    <div
      data-slot="empty-state"
      data-direction={direction}
      className={cn(emptyStateVariants({ direction }), className)}
      {...props}
    />
  )
}

// The Figma Icon slot is an Icon Colors instance with Container on.
function EmptyStateIcon({
  icon = Search01Icon,
  container = true,
  ...props
}: React.ComponentProps<typeof IconColors>) {
  return (
    <IconColors
      data-slot="empty-state-icon"
      icon={icon}
      container={container}
      {...props}
    />
  )
}

function EmptyStateHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-state-header"
      className={cn(
        "flex w-full flex-col items-center gap-2 break-words",
        className
      )}
      {...props}
    />
  )
}

function EmptyStateTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-state-title"
      className={cn("w-full text-label-medium text-text-primary", className)}
      {...props}
    />
  )
}

function EmptyStateDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-state-description"
      className={cn(
        "w-full text-body-medium text-text-secondary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

function EmptyStateActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-state-actions"
      className={cn(
        "flex w-full items-center justify-center gap-4 group-data-[direction=stacked]/empty-state:flex-col group-data-[direction=stacked]/empty-state:*:w-full",
        className
      )}
      {...props}
    />
  )
}

export {
  EmptyState,
  EmptyStateIcon,
  EmptyStateHeader,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
  emptyStateVariants,
}
