import * as React from "react"

import {
  ChartLegend,
  chartColor,
  chartTypeOptions,
  formatChartTypedValue,
  typedChartNumber,
  type ChartColor,
  type ChartValueType,
} from "@/components/ui/chart-legend"
import { cn } from "@/lib/utils"

// Mirrors the Figma Chart Donut: the ring, the Label + Value in its center and
// the Legend. Items are not variants here: they come from `items`, so any amount
// works, and the slices, the Legend and the center all follow the values.
//
// Each slice is a share of the ring, clockwise from the top. Where the items
// don't reach `total` the Track shows, as in Items=1.
//
// `valueType` says what the values are. The Legend shows them in full and the
// center abbreviates them: 10 mil, R$ 11 mi, 12 bi.
//
// The width follows the container. With the Legend on the right and no room for
// it, the Legend moves below the ring. Chart Donut X-Small is `size="x-small"`:
// one item, shown as the ring and its share, for tight spots.

// `headingLength` and `labelLength` are the characters of Heading/Medium and of
// Label/Medium that fit inside each ring. Longer values step down a size.
const rings = {
  large: { box: 240, stroke: 16, headingLength: 16, labelLength: 26 },
  medium: { box: 134, stroke: 8, headingLength: 10, labelLength: 13 },
  "x-small": { box: 56, stroke: 4, headingLength: 0, labelLength: 8 },
}

type ChartDonutSize = keyof typeof rings

type ChartDonutValueType = ChartValueType

type ChartDonutItem = {
  /** The name in the Legend. */
  label: string
  /** Of any size. Below zero or `null`, it takes no part of the ring. */
  value: number | null
  /** Figma Chart/1 to Chart/10. By default, the position in `items`. */
  color?: ChartColor
}

type ChartDonutProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Figma Items. X-Small only shows the first one. */
  items: ChartDonutItem[]
  /**
   * The Total: what a full ring stands for, and what the center shows. By
   * default, the sum of the items. Where they don't reach it, the Track shows.
   */
  total?: number
  /** Figma Legend. */
  legend?: "bottom" | "right"
  /** Figma Size. X-Small has no Label and no Legend, and shows one item. */
  size?: ChartDonutSize
  /** Figma Label, in the center. */
  label?: React.ReactNode
  /**
   * Figma Value, in the center. By default, the Total. At X-Small, which has no
   * room for it, the share of its item. A number is abbreviated like the Total.
   */
  value?: React.ReactNode
  /** What the values are. As `percent`, 75 reads 75%. */
  valueType?: ChartDonutValueType
  /** The ISO code of the money, for `valueType="currency"`. */
  currency?: string
}

const knownValue = (value: number | null) =>
  typeof value === "number" && Number.isFinite(value) ? value : null

const share = (value: number, whole: number) => (whole > 0 ? value / whole : 0)

const formatShare = (ratio: number) =>
  ratio.toLocaleString("pt-BR", {
    style: "percent",
    maximumFractionDigits: 1,
  })

function formatAbbreviated(
  value: number,
  valueType: ChartDonutValueType,
  currency: string
) {
  const number = typedChartNumber(value, valueType)
  const size = Math.abs(number)

  return number.toLocaleString("pt-BR", {
    ...chartTypeOptions(valueType, currency),
    // Past the trillions, pt-BR has no more words.
    notation: size >= 1e15 ? "scientific" : "compact",
    ...(size > 0 && size < 1
      ? { maximumSignificantDigits: 3 }
      : { maximumFractionDigits: 1 }),
  })
}

