"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ArrowDown01Icon, Tick02Icon } from "@hugeicons/core-free-icons"

import { HugeiconsIcon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

// Mirrors the three Figma Stepper components in one, picked by `type`:
// - horizontal (Stepper Horizontal, Count 2–5): the steps in a row joined by
//   a Border/Primary line, at least 24px long, 16px from each step.
// - vertical (Stepper Vertical, Steps 2–5, Accordion): the steps in a
//   column with their description; with `accordion` each step opens its
//   `content` below the header.
// - simple (Stepper Simple, Steps 2–5, Current Step): one 4px bar per step
//   and "Etapa X de Y".
// Each step's Status comes from `currentStep` (1-based): the steps before it
// are Success, it is Active and the ones after are Default.

type StepStatus = "default" | "active" | "success"

type StepperStep = {
  label: React.ReactNode
  /** Figma "Show Description" (vertical). */
  description?: React.ReactNode
  /** Vertical with `accordion`: what the step shows when open. */
  content?: React.ReactNode
}

type StepperProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Figma component: Stepper Horizontal, Vertical or Simple. */
  type?: "horizontal" | "vertical" | "simple"
  /** Figma Count / Steps. Simple only needs how many there are. */
  steps: readonly StepperStep[] | number
  /** Figma Current Step, from 1. Past the last step, every step is Success. */
  currentStep: number
  /** Figma Accordion (vertical): each step opens and closes its content. */
  accordion?: boolean
  /** Vertical accordion: the open steps (indexes from 0). */
  openSteps?: number[]
  /** Vertical accordion: starts with these steps open; the current one by default. */
  defaultOpenSteps?: number[]
  onOpenStepsChange?: (openSteps: number[]) => void
  /** Simple: the label under the bars. */
  formatLabel?: (currentStep: number, total: number) => React.ReactNode
}

const statusOf = (index: number, currentStep: number): StepStatus =>
  index + 1 < currentStep
    ? "success"
    : index + 1 === currentStep
      ? "active"
      : "default"

// Figma .Step Icon: 24px circle. Default is outlined in Icon/Secondary with
// the number in Text/Secondary; Active fills Background/Accent/Strong with
// the number in Text/On Color; Success fills Background/Success/Strong with
// the 16px Check in Icon/On Color.
function StepIcon({ status, number }: { status: StepStatus; number: number }) {
  return (
    <span
      data-slot="stepper-icon"
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full text-center text-label-medium",
        status === "default" &&
          "border border-icon-secondary text-text-secondary",
        status === "active" && "bg-background-accent-strong text-text-on-color",
        status === "success" &&
          "bg-background-success-strong text-icon-on-color"
      )}
    >
      {status === "success" ? (
        <HugeiconsIcon
          icon={Tick02Icon}
          size={16}
          strokeWidth={1.8}
          absoluteStrokeWidth
        />
      ) : (
        number
      )}
    </span>
  )
}

// Label/Medium: Text/Secondary (Default), Text/Accent/Standard (Active) or
// Text/Primary (Success).
const labelColor: Record<StepStatus, string> = {
  default: "text-text-secondary",
  active: "text-text-accent-standard",
  success: "text-text-primary",
}

// Body/Small: like the label, but Text/Secondary when Success.
const descriptionColor: Record<StepStatus, string> = {
  default: "text-text-secondary",
  active: "text-text-accent-standard",
  success: "text-text-secondary",
}

// Figma Stroke: a 1px Border/Primary line through the middle of the icon.
const verticalLine = "w-px flex-1 bg-border-primary"

function StepText({ status, step }: { status: StepStatus; step: StepperStep }) {
  return (
    <span className="flex min-h-8 min-w-0 flex-1 flex-col justify-center gap-0.5 text-left">
      <span
        data-slot="stepper-label"
        className={cn("min-h-6 truncate text-label-medium", labelColor[status])}
      >
        {step.label}
      </span>
      {step.description != null && (
        <span
          data-slot="stepper-description"
          className={cn("text-body-small", descriptionColor[status])}
        >
          {step.description}
        </span>
      )}
    </span>
  )
}

// Figma Indicator: the icon, centered on the text up to 47px (label +
// description).
function Indicator({ status, number }: { status: StepStatus; number: number }) {
  return (
    <span className="flex max-h-[47px] shrink-0 items-center self-stretch">
      <StepIcon status={status} number={number} />
    </span>
  )
}

