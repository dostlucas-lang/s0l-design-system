"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons"

import { HugeiconsIcon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetSearch,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet"

// Mirrors the Figma Dropdown component:
// - Type=Actions → DropdownItem (+ Sub/SubTrigger for Multi-Level)
// - Type=Selection Single → DropdownRadioGroup + DropdownRadioItem
// - Type=Selection Multiple → DropdownCheckboxItem
// - Sections → DropdownGroup separated by DropdownSeparator
// - Show Header / Show Footer → `header` / `footer` on DropdownContent
// - Mobile=True → the same parts inside the Bottom Sheet
//
// Desktop is the Base UI Menu. On mobile every part renders on the Bottom
// Sheet instead (so it can be dragged down to close), and the items are
// buttons with the menu roles that redo what the Menu did: close on click
// (actions only, like Base UI), checked state and arrow-key navigation.
// Submenus open a nested Bottom Sheet.

type DropdownContextValue = {
  mobile: boolean
  /** Closes the whole dropdown, from any level. */
  close: () => void
}

const DropdownContext = React.createContext<DropdownContextValue>({
  mobile: false,
  close: () => {},
})

const useDropdown = () => React.useContext(DropdownContext)

// Base UI accepts a className function; the mobile buttons take strings.
const staticClassName = (className: unknown) =>
  typeof className === "string" ? className : undefined

function Dropdown({
  mobile = false,
  modal,
  open,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}: MenuPrimitive.Root.Props & {
  /** Figma Mobile=True: opens as a Bottom Sheet over an overlay. */
  mobile?: boolean
}) {
  const actionsRef = React.useRef<BottomSheetPrimitiveActions>(null)
  const contextValue = React.useMemo(
    () => ({ mobile, close: () => actionsRef.current?.close() }),
    [mobile]
  )

  return (
    <DropdownContext.Provider value={contextValue}>
      {mobile ? (
        <BottomSheet
          data-slot="dropdown"
          data-mobile=""
          actionsRef={actionsRef}
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={
            onOpenChange as React.ComponentProps<
              typeof BottomSheet
            >["onOpenChange"]
          }
        >
          {children}
        </BottomSheet>
      ) : (
        <MenuPrimitive.Root
          data-slot="dropdown"
          modal={modal}
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          {...props}
        >
          {children}
        </MenuPrimitive.Root>
      )}
    </DropdownContext.Provider>
  )
}

type BottomSheetPrimitiveActions = NonNullable<
  React.ComponentProps<typeof BottomSheet>["actionsRef"]
>["current"]

function DropdownPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-portal" {...props} />
}

function DropdownTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  const { mobile } = useDropdown()

  if (mobile) {
    return (
      <BottomSheetTrigger
        data-slot="dropdown-trigger"
        {...(props as React.ComponentProps<typeof BottomSheetTrigger>)}
      />
    )
  }

  return <MenuPrimitive.Trigger data-slot="dropdown-trigger" {...props} />
}

const popupClassName =
  "z-50 flex max-h-(--available-height) w-(--anchor-width) min-w-67 origin-(--transform-origin) flex-col overflow-hidden rounded-md border border-border-secondary bg-background-primary text-text-primary shadow-md outline-none duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"

// Sections: 8px padding and 8px between items, scrolling with the Figma
// Scroll Bar colors when the list is taller than the available space.
const bodyClassName =
  "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2 [scrollbar-color:var(--s0l-background-inverse-default)_var(--s0l-background-secondary)] [scrollbar-width:thin]"

// Mobile: Arrow Up / Down, Home and End move between the enabled items,
// like the Menu does on desktop.
function moveFocus(event: React.KeyboardEvent<HTMLElement>) {
  const keys = ["ArrowDown", "ArrowUp", "Home", "End"]
  if (!keys.includes(event.key)) return

  const items = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>(
      "[data-dropdown-item]:not(:disabled)"
    )
  )
  if (items.length === 0) return

  event.preventDefault()
  const index = items.indexOf(document.activeElement as HTMLElement)
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? items.length - 1
        : event.key === "ArrowDown"
          ? (index + 1) % items.length
          : (index - 1 + items.length) % items.length
  items[next]?.focus()
}

function DropdownContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  header,
  footer,
  className,
  children,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & {
    /** Figma "Show Header" (.Dropdown Header: a search field or any slot). */
    header?: React.ReactNode
    /** Figma "Show Footer" (.Dropdown Footer: actions or any slot). */
    footer?: React.ReactNode
  }) {
  const { mobile } = useDropdown()

  // Bottom Sheet: Search, the sections in the Body and the sheet Footer.
  if (mobile) {
    return (
      <BottomSheetContent
        data-slot="dropdown-content"
        data-mobile=""
        className={staticClassName(className)}
      >
        {header && (
          <BottomSheetSearch data-slot="dropdown-header">
            {header}
          </BottomSheetSearch>
        )}
        <BottomSheetBody
          data-slot="dropdown-body"
          role="menu"
          className="gap-2"
          onKeyDown={moveFocus}
        >
          {children}
        </BottomSheetBody>
        {footer && (
          <BottomSheetFooter data-slot="dropdown-footer">
            {footer}
          </BottomSheetFooter>
        )}
      </BottomSheetContent>
    )
  }

  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-content"
          className={cn(popupClassName, className)}
          {...props}
        >
          {header && (
            <div
              data-slot="dropdown-header"
              className="shrink-0 border-b border-border-primary px-4 py-3"
            >
              {header}
            </div>
          )}
          <div data-slot="dropdown-body" className={bodyClassName}>
            {children}
          </div>
          {footer && (
            <div
              data-slot="dropdown-footer"
              className="flex shrink-0 items-center justify-end gap-4 border-t border-border-primary px-4 py-3"
            >
              {footer}
            </div>
          )}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

// A Figma section: items 8px apart.
function DropdownGroup({ className, ...props }: MenuPrimitive.Group.Props) {
  const { mobile } = useDropdown()
  const groupClassName = "flex flex-col gap-2"

  if (mobile) {
    return (
      <div
        role="group"
        data-slot="dropdown-group"
        className={cn(groupClassName, staticClassName(className))}
        {...(props as React.ComponentProps<"div">)}
      />
    )
  }

  return (
    <MenuPrimitive.Group
      data-slot="dropdown-group"
      className={cn(groupClassName, className)}
      {...props}
    />
  )
}

// Figma .Dropdown Divider: a Border/Secondary line in a 16px band that opens
// the next section, so with the 8px item gap it sits 8px below the previous
// item and 16px above the next one.
function DropdownSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  const { mobile } = useDropdown()
  const separatorClassName = "mb-2 h-px shrink-0 bg-border-secondary"

  if (mobile) {
    return (
      <div
        role="separator"
        data-slot="dropdown-separator"
        className={cn(separatorClassName, staticClassName(className))}
        {...(props as React.ComponentProps<"div">)}
      />
    )
  }

  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-separator"
      className={cn(separatorClassName, className)}
      {...props}
    />
  )
}

// Shared by every item type: 40px row (8/12 padding), 12px gap, Medium radius,
// Background/Hover when highlighted and Background/Pressed while pressed.
const itemClassName =
  "group/dropdown-item relative flex w-full cursor-default items-center gap-3 rounded-md px-3 py-2 text-left outline-none select-none data-highlighted:bg-background-hover active:bg-background-pressed focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-border-accent-strong focus-visible:outline-solid data-disabled:pointer-events-none"

// Mobile items have no Base UI highlight, so hover paints it.
const sheetItemClassName = "hover:bg-background-hover"

// Base UI-only props the mobile buttons drop.
const menuOnlyProps = ["label", "render", "nativeButton"]

// A mobile item: a button that closes the dropdown when `closeOnClick`.
function SheetItem({
  className,
  closeOnClick,
  disabled,
  onClick,
  ...props
}: Omit<React.ComponentProps<"button">, "className"> & {
  className?: string
  closeOnClick: boolean
}) {
  const { close } = useDropdown()

  return (
    <button
      type="button"
      data-dropdown-item=""
      data-disabled={disabled || undefined}
      disabled={disabled}
      className={cn(itemClassName, sheetItemClassName, className)}
      onClick={(event) => {
        onClick?.(event)
        if (closeOnClick && !event.defaultPrevented) close()
      }}
      {...props}
    />
  )
}

// Splits the Menu item props into `closeOnClick` and what a mobile button
// can take.
function toSheetItemProps(
  {
    closeOnClick = undefined,
    className,
    ...rest
  }: { closeOnClick?: boolean; className?: unknown },
  defaultCloseOnClick: boolean
) {
  const buttonProps: Record<string, unknown> = {
    ...rest,
    className: staticClassName(className),
  }
  for (const key of menuOnlyProps) delete buttonProps[key]

  return {
    closeOnClick: closeOnClick ?? defaultCloseOnClick,
    buttonProps: buttonProps as Omit<
      React.ComponentProps<"button">,
      "className"
    > & { className?: string },
  }
}

