import { cn } from "@/lib/utils"

// Mirrors the Figma Chart Legend, shared by the charts: Inline wraps its items
// and List stacks them, with the values on the right. An item with no `color`
// is the Figma Color=None: no swatch, as in the total row of the Chart Bar.

type ChartColor = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

type ChartLegendItem = {
  label: string
  value: string
  /** The CSS color of the item, from `chartColor`. Without it, no swatch. */
  color?: string
}

type ChartLegendProps = Omit<React.ComponentProps<"ul">, "children"> & {
  /** Figma Format. */
  format?: "inline" | "list"
  items: ChartLegendItem[]
}

/** Figma Chart/1 to Chart/10. By default, the position in the chart. */
const chartColor = (color: ChartColor | undefined, index: number) =>
  `var(--s0l-chart-${color ?? (index % 10) + 1})`

const formatChartValue = (value: number) =>
  value.toLocaleString("pt-BR", { maximumSignificantDigits: 15 })

/** What the values of a chart are. As `percent`, 75 reads 75%. */
type ChartValueType = "number" | "currency" | "percent"

const chartTypeOptions = (
  valueType: ChartValueType,
  currency: string
): Intl.NumberFormatOptions => {
  if (valueType === "currency") return { style: "currency", currency }

  return valueType === "percent" ? { style: "percent" } : {}
}

// `percent` values are already in percent: Intl expects a ratio.
const typedChartNumber = (value: number, valueType: ChartValueType) =>
  valueType === "percent" ? value / 100 : value

/** A value in full, as the Legend shows it. */
function formatChartTypedValue(
  value: number,
  valueType: ChartValueType,
  currency: string
) {
  return typedChartNumber(value, valueType).toLocaleString("pt-BR", {
    ...chartTypeOptions(valueType, currency),
    ...(valueType === "currency"
      ? {}
      : valueType === "percent"
        ? { maximumFractionDigits: 2 }
        : { maximumSignificantDigits: 15 }),
  })
}

function ChartLegendSwatch({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="size-4 shrink-0 rounded-full"
      style={{ backgroundColor: color }}
    />
  )
}

function ChartLegend({
  format = "inline",
  items,
  className,
  ...props
}: ChartLegendProps) {
  const list = format === "list"

  return (
    <ul
      data-slot="chart-legend"
      data-format={format}
      className={cn(
        "flex w-full",
        list ? "flex-col gap-3" : "flex-wrap items-center justify-center gap-6",
        className
      )}
      {...props}
    >
      {items.map(({ label, value, color }, index) => (
        <li
          key={index}
          className={cn("flex gap-3", list ? "min-h-6" : "items-center")}
        >
          {color === undefined ? null : list ? (
            <span className="flex min-h-6 items-center">
              <ChartLegendSwatch color={color} />
            </span>
          ) : (
            <ChartLegendSwatch color={color} />
          )}
          <p
            className={cn(
              "flex text-body-medium",
              list ? "min-w-0 flex-1 gap-2" : "gap-1.5 whitespace-nowrap"
            )}
          >
            <span className={cn("text-text-primary", list && "min-w-0 flex-1")}>
              {label}
            </span>
            <span
              className={cn(
                "text-text-secondary",
                list && "shrink-0 text-right whitespace-nowrap"
              )}
            >
              {value}
            </span>
          </p>
        </li>
      ))}
    </ul>
  )
}

export {
  ChartLegend,
  ChartLegendSwatch,
  chartColor,
  chartTypeOptions,
  formatChartTypedValue,
  formatChartValue,
  typedChartNumber,
  type ChartColor,
  type ChartLegendItem,
  type ChartLegendProps,
  type ChartValueType,
}
