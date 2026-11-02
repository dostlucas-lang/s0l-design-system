"use client"

import * as React from "react"

import {
  ChartLegend,
  ChartLegendSwatch,
  chartColor,
  type ChartColor,
  formatChartValue,
} from "@/components/ui/chart-legend"
import { cn } from "@/lib/utils"

// Mirrors the Figma Chart Line: Y Axis, X Axis + Lines, and the Legend. Lines and
// Nodes are not variants here: they come from `lines` and `xLabels`, so any
// amount works, and with no `xLabels` the longest line sets the nodes. Each
// .Chart Line Segment leaves a node flat and arrives at the next one flat, with
// its control points crossed at 2/3 of the way.
//
// The numbers in Figma are samples: the Y Axis starts at 0 and grows with the
// values, which can be of any size or sign, and the Legend shows each line's
// total. A node with no value leaves a gap in its line.
//
// The width follows the container: the plot stretches and only the strokes keep
// their 2px, so nothing has to be measured to draw it. Measuring only thins out
// the X labels that no longer fit and flips the overlay near the right edge.
//
// Hovering a node shows the Hover Handoff: the Border/Strong line, the Medium
// label, one .Indicator Value per line and the Chart Line Legend Overlay.

// Figma Chart Line Frame: the lines take 191px and the X labels the other 32px.
const plotHeight = 191
const tickHeight = 21

const overlayWidth = 153
const overlayGap = 16

// Roughly what a Body/Small character takes, to tell when the labels collide.
const labelCharWidth = 7
const labelGap = 3

type ChartLineSeries = {
  /** The name in the Legend. */
  label: string
  /** One value per node, of any size. `null` leaves a gap in the line. */
  values: (number | null)[]
  /** Figma Chart/1 to Chart/10. By default, the position in `lines`. */
  color?: ChartColor
}

type ChartLineProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Figma Lines. */
  lines: ChartLineSeries[]
  /**
   * Figma Nodes: one label per node, on the X Axis. Without them, the longest
   * line sets the nodes, numbered from 1.
   */
  xLabels?: string[]
  /**
   * The Y Axis labels. By default they come from the values. A value outside
   * these stops at the edge of the chart.
   */
  yTicks?: number[]
  /** What the overlay and the Legend show for a value. */
  formatValue?: (value: number) => string
}

const nodeRatio = (index: number, nodeCount: number) =>
  nodeCount > 1 ? index / (nodeCount - 1) : 0.5

const niceStep = (range: number) => {
  const magnitude = 10 ** Math.floor(Math.log10(range))
  const step = [1, 2, 2.5, 5, 10].find(
    (multiple) => multiple * magnitude >= range
  )

  return (step ?? 10) * magnitude
}

const stepDecimals = (step: number) =>
  Math.min(Math.max(Math.ceil(-Math.log10(step)) + 1, 0), 100)

// One entry per node: extra values are dropped and a bad or missing one is a gap.
const getLinePoints = (values: (number | null)[], nodeCount: number) =>
  Array.from({ length: nodeCount }, (_, node) => {
    const value = values[node]

    return typeof value === "number" && Number.isFinite(value) ? value : null
  })

function getTicks(lines: ChartLineSeries[], nodeCount: number) {
  const values = lines
    .flatMap((line) => getLinePoints(line.values, nodeCount))
    .filter((value) => value !== null)
  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 0
  const low = Math.min(min, 0)
  const high = Math.max(max, 0) || (low === 0 ? 1 : 0)
  const step = niceStep((high - low) / 4)
  const top = Math.ceil(high / step)
  const bottom = Math.floor(low / step)

  return Array.from(
    { length: top - bottom + 1 },
    (_, index) =>
      // Drops the float noise, and the sign of -0.
      Number(((top - index) * step).toFixed(stepDecimals(step))) + 0
  )
}

// Long numbers shorten, unless that would make two labels read the same.
function formatTick(tick: number, ticks: number[]) {
  if (tick === 0) return "0"

  const step = Math.abs(ticks[0] - ticks[1])
  const largest = Math.max(...ticks.map(Math.abs))
  const shortens = step >= largest / 100

  if (shortens && (largest >= 1e15 || largest < 1e-4)) {
    return tick.toLocaleString("pt-BR", {
      notation: "scientific",
      maximumFractionDigits: 2,
    })
  }

  return tick.toLocaleString(
    "pt-BR",
    shortens && largest >= 1e6
      ? { notation: "compact", maximumFractionDigits: 2 }
      : { maximumFractionDigits: stepDecimals(step) }
  )
}

// A value sits level with its label, whatever the distance between the labels.
function valueToY(value: number, ticks: number[]) {
  const step = (plotHeight - tickHeight) / (ticks.length - 1)
  const firstBelow = ticks.findIndex((tick) => tick <= value)
  const lower = firstBelow === -1 ? ticks.length - 1 : Math.max(firstBelow, 1)
  const progress = (value - ticks[lower]) / (ticks[lower - 1] - ticks[lower])
  const y = tickHeight / 2 + step * (lower - progress)

  return Math.min(Math.max(y, 0), plotHeight)
}

