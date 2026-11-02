"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import {
  ArrowRight02Icon,
  DragDropVerticalIcon,
  TradeDownIcon,
  TradeUpIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import {
  HugeiconsIcon,
  type HugeiconsIconProps,
  type IconSvgElement,
} from "@/components/ui/icon"
import { IconColors, iconColorsVariants } from "@/components/ui/icon-colors"
import { Tag } from "@/components/ui/tag"

// Mirrors the Figma List Item: Type (Discreet / Divider / Container) × State
// (Default / Pressed / Disabled) + Focus, with the .List Item Content Left and
// .List Item Content Right partials as props.
// - Pressed is Background/Hover: a fill on Divider, an overlay painted by
//   ::after on top of the surface on Container (like the stacked Figma fills).
//   Figma has no Pressed Discreet. It shows on hover and press, and only when
//   the item is clickable; `data-pressed` forces it.
// - The Divider and Container strokes are Inside in Figma: painted by ::before
//   over the content, so they take no room. The ribbon sits flush against the
//   edge under the stroke, and the content starts 16px after the ribbon (or
//   after the edge when the ribbon is hidden).
// - Disabled is the whole item at 50% opacity (Container also drops its
//   shadow).
// - Focus is the 3px Border/Accent/Strong ring, 2px away from the item, with
//   the Border/Radius/Focus corners on the square types.
const listItemVariants = cva(
  "group/list-item relative isolate flex w-full items-center text-left outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-border-accent-strong focus-visible:outline-solid data-disabled:pointer-events-none data-disabled:opacity-50",
  {
    variants: {
      type: {
        discreet: "focus-visible:rounded-focus",
        divider:
          "py-3 before:pointer-events-none before:absolute before:inset-0 before:border-b before:border-border-secondary focus-visible:rounded-focus data-clickable:hover:bg-background-hover data-clickable:active:bg-background-hover data-pressed:bg-background-hover",
        container:
          "overflow-hidden rounded-md bg-background-surface shadow-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-border-secondary after:pointer-events-none after:absolute after:inset-0 after:-z-10 data-clickable:hover:after:bg-background-hover data-clickable:active:after:bg-background-hover data-pressed:after:bg-background-hover data-disabled:shadow-none",
      },
    },
    defaultVariants: {
      type: "discreet",
    },
  }
)

// Figma .Ribbon: the 8px strip on the left of a Container item.
const ribbonVariants = cva("w-2 shrink-0 self-stretch", {
  variants: {
    ribbon: {
      accent: "bg-background-accent-strong",
      info: "bg-background-info-strong",
      success: "bg-background-success-strong",
      warning: "bg-background-warning-strong",
      danger: "bg-background-danger-strong",
    },
  },
  defaultVariants: {
    ribbon: "accent",
  },
})

// `showX && <X />` passes `false` when off: like null, it renders nothing, so
// the slot (and the gap around it) must not render either.
function isShown(node: React.ReactNode) {
  return node != null && typeof node !== "boolean"
}

// Figma .Icon Trend: Trending Up in Icon/Success, Trending Down in Icon/Danger.
type ListItemTrend = "positive" | "negative"

// 20px by default; pass a size class to change it (Stats uses 16px).
function ListItemTrendIcon({
  trend,
  className,
  ...props
}: Omit<HugeiconsIconProps, "icon"> & { trend: ListItemTrend }) {
  return (
    <HugeiconsIcon
      data-slot="list-item-trend"
      data-trend={trend}
      icon={trend === "positive" ? TradeUpIcon : TradeDownIcon}
      aria-hidden="true"
      className={cn(
        "size-5 shrink-0",
        trend === "positive"
          ? "text-icon-success-standard"
          : "text-icon-danger-standard",
        className
      )}
      {...props}
    />
  )
}

// The leading drag handle, checkbox and icon sit centered on a 40–48px line,
// so they stay next to the label when the text wraps.
function ListItemLead({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex max-h-12 min-h-10 shrink-0 items-center self-stretch">
      {children}
    </span>
  )
}

