import * as React from "react"

import { cn } from "@/lib/utils"

// Mirrors the Figma Backdrop: Background/Overlay over the whole screen, no blur.
// Modal, Drawer and Bottom Sheet render it through their Base UI Backdrop part,
// which adds the data-starting-style / data-ending-style used to fade it.
function Backdrop({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-background-overlay transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0",
        className
      )}
      {...props}
    />
  )
}

export { Backdrop }
