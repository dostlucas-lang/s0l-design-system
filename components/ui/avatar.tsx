"use client"

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Mirrors the Figma Avatar component. Type is implicit: AvatarImage renders
// Type=Photo and AvatarFallback (initials) renders Type=Initials when there is
// no image. The 1px inside stroke is an ::after ring drawn over the content,
// Border/Primary for photos and the color's soft border for initials.
const avatarVariants = cva(
  "group/avatar relative flex shrink-0 rounded-full select-none after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:border after:border-border-primary",
  {
    variants: {
      size: {
        xs: "size-6",
        sm: "size-8",
        md: "size-10",
        lg: "size-14",
        xl: "size-16",
      },
      color: {
        accent:
          "has-data-[slot=avatar-fallback]:after:border-border-accent-soft",
        blue: "has-data-[slot=avatar-fallback]:after:border-border-info-soft",
        green:
          "has-data-[slot=avatar-fallback]:after:border-border-success-soft",
        yellow:
          "has-data-[slot=avatar-fallback]:after:border-border-warning-soft",
        red: "has-data-[slot=avatar-fallback]:after:border-border-danger-soft",
      },
    },
    defaultVariants: {
      size: "md",
      color: "accent",
    },
  }
)

function Avatar({
  className,
  size = "md",
  color = "accent",
  ...props
}: AvatarPrimitive.Root.Props & VariantProps<typeof avatarVariants>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      data-color={color}
      className={cn(avatarVariants({ size, color }), className)}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className
      )}
      {...props}
    />
  )
}

// Initials: Text/Font Size/50–600 by size, Medium weight, 150% line height.
function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full leading-normal [font-weight:var(--s0l-text-font-weight-medium)]",
        "group-data-[size=lg]/avatar:text-(length:--s0l-text-font-size-500) group-data-[size=md]/avatar:text-(length:--s0l-text-font-size-300) group-data-[size=sm]/avatar:text-(length:--s0l-text-font-size-200) group-data-[size=xl]/avatar:text-(length:--s0l-text-font-size-600) group-data-[size=xs]/avatar:text-(length:--s0l-text-font-size-50)",
        "group-data-[color=accent]/avatar:bg-background-accent-soft group-data-[color=accent]/avatar:text-text-accent-standard",
        "group-data-[color=blue]/avatar:bg-background-info-soft group-data-[color=blue]/avatar:text-text-info-standard",
        "group-data-[color=green]/avatar:bg-background-success-soft group-data-[color=green]/avatar:text-text-success-standard",
        "group-data-[color=yellow]/avatar:bg-background-warning-soft group-data-[color=yellow]/avatar:text-text-warning-standard",
        "group-data-[color=red]/avatar:bg-background-danger-soft group-data-[color=red]/avatar:text-text-danger-standard",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback, avatarVariants }
