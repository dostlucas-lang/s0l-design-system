import * as React from "react"

import {
  ChartLegend,
  chartColor,
  formatChartTypedValue,
  type ChartColor,
  type ChartValueType,
} from "@/components/ui/chart-legend"
import { cn } from "@/lib/utils"

// Mirrors the Figma Chart Bar: the Legend as a List, the Bars and, past one
// item, the total row (a Chart Legend Item with Color=None). Items are not
// variants here: they come from `items`, so any amount works, and the segments,
// the Legend and the total all follow the values.
//
// Each segment is as wide as its share of the bar, left to right in the order
// of `items`: the width always follows the value. The Figma segments are all
// the same width only because the samples are. The total row always shows the
// sum of the items.
//
// By default the items fill the bar. With a `max` above their sum, the rest of
// the Track shows, as in Items=1.
//
// The width is 100% of the container.

type ChartBarValueType = ChartValueType

type ChartBarItem = {
  /** The name in the Legend. */
  label: string
  /** Of any size. Below zero or `null`, it takes no part of the bar. */
  value: number | null
  /** Figma Chart/1 to Chart/10. By default, the position in `items`. */
  color?: ChartColor
}

type ChartBarProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Figma Items. */
  items: ChartBarItem[]
  /**
   * What a full bar stands for. By default, the sum of the items. Above it, the
   * rest of the Track shows. It never changes the total row, which is the sum.
   */
  max?: number
  /** The label of the total row. */
  totalLabel?: string
  /** The total row. By default, only past one item, as in Figma. */
  showTotal?: boolean
  /** What the values are. As `percent`, 75 reads 75%. */
  valueType?: ChartBarValueType
  /** The ISO code of the money, for `valueType="currency"`. */
  currency?: string
}

const knownValue = (value: number | null) =>
  typeof value === "number" && Number.isFinite(value) ? value : null

function ChartBar({
  items,
  max,
  totalLabel = "Total",
  showTotal,
  valueType = "number",
  currency = "BRL",
  "aria-label": ariaLabel,
  className,
  ...props
}: ChartBarProps) {
  const shownItems = items.map((item, index) => {
    const known = knownValue(item.value)

    return {
      ...item,
      known,
      amount: Math.max(known ?? 0, 0),
      fill: chartColor(item.color, index),
    }
  })
  const sum = shownItems.reduce((all, { amount }) => all + amount, 0)
  // Items past `max` can't overflow the bar.
  const whole = Math.max(knownValue(max ?? null) ?? sum, sum)
  const format = (value: number) =>
    formatChartTypedValue(value, valueType, currency)

  // The value each segment shows, so the Legend always reads what the bar draws.
  const legendItems = shownItems.map(({ label, known, amount, fill }) => ({
    label,
    value: known === null ? "–" : format(amount),
    color: fill,
  }))

  return (
    <div
      data-slot="chart-bar"
      className={cn("flex w-full flex-col justify-center gap-4", className)}
      {...props}
    >
      <ChartLegend format="list" items={legendItems} />
      <div
        role="img"
        aria-label={
          ariaLabel ??
          legendItems.map((item) => `${item.label}: ${item.value}`).join(", ")
        }
        data-slot="chart-bar-bars"
        className="flex h-4 w-full overflow-hidden rounded-sm bg-background-disabled-soft"
      >
        {shownItems.map(({ amount, fill }, index) =>
          amount > 0 && whole > 0 ? (
            <span
              key={index}
              data-slot="chart-bar-item"
              className="h-full shrink-0"
              style={{
                width: `${(amount / whole) * 100}%`,
                backgroundColor: fill,
              }}
            />
          ) : null
        )}
      </div>
      {(showTotal ?? items.length > 1) && (
        <ChartLegend
          data-slot="chart-bar-total"
          format="list"
          items={[{ label: totalLabel, value: format(sum) }]}
        />
      )}
    </div>
  )
}

export {
  ChartBar,
  type ChartBarItem,
  type ChartBarProps,
  type ChartBarValueType,
}
