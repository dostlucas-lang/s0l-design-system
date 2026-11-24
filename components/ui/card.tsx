"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { MoreVerticalIcon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon, type IconSvgElement } from "@/components/ui/icon"
import { IconColors, iconColorsVariants } from "@/components/ui/icon-colors"
import {
  ListItemTrendIcon,
  type ListItemTrend,
} from "@/components/ui/list-item"
import { Tag } from "@/components/ui/tag"

// Mirrors the Figma Card: State (Default / Pressed / Disabled) + Focus, with
// the .Card Body and .Card Footer partials as props.
// - The stroke is Inside in Figma: painted by ::before over the content, so it
//   takes no room.
// - Pressed is Background/Hover, an overlay painted by ::after on top of the
//   surface (like the stacked Figma fills). It shows on hover and press, and
//   only when the card is clickable; `data-pressed` forces it.
// - Disabled is the whole card at 50% opacity, without the shadow.
// - Focus is the 3px Border/Accent/Strong ring, 2px away from the card. It
//   shows on the card when its action (see CardAction) has keyboard focus.
// - A clickable card isn't a button itself, so the More Actions and footer
//   Buttons aren't nested inside one: a transparent <button> (CardAction)
//   covers the surface, under the content, and the content lets clicks through
//   to it except on its own controls.
const cardVariants = cva(
  "group/card relative isolate flex flex-col overflow-hidden rounded-md bg-background-surface text-left shadow-xs outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-border-secondary after:pointer-events-none after:absolute after:inset-0 after:-z-10 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-border-accent-strong focus-visible:outline-solid has-[>[data-slot=card-action]:focus-visible]:outline-3 has-[>[data-slot=card-action]:focus-visible]:outline-offset-2 has-[>[data-slot=card-action]:focus-visible]:outline-border-accent-strong has-[>[data-slot=card-action]:focus-visible]:outline-solid data-clickable:hover:after:bg-background-hover data-clickable:active:after:bg-background-hover data-pressed:after:bg-background-hover data-disabled:pointer-events-none data-disabled:opacity-50 data-disabled:shadow-none"
)

// On a clickable card the content sits over CardAction: plain text lets the
// click through to it, and the card's own controls stay on top and clickable.
const overActionClassName =
  "pointer-events-none [&_:is(a,button,input,select,textarea,label,[role=checkbox],[role=radio],[role=switch],[tabindex])]:pointer-events-auto [&_:is(a,button,input,select,textarea,label,[role=checkbox],[role=radio],[role=switch],[tabindex])]:relative [&_:is(a,button,input,select,textarea,label,[role=checkbox],[role=radio],[role=switch],[tabindex])]:z-1"

// Figma .Card Footer: Button Primary / Button Secondary / Buttons fill the
// width, 16px apart, under 8px top and 16px bottom padding. Button Ghost has
// a Border/Secondary line on top (Inside, so drawn by ::before) and 8px
// vertical padding.
const cardFooterVariants = cva(
  "relative flex items-center gap-4 px-4 *:min-w-0 *:flex-1",
  {
    variants: {
      footerType: {
        default: "pt-2 pb-4",
        ghost:
          "py-2 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:border-t before:border-border-secondary",
      },
    },
    defaultVariants: {
      footerType: "default",
    },
  }
)

// `showX && <X />` passes `false` when off: like null, it renders nothing, so
// the slot must not render either.
function isShown(node: React.ReactNode) {
  return node != null && typeof node !== "boolean"
}

/**
 * Figma Show More Actions: the Small icon-only Ghost Button with More
 * Vertical. Clicks don't reach the card; use it as a Dropdown trigger.
 */
function CardMoreActions({
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="card-more-actions"
      variant="ghost"
      size="sm"
      iconOnly
      aria-label="More actions"
      onClick={(event) => {
        event.stopPropagation()
        onClick?.(event)
      }}
      {...props}
    >
      <HugeiconsIcon icon={MoreVerticalIcon} />
    </Button>
  )
}

