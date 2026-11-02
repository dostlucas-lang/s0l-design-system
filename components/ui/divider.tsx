"use client"

import { Separator as DividerPrimitive } from "@base-ui/react/separator"

import { cn } from "@/lib/utils"

// Mirrors the Figma Divider: a 1px line in Border/Secondary that fills its
// container. Figma only draws it horizontal; `orientation="vertical"` turns
// the same line upright, stretched to the row's height.
function Divider({
  className,
  orientation = "horizontal",
  ...props
}: DividerPrimitive.Props) {
  return (
    <DividerPrimitive
      data-slot="divider"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border-secondary data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className
      )}
      {...props}
    />
  )
}

export { Divider }