function Stepper({
  className,
  type = "horizontal",
  steps,
  currentStep,
  accordion = false,
  openSteps,
  defaultOpenSteps,
  onOpenStepsChange,
  formatLabel = (current, total) => `Etapa ${current} de ${total}`,
  ...props
}: StepperProps) {
  const total = typeof steps === "number" ? steps : steps.length
  const items: readonly StepperStep[] =
    typeof steps === "number"
      ? Array.from({ length: steps }, (_, index) => ({
          label: `${index + 1}`,
        }))
      : steps

  // Figma Stepper Simple: 8px between the bars, Background/Accent/Strong up
  // to the current step and Background/Disabled/Strong after it; the label
  // (Label/Small, Text/Accent/Standard) 12px below.
  if (type === "simple") {
    const current = Math.min(Math.max(currentStep, 1), total)
    return (
      <div
        data-slot="stepper"
        data-type="simple"
        className={cn("flex w-full flex-col gap-3", className)}
        {...props}
      >
        <div aria-hidden="true" className="flex w-full items-center gap-2">
          {Array.from({ length: total }, (_, index) => (
            <span
              key={index}
              data-slot="stepper-bar"
              className={cn(
                "h-1 min-w-px flex-1 rounded-full",
                index < current
                  ? "bg-background-accent-strong"
                  : "bg-background-disabled-strong"
              )}
            />
          ))}
        </div>
        <span
          data-slot="stepper-label"
          className="text-label-small text-text-accent-standard"
        >
          {formatLabel(current, total)}
        </span>
      </div>
    )
  }

  // Figma Stepper Horizontal: steps 16px from a line that fills the space
  // (at least 24px); each step is the icon and Label/Medium 12px apart.
  if (type === "horizontal") {
    return (
      <ol
        data-slot="stepper"
        data-type="horizontal"
        className={cn("flex w-full items-center gap-4", className)}
        {...(props as React.ComponentProps<"ol">)}
      >
        {items.map((step, index) => {
          const status = statusOf(index, currentStep)
          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <li
                  aria-hidden="true"
                  className="h-px min-w-6 flex-1 bg-border-primary"
                />
              )}
              <li
                data-slot="stepper-step"
                data-status={status}
                aria-current={status === "active" ? "step" : undefined}
                className="flex shrink-0 items-center gap-3"
              >
                <StepIcon status={status} number={index + 1} />
                <span
                  data-slot="stepper-label"
                  className={cn(
                    "text-label-medium whitespace-nowrap",
                    labelColor[status]
                  )}
                >
                  {step.label}
                </span>
              </li>
            </React.Fragment>
          )
        })}
      </ol>
    )
  }

  // Figma Stepper Vertical: each step is a Header (Indicator, Text and, with
  // Accordion, a 20px Chevron in Icon/Secondary, 12px apart) and a Body with
  // the line in the 24px Indicator column, 8px above and below. The last
  // step has no Body.
  if (!accordion) {
    return (
      <ol
        data-slot="stepper"
        data-type="vertical"
        className={cn("flex w-full flex-col", className)}
        {...(props as React.ComponentProps<"ol">)}
      >
        {items.map((step, index) => {
          const status = statusOf(index, currentStep)
          return (
            <li
              key={index}
              data-slot="stepper-step"
              data-status={status}
              aria-current={status === "active" ? "step" : undefined}
              className="flex flex-col"
            >
              <div className="flex gap-3">
                <Indicator status={status} number={index + 1} />
                <StepText status={status} step={step} />
              </div>
              {index < total - 1 && (
                <div
                  aria-hidden="true"
                  className="flex w-6 justify-center py-2"
                >
                  <span className={cn(verticalLine, "h-4 flex-none")} />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    )
  }

  return (
    <AccordionPrimitive.Root
      data-slot="stepper"
      data-type="vertical"
      multiple
      value={openSteps}
      defaultValue={
        openSteps ? undefined : (defaultOpenSteps ?? [currentStep - 1])
      }
      onValueChange={(value) => onOpenStepsChange?.(value as number[])}
      className={cn("flex w-full flex-col", className)}
      {...(props as Omit<AccordionPrimitive.Root.Props, "value">)}
    >
      {items.map((step, index) => {
        const status = statusOf(index, currentStep)
        const last = index === total - 1
        return (
          <AccordionPrimitive.Item
            key={index}
            value={index}
            data-slot="stepper-step"
            data-status={status}
            className="group/stepper-step flex flex-col"
          >
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger
                aria-current={status === "active" ? "step" : undefined}
                className="group/stepper-trigger flex w-full cursor-pointer gap-3 rounded-sm text-left outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-border-accent-strong focus-visible:outline-solid"
              >
                <Indicator status={status} number={index + 1} />
                <StepText status={status} step={step} />
                <span className="flex shrink-0 items-center self-stretch">
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    data-slot="stepper-chevron"
                    className="size-5 text-icon-secondary transition-transform group-aria-expanded/stepper-trigger:rotate-180"
                  />
                </span>
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            {/* Closed: the 16px line, like Stepper Vertical. */}
            {!last && (
              <div
                aria-hidden="true"
                className="flex w-6 justify-center py-2 group-data-open/stepper-step:hidden"
              >
                <span className={cn(verticalLine, "h-4 flex-none")} />
              </div>
            )}
            {/* Open: the line runs along the content (12px above and below). */}
            <AccordionPrimitive.Panel
              data-slot="stepper-content"
              className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-200 data-ending-style:h-0 data-starting-style:h-0"
            >
              <div className="flex gap-3 py-2">
                <div
                  aria-hidden="true"
                  className="flex w-6 shrink-0 flex-col items-center"
                >
                  {!last && <span className={verticalLine} />}
                </div>
                <div className="min-w-0 flex-1 py-3 text-body-medium text-text-primary">
                  {step.content}
                </div>
              </div>
            </AccordionPrimitive.Panel>
          </AccordionPrimitive.Item>
        )
      })}
    </AccordionPrimitive.Root>
  )
}

export { Stepper, type StepperProps, type StepperStep }
