import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Spinner, type SpinnerSize } from "@/components/ui/spinner"

// Mirrors the Figma Button Primary / Secondary / Ghost components. Inverse=True
// is `inverse` for Button Ghost and `secondary-inverse` for Button Secondary.
// Hover and Pressed are an overlay painted by ::after on top of the fill, like
// the stacked fills in Figma; -z-10 inside `isolate` keeps it under the label.
// - The Secondary strokes are Inside in Figma: an inset ring, so they take no
//   room (the other variants have no stroke).
// - Icons and the spinner take the Figma Icon variables (Icon/On Color,
//   Button/.../Icon, Icon/Disabled), not the label's Text ones.
const buttonVariants = cva(
  "group/button relative isolate inline-flex shrink-0 items-center justify-center gap-2 rounded-md whitespace-nowrap transition-colors select-none after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-border-accent-strong focus-visible:outline-solid data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 data-loading:[&>svg:not([data-slot=spinner])]:hidden",
  {
    variants: {
      variant: {
        primary:
          "bg-background-accent-strong text-text-on-color hover:after:bg-background-hover active:after:bg-background-pressed not-data-loading:data-disabled:bg-background-disabled-strong not-data-loading:data-disabled:text-text-disabled [&_svg]:text-icon-on-color not-data-loading:data-disabled:[&_svg]:text-icon-disabled",
        secondary:
          "text-button-secondary-standard-label inset-ring inset-ring-button-secondary-standard-border hover:after:bg-background-hover active:after:bg-background-pressed not-data-loading:data-disabled:text-text-disabled not-data-loading:data-disabled:inset-ring-border-disabled-soft [&_svg]:text-button-secondary-standard-icon not-data-loading:data-disabled:[&_svg]:text-icon-disabled",
        "secondary-inverse":
          "text-text-inverse inset-ring inset-ring-border-inverse-strong hover:after:bg-background-inverse-hover active:after:bg-background-inverse-pressed not-data-loading:data-disabled:text-text-inverse-disabled not-data-loading:data-disabled:inset-ring-border-inverse-soft [&_svg]:text-icon-inverse not-data-loading:data-disabled:[&_svg]:text-icon-inverse-disabled",
        ghost:
          "text-button-ghost-standard-label hover:after:bg-background-hover active:after:bg-background-pressed not-data-loading:data-disabled:text-text-disabled [&_svg]:text-button-ghost-standard-icon not-data-loading:data-disabled:[&_svg]:text-icon-disabled",
        inverse:
          "text-text-inverse hover:after:bg-background-inverse-hover active:after:bg-background-inverse-pressed not-data-loading:data-disabled:text-text-inverse-disabled [&_svg]:text-icon-inverse not-data-loading:data-disabled:[&_svg]:text-icon-inverse-disabled",
      },
      size: {
        sm: "h-8 px-5 text-label-small has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-4",
        md: "h-10 px-7 text-label-medium has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5 [&_svg:not([class*='size-'])]:size-5",
        lg: "h-12 px-7 text-label-medium has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5 [&_svg:not([class*='size-'])]:size-6",
      },
      iconOnly: {
        true: "px-0",
        false: "",
      },
      danger: {
        true: "focus-visible:outline-border-danger-strong",
        false: "",
      },
    },
    compoundVariants: [
      { size: "sm", iconOnly: true, className: "size-8" },
      { size: "md", iconOnly: true, className: "size-10" },
      { size: "lg", iconOnly: true, className: "size-12" },
      {
        variant: "primary",
        danger: true,
        className: "bg-background-danger-strong",
      },
      {
        variant: "secondary",
        danger: true,
        className:
          "text-button-secondary-danger-label inset-ring-button-secondary-danger-border hover:after:bg-background-danger-hover active:after:bg-background-danger-pressed [&_svg]:text-button-secondary-danger-icon",
      },
      {
        variant: "ghost",
        danger: true,
        className:
          "text-button-ghost-danger-label hover:after:bg-background-danger-hover active:after:bg-background-danger-pressed [&_svg]:text-button-ghost-danger-icon",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      iconOnly: false,
      danger: false,
    },
  }
)

// Spinner sizes matching each button's icon size: 16 / 20 / 24px.
const spinnerSizes = {
  sm: 16,
  md: 20,
  lg: 24,
} as const satisfies Record<string, SpinnerSize>

function Button({
  className,
  variant = "primary",
  size = "md",
  iconOnly = false,
  danger = false,
  loading = false,
  disabled,
  focusableWhenDisabled,
  children,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    /** Replaces the icons with a spinner and ignores clicks, like State=Loading. */
    loading?: boolean
  }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      // Loading reuses Base UI's disabled behavior (no clicks or key presses)
      // but stays focusable; the disabled colors skip data-loading.
      disabled={disabled || loading}
      focusableWhenDisabled={focusableWhenDisabled || loading}
      className={cn(
        buttonVariants({ variant, size, iconOnly, danger, className })
      )}
      {...props}
    >
      {loading && (
        <Spinner
          data-icon={iconOnly ? undefined : "inline-start"}
          size={spinnerSizes[size ?? "md"]}
        />
      )}
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