function ChartDonut({
  items,
  total,
  legend = "bottom",
  size = "medium",
  label,
  value,
  valueType = "number",
  currency = "BRL",
  "aria-label": ariaLabel,
  className,
  ...props
}: ChartDonutProps) {
  const { box, stroke, headingLength, labelLength } = rings[size]
  const xSmall = size === "x-small"
  const radius = (box - stroke) / 2
  const center = box / 2

  const shownItems = (xSmall ? items.slice(0, 1) : items).map((item, index) => {
    const known = knownValue(item.value)

    return {
      ...item,
      known,
      amount: Math.max(known ?? 0, 0),
      stroke: chartColor(item.color, index),
    }
  })
  const sum = shownItems.reduce((all, { amount }) => all + amount, 0)
  // Items past `total` can't overflow the ring.
  const whole = Math.max(total ?? sum, sum)

  const slices = shownItems.reduce<
    { id: number; stroke: string; start: number; length: number }[]
  >((all, { amount, stroke: color }, id) => {
    const previous = all[all.length - 1]
    const start = previous ? previous.start + previous.length : 0

    return [
      ...all,
      { id, stroke: color, start, length: share(amount, whole) * 100 },
    ]
  }, [])

  // The value each slice shows, so the Legend always reads what the ring draws.
  const legendItems = shownItems.map(
    ({ label: name, known, amount, stroke: color }) => ({
      label: name,
      value:
        known === null
          ? "–"
          : formatChartTypedValue(amount, valueType, currency),
      color,
    })
  )

  const givenValue =
    typeof value === "number"
      ? formatAbbreviated(value, valueType, currency)
      : value
  const centerValue =
    givenValue ??
    (xSmall
      ? formatShare(share(shownItems[0]?.amount ?? 0, whole))
      : formatAbbreviated(whole, valueType, currency))
  const valueLength = String(centerValue).length

  const ring = (
    <div
      data-slot="chart-donut-chart"
      className={cn("relative shrink-0", {
        "size-14": xSmall,
        "aspect-square w-[134px] max-w-full": size === "medium",
        "aspect-square w-60 max-w-full": size === "large",
      })}
    >
      <svg
        role="img"
        aria-label={
          ariaLabel ??
          legendItems.map((item) => `${item.label}: ${item.value}`).join(", ")
        }
        viewBox={`0 0 ${box} ${box}`}
        className="absolute inset-0 size-full -rotate-90"
      >
        <circle
          data-slot="chart-donut-track"
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-border-secondary"
        />
        {slices.map(({ id, stroke: color, start, length }) =>
          length > 0 ? (
            <circle
              key={id}
              data-slot="chart-donut-slice"
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={stroke}
              pathLength={100}
              strokeDasharray={`${length} ${100 - length}`}
              strokeDashoffset={-start}
            />
          ) : null
        )}
      </svg>
      <div
        data-slot="chart-donut-center"
        className="absolute top-[calc(50%-0.5px)] left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center whitespace-nowrap text-text-primary"
        style={{ maxWidth: `calc(100% - ${stroke * 2 + 8}px)` }}
      >
        {!xSmall && label && (
          <p className="max-w-full truncate text-label-medium">{label}</p>
        )}
        <p
          // A value too long for the ring can still be read in full.
          title={String(centerValue)}
          className={cn(
            "max-w-full truncate",
            valueLength <= headingLength
              ? "text-heading-medium"
              : valueLength <= labelLength
                ? "text-label-medium"
                : "text-label-small"
          )}
        >
          {centerValue}
        </p>
      </div>
    </div>
  )

  if (xSmall) {
    return (
      <div
        data-slot="chart-donut"
        data-size={size}
        className={cn("inline-flex", className)}
        {...props}
      >
        {ring}
      </div>
    )
  }

  const onRight = legend === "right"

  return (
    <div
      data-slot="chart-donut"
      data-size={size}
      data-legend={legend}
      className={cn("@container w-full", className)}
      {...props}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-10",
          onRight && "@lg:flex-row"
        )}
      >
        {ring}
        <ChartLegend
          format={onRight ? "inline" : "list"}
          items={legendItems}
          className={cn(onRight && "@lg:min-w-0 @lg:flex-1 @lg:justify-start")}
        />
      </div>
    </div>
  )
}

export {
  ChartDonut,
  type ChartDonutItem,
  type ChartDonutProps,
  type ChartDonutSize,
  type ChartDonutValueType,
}