function ItemText({
  children,
  description,
}: {
  children: React.ReactNode
  description?: React.ReactNode
}) {
  return (
    <span className="flex min-w-0 flex-1 flex-col">
      <span
        data-slot="dropdown-item-label"
        className="text-body-medium text-text-primary group-data-[destructive=true]/dropdown-item:text-text-danger-standard group-data-disabled/dropdown-item:text-text-disabled"
      >
        {children}
      </span>
      {description && (
        <span
          data-slot="dropdown-item-description"
          className="text-body-small text-text-secondary group-data-[destructive=true]/dropdown-item:text-text-danger-standard group-data-disabled/dropdown-item:text-text-disabled"
        >
          {description}
        </span>
      )}
    </span>
  )
}

// Figma "Icon" (Show Icon): 20px, Icon/Secondary.
function ItemIcon({ icon }: { icon?: React.ReactNode }) {
  if (!icon) {
    return null
  }

  return (
    <span
      data-slot="dropdown-item-icon"
      className="flex shrink-0 text-icon-secondary group-data-[destructive=true]/dropdown-item:text-icon-danger-standard group-data-disabled/dropdown-item:text-icon-disabled [&_svg:not([class*='size-'])]:size-5"
    >
      {icon}
    </span>
  )
}

type ItemContentProps = {
  /** Figma "Icon" (Show Icon). */
  icon?: React.ReactNode
  /** Figma "Description" (Show Description). */
  description?: React.ReactNode
}

// Figma .Dropdown Item Action.
function DropdownItem({
  className,
  icon,
  description,
  destructive = false,
  nested = false,
  children,
  ...props
}: MenuPrimitive.Item.Props &
  ItemContentProps & {
    /** Figma "Destructive". */
    destructive?: boolean
    /** Figma "Nested": indents the item 20px. */
    nested?: boolean
  }) {
  const { mobile } = useDropdown()
  const content = (
    <>
      {nested && <span aria-hidden="true" className="w-5 shrink-0" />}
      <ItemIcon icon={icon} />
      <ItemText description={description}>{children}</ItemText>
    </>
  )
  const destructiveClassName =
    destructive &&
    "focus-visible:outline-border-danger-strong active:bg-background-danger-pressed data-highlighted:bg-background-danger-hover"

  if (mobile) {
    const { closeOnClick, buttonProps } = toSheetItemProps(
      { ...props, className },
      true
    )
    return (
      <SheetItem
        role="menuitem"
        data-slot="dropdown-item"
        data-destructive={destructive}
        {...buttonProps}
        closeOnClick={closeOnClick}
        className={cn(
          destructiveClassName,
          destructive && "hover:bg-background-danger-hover",
          buttonProps.className
        )}
      >
        {content}
      </SheetItem>
    )
  }

  return (
    <MenuPrimitive.Item
      data-slot="dropdown-item"
      data-destructive={destructive}
      className={cn(itemClassName, destructiveClassName, className)}
      {...props}
    >
      {content}
    </MenuPrimitive.Item>
  )
}

function DropdownSub({
  open,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}: MenuPrimitive.SubmenuRoot.Props) {
  const { mobile } = useDropdown()

  // Mobile: a nested Bottom Sheet over the first one.
  if (mobile) {
    return (
      <BottomSheet
        data-slot="dropdown-sub"
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={
          onOpenChange as React.ComponentProps<
            typeof BottomSheet
          >["onOpenChange"]
        }
      >
        {children}
      </BottomSheet>
    )
  }

  return (
    <MenuPrimitive.SubmenuRoot
      data-slot="dropdown-sub"
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      {...props}
    >
      {children}
    </MenuPrimitive.SubmenuRoot>
  )
}

