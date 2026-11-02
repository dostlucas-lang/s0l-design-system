"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

// Mirrors the Figma Slider component: one value (Property 1=False) or a range
// with two handles (Property 1=True), plus the optional Scale below.
// - Track: 8px pill. Figma points it at an unpublished "Background/Alpha
//   Color*" variable, so it uses Background/Disabled/Soft, the closest token.
// - Fill and .Slider Handle (20px): Background/Accent/Strong, Shadow/X-Small.
//   The handle is centered on the value, overflowing the 8px track, and the
//   root keeps 10px at each end so it stays inside, like the Figma frame.
// - Scale: Body/Small labels in Text/Secondary, 12px below the track.
// Disabled isn't in Figma; it swaps the accent for the disabled tokens, with a
// Surface fill under the translucent handle so the track doesn't show through.
// Horizontal only: the Figma Slider has no vertical variant.
type SliderProps = Omit<SliderPrimitive.Root.Props, "orientation"> & {
  /**
   * Figma "Scale": `true` shows 5 evenly spaced labels from min to max; an
   * array shows those values.
   */
  scale?: boolean | number[]
  /** Formats each scale label. */
  formatScaleLabel?: (value: number) => React.ReactNode
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  scale = false,
  formatScaleLabel = (mark) => mark,
  ...props
}: SliderProps) {
  const values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [value ?? defaultValue ?? min]
  const marks =
    scale === true
      ? Array.from({ length: 5 }, (_, index) => min + ((max - min) * index) / 4)
      : scale || []

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "group/slider flex w-full flex-col gap-3 px-2.5",
        className
      )}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      orientation="horizontal"
      thumbAlignment="center"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex h-2 w-full touch-none items-center select-none">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative h-2 w-full grow rounded-full bg-background-disabled-soft select-none"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="h-full rounded-full bg-background-accent-strong select-none data-disabled:bg-background-disabled-strong"
          />
        </SliderPrimitive.Track>
        {values.map((_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            index={index}
            className="block size-5 shrink-0 cursor-grab rounded-full bg-background-accent-strong shadow-xs select-none active:cursor-grabbing has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-border-accent-strong has-focus-visible:outline-solid data-disabled:cursor-not-allowed data-disabled:bg-background-surface data-disabled:bg-linear-to-r data-disabled:from-background-disabled-strong data-disabled:to-background-disabled-strong data-disabled:shadow-none"
          />
        ))}
      </SliderPrimitive.Control>
      {marks.length > 0 && (
        <div
          data-slot="slider-scale"
          aria-hidden
          className="relative h-[22px] text-body-small text-text-secondary group-data-disabled/slider:text-text-disabled"
        >
          {marks.map((mark) => (
            <span
              key={mark}
              className="absolute top-0 -translate-x-1/2 whitespace-nowrap"
              style={{ left: `${((mark - min) / (max - min)) * 100}%` }}
            >
              {formatScaleLabel(mark)}
            </span>
          ))}
        </div>
      )}
    </SliderPrimitive.Root>
  )
}

export { Slider, type SliderProps }