type ListItemContentLeftProps = {
  /** Label/Medium in Text/Primary. */
  label?: React.ReactNode
  /** Figma Show Description: Body/Medium in Text/Secondary. */
  description?: React.ReactNode
  /** Figma Show Details: Body/Small in Text/Secondary. */
  details?: React.ReactNode
  /** Figma Show Icon Trend: the trend icon before the details. */
  detailsTrend?: ListItemTrend
  /** Figma Show Tag: a Small Accent Strong Tag under the text. */
  tag?: React.ReactNode
  /** Figma Show Drag Handle. */
  dragHandle?: boolean
  /** Figma Show Checkbox: pass a `<Checkbox />`. */
  checkbox?: React.ReactNode
  /** Figma Show Icon: a Hugeicons icon in the Icon Colors container. */
  icon?: IconSvgElement
  /** Color of the Icon Colors container (Figma Icon Colors Color). */
  iconColor?: VariantProps<typeof iconColorsVariants>["color"]
  /** Figma Content Left Custom=True: replaces the whole left content. */
  contentLeft?: React.ReactNode
}

// Figma .List Item Content Left, shared by List Item and the Accordion header.
// Spans only, so it's valid inside a <button>.
function ListItemContentLeft({
  label,
  description,
  details,
  detailsTrend,
  tag,
  dragHandle = false,
  checkbox,
  icon,
  iconColor = "accent",
  contentLeft,
}: ListItemContentLeftProps) {
  return (
    <span
      data-slot="list-item-content-left"
      className="flex min-w-0 flex-1 items-start gap-3"
    >
      {isShown(contentLeft) ? (
        contentLeft
      ) : (
        <>
          {dragHandle && (
            <ListItemLead>
              <HugeiconsIcon
                data-slot="list-item-drag-handle"
                icon={DragDropVerticalIcon}
                aria-hidden="true"
                className="size-5 text-icon-secondary"
              />
            </ListItemLead>
          )}
          {isShown(checkbox) && <ListItemLead>{checkbox}</ListItemLead>}
          {icon && (
            <ListItemLead>
              <IconColors
                data-slot="list-item-icon"
                icon={icon}
                color={iconColor}
                container
              />
            </ListItemLead>
          )}
          <span className="flex min-h-10 min-w-0 flex-1 flex-col items-start justify-center gap-2">
            <span className="flex w-full flex-col">
              {isShown(label) && (
                <span
                  data-slot="list-item-label"
                  className="min-h-6 text-label-medium text-text-primary"
                >
                  {label}
                </span>
              )}
              {isShown(description) && (
                <span
                  data-slot="list-item-description"
                  className="text-body-medium text-text-secondary"
                >
                  {description}
                </span>
              )}
              {isShown(details) && (
                <span
                  data-slot="list-item-details"
                  className="flex w-full items-center gap-1 text-body-small text-text-secondary"
                >
                  {detailsTrend && <ListItemTrendIcon trend={detailsTrend} />}
                  <span className="min-w-0 flex-1">{details}</span>
                </span>
              )}
            </span>
            {isShown(tag) && (
              <Tag data-slot="list-item-tag" color="accent" emphasis="strong">
                {tag}
              </Tag>
            )}
          </span>
        </>
      )}
    </span>
  )
}

type ListItemProps = Omit<useRender.ComponentProps<"div">, "children"> &
  VariantProps<typeof listItemVariants> &
  VariantProps<typeof ribbonVariants> &
  ListItemContentLeftProps & {
    /** Figma State=Disabled. */
    disabled?: boolean
    /**
     * Makes the whole item clickable: `onClick` fires on it, it shows Pressed
     * on hover and press, and it's focusable (a plain item gets
     * `role="button"` and responds to Enter and Space). Defaults to true when
     * `onClick` is set. When false, the item does nothing and has no hover;
     * nested Buttons and Checkboxes stay clickable.
     */
    clickable?: boolean
    /** Figma Show Ribbon (Type=Container only). */
    showRibbon?: boolean

    // .List Item Content Right
    /** Figma Show Text Right: Body/Medium in Text/Secondary. */
    textRight?: React.ReactNode
    /** Figma Show Trend Icon: the trend icon before the right text. */
    textRightTrend?: ListItemTrend
    /** Figma Show Tag (right): a Small Accent Strong Tag. */
    tagRight?: React.ReactNode
    /** Figma Show Icon Arrow: the trailing Arrow Right. */
    arrow?: boolean
    /** Figma Show Buttons: 1 to 3 icon-only Ghost Buttons, 12px apart. */
    actions?: React.ReactNode
    /** Figma Content Right Custom=True: replaces the whole right content. */
    contentRight?: React.ReactNode
  }