// Figma .Dropdown Item Action with Multi-Level: a trailing chevron.
function DropdownSubTrigger({
  className,
  icon,
  description,
  nested = false,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props &
  ItemContentProps & {
    nested?: boolean
  }) {
  const { mobile } = useDropdown()
  const content = (
    <>
      {nested && <span aria-hidden="true" className="w-5 shrink-0" />}
      <ItemIcon icon={icon} />
      <ItemText description={description}>{children}</ItemText>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        className="size-5 shrink-0 text-icon-secondary group-data-disabled/dropdown-item:text-icon-disabled"
      />
    </>
  )

  if (mobile) {
    const { buttonProps: sheetProps } = toSheetItemProps(
      { ...props, className },
      false
    )
    return (
      <BottomSheetTrigger
        render={
          <button
            type="button"
            role="menuitem"
            aria-haspopup="menu"
            data-dropdown-item=""
            data-slot="dropdown-sub-trigger"
            data-disabled={sheetProps.disabled || undefined}
            {...sheetProps}
            className={cn(
              itemClassName,
              sheetItemClassName,
              "data-popup-open:bg-background-hover",
              sheetProps.className
            )}
          />
        }
      >
        {content}
      </BottomSheetTrigger>
    )
  }

  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-sub-trigger"
      className={cn(
        itemClassName,
        "data-popup-open:bg-background-hover",
        className
      )}
      {...props}
    >
      {content}
    </MenuPrimitive.SubmenuTrigger>
  )
}

