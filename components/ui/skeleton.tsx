import { cn } from "@/lib/utils"

// Mirrors the Figma Skeleton colors: its two frames go from
// Background/Disabled/Strong to Background/Disabled/Soft. The pulse fades the
// Strong fill toward the Soft one instead of reproducing the Figma animation.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md bg-background-disabled-strong",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
