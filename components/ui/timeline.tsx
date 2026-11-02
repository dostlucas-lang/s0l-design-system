import * as React from "react"

import { cn } from "@/lib/utils"
import { Tag } from "@/components/ui/tag"

// Mirrors the Figma Timeline: a list of Timeline Items, up to 560px wide.
function Timeline({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="timeline"
      className={cn("flex w-full max-w-140 flex-col", className)}
      {...props}
    />
  )
}

type TimelineItemProps = Omit<React.ComponentProps<"li">, "title"> & {
  /** The date above the title: Label/Small in Text/Secondary. */
  date?: React.ReactNode
  /** Bold Body/Medium in Text/Primary. */
  title?: React.ReactNode
  /** Figma "Show Tag": a Small Accent Soft Tag next to the title. */
  tag?: React.ReactNode
  /**
   * Figma "Show Actions": buttons below the text, 16px apart (Figma uses a
   * Medium Button Primary and, with "Show Action 2", a Button Ghost).
   */
  actions?: React.ReactNode
}

// Mirrors the Figma Timeline Item:
// - Bullet + Line: a 12px circle with a 1px Border/Strong stroke, centered on
//   the date line, and a dotted 1px Border/Strong line (2px dashes, 4px gaps)
//   down to the next item.
// - Text + Button, 16px from the bullet: date, title + tag and the
//   description (Body/Medium, `children`) 8px apart, the actions 16px below,
//   and 40px before the next item.
function TimelineItem({
  className,
  date,
  title,
  tag,
  actions,
  children,
  ...props
}: TimelineItemProps) {
  return (
    <li
      data-slot="timeline-item"
      className={cn("flex gap-4", className)}
      {...props}
    >
      <div
        aria-hidden="true"
        data-slot="timeline-bullet"
        className="flex w-3 shrink-0 flex-col items-center"
      >
        <span className="flex py-1">
          <span className="size-3 rounded-full border border-border-strong" />
        </span>
        <span className="w-px flex-1 bg-[repeating-linear-gradient(to_bottom,var(--color-border-strong)_0_2px,transparent_2px_6px)]" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-4 pb-10">
        <div className="flex w-full flex-col gap-2">
          {date != null && (
            <div
              data-slot="timeline-date"
              className="min-h-5 text-label-small text-text-secondary"
            >
              {date}
            </div>
          )}
          {(title != null || tag != null) && (
            <div className="flex w-full flex-wrap items-center gap-2">
              {title != null && (
                <h3
                  data-slot="timeline-title"
                  className="text-body-medium font-bold text-text-primary"
                >
                  {title}
                </h3>
              )}
              {tag != null && (
                <Tag data-slot="timeline-tag" color="accent">
                  {tag}
                </Tag>
              )}
            </div>
          )}
          {children != null && (
            <div
              data-slot="timeline-description"
              className="w-full text-body-medium text-text-primary"
            >
              {children}
            </div>
          )}
        </div>
        {actions != null && (
          <div data-slot="timeline-actions" className="flex items-center gap-4">
            {actions}
          </div>
        )}
      </div>
    </li>
  )
}

export { Timeline, TimelineItem, type TimelineItemProps }
