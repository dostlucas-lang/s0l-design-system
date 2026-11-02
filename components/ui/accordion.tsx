import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { cva, type VariantProps } from "class-variance-authority"

import { HugeiconsIcon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"
import {
  ListItemContentLeft,
  type ListItemContentLeftProps,
} from "@/components/ui/list-item"

// Mirrors the Figma Accordion component. Style (Divider / Container) is set
// once on the root and read by the items through group-data-[variant].
function Accordion({
  className,
  variant = "divider",
  ...props
}: AccordionPrimitive.Root.Props & {
  variant?: "divider" | "container"
}) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      data-variant={variant}
      className={cn(
        "group/accordion flex w-full flex-col data-[variant=container]:gap-2",
        className
      )}
      {...props}
    />
  )
}

// The Divider and Container strokes are Inside in Figma: painted by ::after
// over the content, so they take no room (as in List Item). Container items
// have an 8px ribbon (the Figma .Ribbon component) flush against the left
// edge, under the stroke, and the header and content start 16px after it (or
// after the edge when the ribbon is hidden). Their hover is an overlay on top
// of the surface fill, painted by ::before.
const accordionItemVariants = cva(
  [
    "group/accordion-item relative isolate data-disabled:pointer-events-none",
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-border-secondary",
    // Divider
    "group-data-[variant=divider]/accordion:after:border-b group-data-[variant=divider]/accordion:hover:bg-background-hover",
    // Container
    "group-data-[variant=container]/accordion:rounded-md group-data-[variant=container]/accordion:bg-background-surface group-data-[variant=container]/accordion:after:border",
    "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] group-data-[variant=container]/accordion:hover:before:bg-background-hover",
  ],
  {
    variants: {
      showRibbon: {
        true: "group-data-[variant=container]/accordion:pl-2",
        false: "",
      },
    },
    defaultVariants: {
      showRibbon: true,
    },
  }
)

// Figma .Ribbon: the 8px strip on the left of a Container item.
const accordionRibbonVariants = cva(
  "pointer-events-none absolute inset-y-0 left-0 hidden w-2 rounded-l-[inherit] group-data-[variant=container]/accordion:block",
  {
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
  }
)

function AccordionItem({
  className,
  ribbon = "accent",
  showRibbon = true,
  children,
  ...props
}: AccordionPrimitive.Item.Props &
  VariantProps<typeof accordionRibbonVariants> & {
    /** Figma Show Ribbon (Style=Container only). */
    showRibbon?: boolean
  }) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      data-ribbon={showRibbon ? ribbon : undefined}
      className={cn(accordionItemVariants({ showRibbon }), className)}
      {...props}
    >
      {showRibbon && (
        <span
          data-slot="accordion-ribbon"
          aria-hidden="true"
          className={accordionRibbonVariants({ ribbon })}
        />
      )}
      {children}
    </AccordionPrimitive.Item>
  )
}

// The header is the Figma .List Item Content Left (the same props as List
// Item, with `children` as the label) and the Chevron Down, 12px apart. With a
// checkbox the trigger renders a <div role="button">, since a checkbox can't
// sit inside a <button>; stop propagation in its onClick so it doesn't toggle
// the item. Figma has no Disabled: like List Item, it's the header at 50%.
function AccordionTrigger({
  className,
  children,
  description,
  details,
  detailsTrend,
  tag,
  dragHandle,
  checkbox,
  icon,
  iconColor,
  contentLeft,
  ...props
}: AccordionPrimitive.Trigger.Props & Omit<ListItemContentLeftProps, "label">) {
  const hasCheckbox = checkbox != null && typeof checkbox !== "boolean"
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        {...(hasCheckbox && { nativeButton: false, render: <div /> })}
        className={cn(
          "group/accordion-trigger flex flex-1 items-start gap-3 rounded-md py-3 text-left outline-none group-data-[variant=container]/accordion:px-4 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-border-accent-strong focus-visible:outline-solid data-disabled:opacity-50",
          className
        )}
        {...props}
      >
        <ListItemContentLeft
          label={children}
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
        <span className="flex max-h-12 min-h-10 shrink-0 items-center self-stretch">
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            data-slot="accordion-trigger-icon"
            className="pointer-events-none size-5 text-icon-secondary transition-transform group-aria-expanded/accordion-trigger:rotate-180"
          />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "h-(--accordion-panel-height) pb-4 text-body-medium text-text-primary group-data-[variant=container]/accordion:px-4 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  accordionItemVariants,
  accordionRibbonVariants,
}