type CardProps = Omit<useRender.ComponentProps<"div">, "children"> &
  VariantProps<typeof cardFooterVariants> & {
    /** Figma State=Disabled. */
    disabled?: boolean
    /**
     * Makes the whole surface clickable: `onClick` fires on it and it shows
     * Pressed on hover and press. A transparent <button> covers the card and
     * takes the click, the keyboard focus and the accessible name (the
     * `label`, or `aria-label` when there's no label), so More Actions and the
     * footer Buttons stay separate controls. Defaults to true when `onClick`
     * is set. When false, the surface does nothing and has no hover; nested
     * Buttons stay clickable.
     */
    clickable?: boolean

    // .Card Body
    /** Figma Label (the title): Label/Medium in Text/Primary. */
    label?: React.ReactNode
    /** Figma Show Description: Body/Medium in Text/Secondary. */
    description?: React.ReactNode
    /** Figma Show Details: Body/Small in Text/Secondary. */
    details?: React.ReactNode
    /** Figma Show Icon Trend: the trend icon before the details. */
    detailsTrend?: ListItemTrend
    /** Figma Show Tag: a Small Accent Strong Tag under the text. */
    tag?: React.ReactNode
    /** Figma Show Icon: a Hugeicons icon in the Icon Colors container. */
    icon?: IconSvgElement
    /** Color of the Icon Colors container (Figma Icon Colors Color). */
    iconColor?: VariantProps<typeof iconColorsVariants>["color"]
    /** Figma Show More Actions: pass a `<CardMoreActions />`. */
    moreActions?: React.ReactNode
    /** Figma Body Type=Custom: replaces the whole body content. */
    children?: React.ReactNode

    // .Card Footer
    /**
     * Figma Show Footer: one or two Medium Buttons (Primary, Secondary, or
     * Secondary + Primary for Type=Buttons), or one Ghost Button with
     * `footerType="ghost"`.
     */
    footer?: React.ReactNode
  }

function Card({
  className,
  disabled = false,
  clickable,
  label,
  description,
  details,
  detailsTrend,
  tag,
  icon,
  iconColor = "accent",
  moreActions,
  children,
  footer,
  footerType = "default",
  render,
  onClick,
  "aria-label": ariaLabel,
  ...props
}: CardProps) {
  const isClickable = (clickable ?? onClick != null) && !disabled
  // A native <a> or <button> passed through `render` is the control itself:
  // keep More Actions and the footer out of it. Anything else (a div, an <li>)
  // gets CardAction.
  const isNativeControl =
    React.isValidElement(render) &&
    (render.type === "a" || render.type === "button")
  const hasAction = isClickable && !isNativeControl
  const labelId = React.useId()
  const labelShown = !isShown(children) && isShown(label)

  // Figma .Card Body: the content and More Actions 12px apart, 16px padding.
  const body = isShown(children) ? (
    children
  ) : (
    <>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
        {icon && (
          <IconColors
            data-slot="card-icon"
            icon={icon}
            color={iconColor}
            container
          />
        )}
        <div className="flex w-full flex-col">
          {isShown(label) && (
            <div
              id={labelId}
              data-slot="card-label"
              className="text-label-medium text-text-primary"
            >
              {label}
            </div>
          )}
          {isShown(description) && (
            <div
              data-slot="card-description"
              className="text-body-medium text-text-secondary"
            >
              {description}
            </div>
          )}
          {isShown(details) && (
            <div
              data-slot="card-details"
              className="flex w-full items-center gap-1 text-body-small text-text-secondary"
            >
              {detailsTrend && <ListItemTrendIcon trend={detailsTrend} />}
              <span className="min-w-0 flex-1">{details}</span>
            </div>
          )}
        </div>
        {isShown(tag) && (
          <Tag data-slot="card-tag" color="accent" emphasis="strong">
            {tag}
          </Tag>
        )}
      </div>
      {isShown(moreActions) && <div className="shrink-0">{moreActions}</div>}
    </>
  )

  const content = (
    <>
      {hasAction && (
        <button
          type="button"
          data-slot="card-action"
          aria-labelledby={labelShown && !ariaLabel ? labelId : undefined}
          aria-label={ariaLabel}
          onClick={
            onClick as unknown as React.MouseEventHandler<HTMLButtonElement>
          }
          className="absolute inset-0 cursor-pointer rounded-[inherit] outline-none"
        />
      )}
      <div
        data-slot="card-body"
        className={cn("flex gap-3 p-4", hasAction && overActionClassName)}
      >
        {body}
      </div>
      {isShown(footer) && (
        <div
          data-slot="card-footer"
          className={cn(
            cardFooterVariants({ footerType }),
            hasAction && overActionClassName
          )}
        >
          {footer}
        </div>
      )}
    </>
  )

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(cardVariants(), className),
        "aria-disabled": disabled || undefined,
        // Without CardAction the name stays on the card (a native control).
        "aria-label": hasAction ? undefined : ariaLabel,
        // Disabled: nested buttons can't be reached either, and keep their own
        // colors under the 50% opacity, as in Figma.
        ...(disabled && { tabIndex: -1, inert: true }),
        onClick: isClickable && !hasAction ? onClick : undefined,
        children: content,
      },
      props
    ),
    render,
    state: {
      slot: "card",
      disabled,
      clickable: isClickable,
    },
  })
}

export {
  Card,
  CardMoreActions,
  cardVariants,
  cardFooterVariants,
  type CardProps,
}
