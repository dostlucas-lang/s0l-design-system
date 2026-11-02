"use client"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  )
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

// Mirrors the Figma Tooltip component: Pointer Position (Bottom / Top / Left /
// Right) × Pointer Align (Center / Left / Right).
// - Pointer Position is the opposite of `side`: a tooltip above its trigger
//   (side="top") has the pointer at the bottom.
// - Pointer Align follows `align` (center / start / end): centered on the
//   trigger, or 12px from the start / end edge.
// - Background/Inverse/Default, Medium radius, Shadow/Small, 32px min height,
//   12 / 4px padding, up to 240px wide, centered Label/Small in Text/Inverse.
// - 16px between the trigger and the box (the pointer sits inside that gap).
// - Pointer: a 12 × 6px triangle in the same color, 6px outside the edge.
function TooltipContent({
  className,
  side = "top",
  sideOffset = 16,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "z-50 flex min-h-8 w-fit max-w-60 origin-(--transform-origin) items-center justify-center gap-1.5 rounded-md bg-background-inverse-default px-3 py-1 text-center text-label-small text-text-inverse shadow-sm has-data-[slot=kbd]:pr-1",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow
            data-slot="tooltip-pointer"
            className={cn(
              "h-1.5 w-3 bg-background-inverse-default [clip-path:polygon(0_0,100%_0,50%_100%)]",
              "data-[side=top]:-bottom-1.5",
              "data-[side=bottom]:-top-1.5 data-[side=bottom]:rotate-180",
              // Pointer Align=Left / Right: 12px from that edge, as in Figma,
              // instead of Base UI's trigger-centered position. The popup
              // starts at the trigger's edge, so it still points at it.
              "data-[side=bottom]:data-[align=start]:left-3! data-[side=top]:data-[align=start]:left-3!",
              "data-[side=bottom]:data-[align=end]:right-3! data-[side=bottom]:data-[align=end]:left-auto! data-[side=top]:data-[align=end]:right-3! data-[side=top]:data-[align=end]:left-auto!",
              // Rotated 90°, the 12 × 6 box is centered 3px past the edge.
              "data-[side=inline-start]:-right-[9px] data-[side=inline-start]:-rotate-90 data-[side=left]:-right-[9px] data-[side=left]:-rotate-90",
              "data-[side=inline-end]:-left-[9px] data-[side=inline-end]:rotate-90 data-[side=right]:-left-[9px] data-[side=right]:rotate-90"
            )}
          />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