function DropdownSubContent({
  align = "start",
  alignOffset = -9,
  side = "right",
  sideOffset = 4,
  className,
  ...props
}: React.ComponentProps<typeof DropdownContent>) {
  return (
    <DropdownContent
      data-slot="dropdown-sub-content"
      className={cn("w-auto", className)}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

// The Figma Checkbox: Icon/Secondary border, Background/Accent/Strong fill
// with an Icon/On Color tick when checked.
function CheckboxBox({ children }: { children?: React.ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-6 shrink-0 items-center justify-center rounded-sm border-2 border-icon-secondary text-icon-on-color group-data-checked/dropdown-item:border-transparent group-data-checked/dropdown-item:bg-background-accent-strong group-data-disabled/dropdown-item:border-icon-disabled group-data-disabled/dropdown-item:bg-transparent group-data-disabled/dropdown-item:text-icon-disabled"
    >
      {children}
    </span>
  )
}

const checkIcon = (
  <HugeiconsIcon
    icon={Tick02Icon}
    size={16}
    strokeWidth={2.4}
    absoluteStrokeWidth
  />
)

// Mobile checkbox item: keeps its own state when uncontrolled.
function SheetCheckboxItem({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  children,
  ...props
}: Omit<React.ComponentProps<typeof SheetItem>, "onChange"> & {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultChecked)
  const checked = checkedProp ?? uncontrolled

  return (
    <SheetItem
      role="menuitemcheckbox"
      aria-checked={checked}
      data-checked={checked || undefined}
      data-unchecked={!checked || undefined}
      {...props}
      onClick={(event) => {
        setUncontrolled(!checked)
        onCheckedChange?.(!checked)
        props.onClick?.(event)
      }}
    >
      <CheckboxBox>
        {checked && <span className="flex">{checkIcon}</span>}
      </CheckboxBox>
      {children}
    </SheetItem>
  )
}

// Figma .Dropdown Item Multiple: a leading checkbox (same visual as Checkbox).
function DropdownCheckboxItem({
  className,
  icon,
  description,
  children,
  checked,
  defaultChecked,
  onCheckedChange,
  ...props
}: MenuPrimitive.CheckboxItem.Props & ItemContentProps) {
  const { mobile } = useDropdown()
  const content = (
    <>
      <ItemIcon icon={icon} />
      <ItemText description={description}>{children}</ItemText>
    </>
  )

  if (mobile) {
    const { closeOnClick, buttonProps } = toSheetItemProps(
      { ...props, className },
      false
    )
    return (
      <SheetCheckboxItem
        data-slot="dropdown-checkbox-item"
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={
          onCheckedChange as ((checked: boolean) => void) | undefined
        }
        {...buttonProps}
        closeOnClick={closeOnClick}
      >
        {content}
      </SheetCheckboxItem>
    )
  }

  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-checkbox-item"
      className={cn(itemClassName, className)}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      {...props}
    >
      <CheckboxBox>
        <MenuPrimitive.CheckboxItemIndicator className="flex">
          {checkIcon}
        </MenuPrimitive.CheckboxItemIndicator>
      </CheckboxBox>
      {content}
    </MenuPrimitive.CheckboxItem>
  )
}

type RadioGroupContextValue = {
  value: unknown
  setValue: (value: unknown) => void
  disabled: boolean
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null
)

// Mobile radio group: keeps its own value when uncontrolled.
function SheetRadioGroup({
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled = false,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "defaultValue"> & {
  value?: unknown
  defaultValue?: unknown
  onValueChange?: (value: unknown) => void
  disabled?: boolean
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = valueProp !== undefined ? valueProp : uncontrolled
  const contextValue = React.useMemo(
    () => ({
      value,
      disabled,
      setValue: (next: unknown) => {
        setUncontrolled(next)
        onValueChange?.(next)
      },
    }),
    [value, disabled, onValueChange]
  )

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        role="group"
        data-slot="dropdown-radio-group"
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

function DropdownRadioGroup({
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  ...props
}: MenuPrimitive.RadioGroup.Props) {
  const { mobile } = useDropdown()

  if (mobile) {
    return (
      <SheetRadioGroup
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange as ((value: unknown) => void) | undefined}
        disabled={disabled}
        className={staticClassName(className)}
        {...(props as Omit<React.ComponentProps<"div">, "defaultValue">)}
      />
    )
  }

  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-radio-group"
      className={cn("flex flex-col gap-2", className)}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      {...props}
    />
  )
}

// Mobile radio item: reads and sets the group value.
function SheetRadioItem({
  value,
  disabled,
  children,
  ...props
}: React.ComponentProps<typeof SheetItem> & { value: unknown }) {
  const group = React.useContext(RadioGroupContext)
  const checked = group != null && Object.is(group.value, value)
  const isDisabled = disabled || group?.disabled

  return (
    <SheetItem
      role="menuitemradio"
      aria-checked={checked}
      data-checked={checked || undefined}
      data-unchecked={!checked || undefined}
      disabled={isDisabled}
      {...props}
      onClick={(event) => {
        group?.setValue(value)
        props.onClick?.(event)
      }}
    >
      {children}
      {checked && (
        <span
          data-slot="dropdown-radio-item-indicator"
          className="flex size-6 shrink-0 items-center justify-center"
        >
          <ItemCheck />
        </span>
      )}
    </SheetItem>
  )
}

// Figma .Dropdown Item Single: a trailing check circle when selected
// (Background/Accent/Strong circle, Icon/Inverse check).
function DropdownRadioItem({
  className,
  icon,
  description,
  children,
  value,
  ...props
}: MenuPrimitive.RadioItem.Props & ItemContentProps) {
  const { mobile } = useDropdown()
  const content = (
    <>
      <ItemIcon icon={icon} />
      <ItemText description={description}>{children}</ItemText>
    </>
  )

  if (mobile) {
    const { closeOnClick, buttonProps } = toSheetItemProps(
      { ...props, className },
      false
    )
    return (
      <SheetRadioItem
        data-slot="dropdown-radio-item"
        value={value}
        {...buttonProps}
        closeOnClick={closeOnClick}
      >
        {content}
      </SheetRadioItem>
    )
  }

  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-radio-item"
      className={cn(itemClassName, className)}
      value={value}
      {...props}
    >
      {content}
      <MenuPrimitive.RadioItemIndicator
        data-slot="dropdown-radio-item-indicator"
        className="flex size-6 shrink-0 items-center justify-center"
      >
        <ItemCheck />
      </MenuPrimitive.RadioItemIndicator>
    </MenuPrimitive.RadioItem>
  )
}

function ItemCheck() {
  return (
    <span className="flex size-5.5 items-center justify-center rounded-full bg-background-accent-strong text-icon-inverse group-data-disabled/dropdown-item:bg-background-disabled-strong group-data-disabled/dropdown-item:text-icon-disabled">
      <HugeiconsIcon
        icon={Tick02Icon}
        size={14}
        strokeWidth={2.4}
        absoluteStrokeWidth
      />
    </span>
  )
}

export {
  // Shared with Input Select, whose list is the Figma Dropdown.
  popupClassName as dropdownPopupClassName,
  bodyClassName as dropdownBodyClassName,
  itemClassName as dropdownItemClassName,
  ItemCheck as DropdownItemCheck,
  ItemIcon as DropdownItemIcon,
  ItemText as DropdownItemText,
  type ItemContentProps as DropdownItemContentProps,
  Dropdown,
  DropdownPortal,
  DropdownTrigger,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownCheckboxItem,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSeparator,
  DropdownSub,
  DropdownSubTrigger,
  DropdownSubContent,
}