function linePath(ys: (number | null)[], nodeCount: number) {
  const x = (index: number) => nodeRatio(index, nodeCount) * 100

  return ys
    .map((y, index) => {
      if (y === null) return ""

      const previous = ys[index - 1] ?? null
      if (previous === null) return `M${x(index)} ${y}`

      const start = x(index - 1)
      const width = x(index) - start

      return `C${start + (width * 2) / 3} ${previous} ${start + width / 3} ${y} ${x(index)} ${y}`
    })
    .join("")
}

function ChartLine({
  lines,
  xLabels: givenLabels,
  yTicks,
  formatValue = formatChartValue,
  "aria-label": ariaLabel = "Gráfico de linhas",
  className,
  ...props
}: ChartLineProps) {
  const plotRef = React.useRef<HTMLDivElement>(null)
  const [plotWidth, setPlotWidth] = React.useState(0)
  const [chosenNode, setActiveNode] = React.useState<number | null>(null)

  React.useEffect(() => {
    const plot = plotRef.current
    if (!plot) return

    const observer = new ResizeObserver(([entry]) =>
      setPlotWidth(entry.contentRect.width)
    )
    observer.observe(plot)

    return () => observer.disconnect()
  }, [])

  const xLabels =
    givenLabels ??
    Array.from(
      { length: Math.max(0, ...lines.map(({ values }) => values.length)) },
      (_, node) => String(node + 1)
    )
  const nodeCount = xLabels.length
  // The data can change under the pointer, and leave fewer nodes than before.
  const activeNode =
    chosenNode !== null && chosenNode >= 0 && chosenNode < nodeCount
      ? chosenNode
      : null
  const givenTicks = [...new Set(yTicks)]
    .filter(Number.isFinite)
    .sort((a, b) => b - a)
  const ticks = givenTicks.length > 1 ? givenTicks : getTicks(lines, nodeCount)
  const lastNode = nodeCount - 1
  const shownLines = lines.map((line, index) => {
    const points = getLinePoints(line.values, nodeCount)
    const known = points.filter((value) => value !== null)

    return {
      ...line,
      id: index,
      points,
      total: known.length
        ? formatValue(known.reduce((sum, value) => sum + value, 0))
        : "–",
      stroke: chartColor(line.color, index),
      ys: points.map((value) =>
        value === null ? null : valueToY(value, ticks)
      ),
    }
  })
  // The first line stays on top, as in Figma.
  const stackedLines = [...shownLines].reverse()

  const longestLabel = Math.max(0, ...xLabels.map(({ length }) => length))
  const labelStep =
    plotWidth > 0 && lastNode > 0
      ? Math.ceil(
          (longestLabel * labelCharWidth + labelGap) / (plotWidth / lastNode)
        )
      : 1
  const isNodeShown = (index: number) =>
    index % labelStep === 0 || index === activeNode
  // The hovered label takes the place of a neighbor it would land on.
  const isLabelShown = (index: number) =>
    index === activeNode ||
    (isNodeShown(index) &&
      (activeNode === null || Math.abs(index - activeNode) >= labelStep))

  const nodeFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const { left, width } = event.currentTarget.getBoundingClientRect()
    const node = Math.round(((event.clientX - left) / width) * lastNode)

    setActiveNode(Math.min(Math.max(node, 0), lastNode))
  }

  const moveWithKeyboard = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const current = activeNode ?? 0
    const next = {
      ArrowRight: Math.min(current + 1, lastNode),
      ArrowLeft: Math.max(current - 1, 0),
      Home: 0,
      End: lastNode,
    }[event.key]

    if (event.key === "Escape") setActiveNode(null)
    if (next === undefined) return

    event.preventDefault()
    setActiveNode(next)
  }

  const activeLeft =
    activeNode === null ? 0 : nodeRatio(activeNode, nodeCount) * plotWidth
  const overlayFits = activeLeft + overlayGap + overlayWidth <= plotWidth

  return (
    <div
      data-slot="chart-line"
      className={cn("flex w-full flex-col gap-4", className)}
      {...props}
    >
      <div className="flex h-[223px] w-full">
        <div
          data-slot="chart-line-y-axis"
          className="flex h-[191px] shrink-0 flex-col items-end justify-between text-body-small whitespace-nowrap text-text-secondary"
        >
          {ticks.map((tick) => (
            <p key={tick}>{formatTick(tick, ticks)}</p>
          ))}
        </div>
        <div
          ref={plotRef}
          role="group"
          tabIndex={0}
          aria-label={ariaLabel}
          data-slot="chart-line-plot"
          className="relative mx-5 min-w-0 flex-1 cursor-pointer rounded-xs outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-accent-strong focus-visible:outline-solid"
          onPointerDown={nodeFromPointer}
          onPointerMove={nodeFromPointer}
          onPointerLeave={() => setActiveNode(null)}
          onKeyDown={moveWithKeyboard}
          onFocus={(event) => {
            if (event.target.matches(":focus-visible")) setActiveNode(0)
          }}
          onBlur={() => setActiveNode(null)}
        >
          <svg
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[191px] w-full overflow-visible"
          >
            {xLabels.map((label, index) => {
              if (!isNodeShown(index)) return null

              const x = `${nodeRatio(index, nodeCount) * 100}%`

              return (
                <line
                  key={`${label}-${index}`}
                  data-slot="chart-line-divider"
                  x1={x}
                  x2={x}
                  y1="0"
                  y2="100%"
                  strokeDasharray="4 4"
                  strokeDashoffset="2"
                  shapeRendering="crispEdges"
                  className={
                    index === activeNode
                      ? "stroke-border-strong"
                      : "stroke-border-primary"
                  }
                />
              )
            })}
          </svg>
          <svg
            aria-hidden="true"
            viewBox={`0 0 100 ${plotHeight}`}
            preserveAspectRatio="none"
            className="absolute inset-x-0 top-0 h-[191px] w-full overflow-visible"
          >
            {stackedLines.map(({ id, stroke, ys }) => (
              <path
                key={id}
                data-slot="chart-line-item"
                d={linePath(ys, nodeCount)}
                fill="none"
                stroke={stroke}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
          {/* A value with no neighbors has no line to show it. */}
          {stackedLines.flatMap(({ id, stroke, ys }) =>
            ys.map((y, index) =>
              y !== null &&
              (ys[index - 1] ?? null) === null &&
              (ys[index + 1] ?? null) === null ? (
                <span
                  key={`${id}-${index}`}
                  aria-hidden="true"
                  data-slot="chart-line-point"
                  className="pointer-events-none absolute size-1.5 -translate-1/2 rounded-full"
                  style={{
                    left: `${nodeRatio(index, nodeCount) * 100}%`,
                    top: y,
                    backgroundColor: stroke,
                  }}
                />
              ) : null
            )
          )}
          <div
            data-slot="chart-line-x-axis"
            className="absolute inset-x-0 top-[191px] h-8 text-body-small whitespace-nowrap text-text-secondary"
          >
            {xLabels.map((label, index) =>
              isLabelShown(index) ? (
                <p
                  key={`${label}-${index}`}
                  className={cn(
                    "absolute top-[11px] -translate-x-1/2",
                    index === activeNode && "text-label-small text-text-primary"
                  )}
                  style={{ left: `${nodeRatio(index, nodeCount) * 100}%` }}
                >
                  {label}
                </p>
              ) : null
            )}
          </div>
          {activeNode !== null && (
            <>
              {stackedLines.map(({ id, stroke, ys }) =>
                ys[activeNode] === null ? null : (
                  <span
                    key={id}
                    aria-hidden="true"
                    data-slot="chart-line-indicator"
                    className="pointer-events-none absolute box-content size-4 -translate-1/2 rounded-full border-2 border-border-inverse-strong"
                    style={{
                      left: `${nodeRatio(activeNode, nodeCount) * 100}%`,
                      top: ys[activeNode],
                      backgroundColor: stroke,
                    }}
                  />
                )
              )}
              <div
                aria-hidden="true"
                data-slot="chart-line-overlay"
                className="pointer-events-none absolute top-[95.5px] z-10 flex w-max -translate-y-1/2 flex-col gap-3 rounded-md border border-border-secondary bg-background-primary px-[15px] py-[11px] shadow-sm"
                style={
                  overlayFits
                    ? { left: activeLeft + overlayGap }
                    : { right: plotWidth - activeLeft + overlayGap }
                }
              >
                {shownLines.map(({ id, stroke, points }) => {
                  const value = points[activeNode]

                  return (
                    <div key={id} className="flex items-center gap-3">
                      <ChartLegendSwatch color={stroke} />
                      <p className="text-body-medium whitespace-nowrap text-text-primary">
                        {value === null ? "–" : formatValue(value)}
                      </p>
                    </div>
                  )
                })}
              </div>
            </>
          )}
          <p aria-live="polite" className="sr-only">
            {activeNode !== null &&
              [
                xLabels[activeNode],
                ...shownLines.map(({ label, points }) => {
                  const value = points[activeNode]

                  return `${label}: ${value === null ? "sem dado" : formatValue(value)}`
                }),
              ].join(", ")}
          </p>
        </div>
      </div>
      <ChartLegend
        items={shownLines.map(({ label, total, stroke }) => ({
          label,
          value: total,
          color: stroke,
        }))}
      />
    </div>
  )
}

export { ChartLine, type ChartLineProps, type ChartLineSeries }