function ListItem({
  className,
  type = "discreet",
  ribbon = "accent",
  showRibbon = true,
  disabled = false,
  clickable,
  label,
  description,
  details,
  detailsTrend,
  tag,
  dragHandle,
  checkbox,
  icon,
  iconColor,
  contentLeft,
  textRight,
  textRightTrend,
  tagRight,
  arrow = false,
  actions,
  contentRight,
  render,
  onClick,
  onKeyDown,
  ...props
}: ListItemProps) {
  const isClickable = (clickable ?? onClick != null) && !disabled
  // A native <a> or <button> passed through `render` already has its role and
  // keyboard behavior; anything else (a div, an <li>) gets them here.
  const isNativeControl =
    React.isValidElement(render) &&
    (render.type === "a" || render.type === "button")
  const needsButtonRole = isClickable && !isNativeControl

  const hasRight =
    isShown(contentRight) ||
    isShown(textRight) ||
    isShown(tagRight) ||
    arrow ||
    isShown(actions)

  const right = hasRight && (
    <div
      data-slot="list-item-content-right"
      className="flex max-h-12 min-h-10 shrink-0 items-center gap-4 self-stretch"
    >
      {isShown(contentRight) ? (
        <div className="flex min-h-10 min-w-10 items-center justify-center">
          {contentRight}
        </div>
      ) : (
        <>
          {isShown(textRight) && (
            <div
              data-slot="list-item-text-right"
              className="flex items-center gap-2 text-body-medium whitespace-nowrap text-text-secondary"
            >
              {textRightTrend && <ListItemTrendIcon trend={textRightTrend} />}
              {textRight}
            </div>
          )}
          {isShown(tagRight) && (
            <Tag
              data-slot="list-item-tag-right"
              color="accent"
              emphasis="strong"
            >
              {tagRight}
            </Tag>
          )}
          {arrow && (
            <span
              data-slot="list-item-arrow"
              className="flex size-10 items-center justify-center text-icon-secondary"
            >
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                aria-hidden="true"
                className="size-5"
              />
            </span>
          )}
          {isShown(actions) && (
            <div
              data-slot="list-item-actions"
              className="flex items-center gap-3"
            >
              {actions}
            </div>
          )}
        </>
      )}
    </div>
  )

  // Figma Content: left and right 16px apart; Container pads it 16 × 12px.
  const content = (
    <>
      {type === "container" && showRibbon && (
        <span
          data-slot="list-item-ribbon"
          aria-hidden="true"
          className={ribbonVariants({ ribbon })}
        />
      )}
      <div
        className={cn(
          "flex min-w-0 flex-1 items-start gap-4",
          type === "container" && "px-4 py-3"
        )}
      >
        <ListItemContentLeft
          label={label}
          description={description}
          details={details}
          detailsTrend={detailsTrend}
          tag={tag}
          dragHandle={dragHandle}
          checkbox={checkbox}
          icon={icon}
          iconColor={iconColor}
          contentLeft={contentLeft}
        />
        {right}
      </div>
    </>
  )

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(listItemVariants({ type }), className),
        "aria-disabled": disabled || undefined,
        ...(needsButtonRole && { role: "button", tabIndex: 0 }),
        // Disabled: nested checkboxes and buttons can't be reached either, and
        // keep their own colors under the 50% opacity, as in Figma.
        ...(disabled && { tabIndex: -1, inert: true }),
        onClick: isClickable ? onClick : undefined,
        onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
          onKeyDown?.(event)
          // Only the item itself: keys on a nested checkbox or button stay theirs.
          if (
            !needsButtonRole ||
            event.defaultPrevented ||
            event.target !== event.currentTarget
          )
            return
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            event.currentTarget.click()
          }
        },
        children: content,
      },
      props
    ),
    render,
    state: {
      slot: "list-item",
      type,
      disabled,
      clickable: isClickable,
    },
  })
}

export {
  ListItem,
  ListItemContentLeft,
  ListItemTrendIcon,
  listItemVariants,
  type ListItemProps,
  type ListItemContentLeftProps,
  type ListItemTrend,
}
