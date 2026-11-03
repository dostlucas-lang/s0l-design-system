import * as React from "react"

import { cn } from "@/lib/utils"

// Mirrors the Figma Spinner component: Size 16 / 20 / 24 / 32 / 40 / 56px.
// Eight rounded bars, 1/12 of the size wide and 1/4 long, around the center
// at 45° steps, in Icon/Primary at 60% opacity. Everything scales with the
// size. The color follows `currentColor`, so a parent (like Button) can tint
// it with `text-current`.
//
// Like the Figma .Spinner Animation partial, the bars don't rotate: each one
// runs `animate-spinner-bar` (styles/theme.css) one step later than the bar
// before it, so a 100% bar with a 90 / 80 / 70% tail moves clockwise,
// starting at the bottom as in Frame 2.
const spinnerSizes = {
  16: "size-4",
  20: "size-5",
  24: "size-6",
  32: "size-8",
  40: "size-10",
  56: "size-14",
} as const

type SpinnerSize = keyof typeof spinnerSizes

// One step of the 0.8s animation.
const stepSeconds = 0.1

function Spinner({
  className,
  size = 24,
  ...props
}: Omit<React.ComponentProps<"svg">, "children"> & {
  /** Figma "Size", in px. */
  size?: SpinnerSize
}) {
  return (
    <svg
      data-slot="spinner"
      data-size={size}
      role="status"
      aria-label="Loading"
      viewBox="0 0 24 24"
      fill="none"
      className={cn(
        "shrink-0 text-icon-primary",
        spinnerSizes[size],
        className
      )}
      {...props}
    >
      <g stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        {Array.from({ length: 8 }, (_, index) => (
          <line
            key={index}
            x1={12}
            y1={1}
            x2={12}
            y2={5}
            opacity={0.6}
            transform={`rotate(${index * 45} 12 12)`}
            className="animate-spinner-bar motion-reduce:animate-none"
            style={{ animationDelay: `${((index + 4) % 8) * stepSeconds}s` }}
          />
        ))}
      </g>
    </svg>
  )
}

export { Spinner, type SpinnerSize }
