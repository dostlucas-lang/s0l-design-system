"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@/components/ui/icon"

// Mirrors the Figma Carousel: the Slot (CarouselContent with the slides) and,
// 24px below, the Controls: Button Ghost arrows at both ends and the
// Indicators between them. Items (2 / 3 / 4 / 5 / > 5) × Current Item come
// from the slides and the selected one. Above 5 slides only 5 indicators
// show, and an end one shrinks to 8px while more slides sit past it.

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  /** Embla options. `loop` is on by default, so the arrows never dead-end. */
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: CarouselApi
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: (index: number) => void
  canScrollPrev: boolean
  canScrollNext: boolean
  /** Number of slides (Figma Items) and the selected one (Current Item). */
  count: number
  selectedIndex: number
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

// Reads one value from Embla, refreshed on every select / reInit.
function useEmblaValue<T>(
  api: CarouselApi,
  read: (api: NonNullable<CarouselApi>) => T,
  fallback: T
) {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      api?.on("select", onChange)
      api?.on("reInit", onChange)
      return () => {
        api?.off("select", onChange)
        api?.off("reInit", onChange)
      }
    },
    [api]
  )

  return React.useSyncExternalStore(
    subscribe,
    () => (api ? read(api) : fallback),
    () => fallback
  )
}

function Carousel({
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel({ loop: true, ...opts }, plugins)

  const canScrollPrev = useEmblaValue(api, (api) => api.canScrollPrev(), false)
  const canScrollNext = useEmblaValue(api, (api) => api.canScrollNext(), false)
  const count = useEmblaValue(api, (api) => api.scrollSnapList().length, 0)
  const selectedIndex = useEmblaValue(api, (api) => api.selectedScrollSnap(), 0)

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api])
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api])
  const scrollTo = React.useCallback(
    (index: number) => api?.scrollTo(index),
    [api]
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext]
  )

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  const contextValue = React.useMemo(
    () => ({
      carouselRef,
      api,
      scrollPrev,
      scrollNext,
      scrollTo,
      canScrollPrev,
      canScrollNext,
      count,
      selectedIndex,
    }),
    [
      carouselRef,
      api,
      scrollPrev,
      scrollNext,
      scrollTo,
      canScrollPrev,
      canScrollNext,
      count,
      selectedIndex,
    ]
  )

  return (
    <CarouselContext.Provider value={contextValue}>
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("flex w-full flex-col gap-6", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

// Figma Slot: the slides, 16px apart when more than one is in view.
function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef } = useCarousel()

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div className={cn("-ml-4 flex", className)} {...props} />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn("min-w-0 shrink-0 grow-0 basis-full pl-4", className)}
      {...props}
    />
  )
}

// Figma Button Ghost: 40px, 20px arrow in Icon/Primary.
function CarouselPrevious({
  className,
  label = "Previous slide",
  ...props
}: React.ComponentProps<typeof Button> & { label?: string }) {
  const { scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant="ghost"
      size="md"
      iconOnly
      aria-label={label}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      className={cn("touch-manipulation text-icon-primary", className)}
      {...props}
    >
      <HugeiconsIcon icon={ArrowLeft02Icon} />
    </Button>
  )
}

function CarouselNext({
  className,
  label = "Next slide",
  ...props
}: React.ComponentProps<typeof Button> & { label?: string }) {
  const { scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant="ghost"
      size="md"
      iconOnly
      aria-label={label}
      disabled={!canScrollNext}
      onClick={scrollNext}
      className={cn("touch-manipulation text-icon-primary", className)}
      {...props}
    >
      <HugeiconsIcon icon={ArrowRight02Icon} />
    </Button>
  )
}

// At most 5 indicators, keeping the selected one in the middle when it can.
const MAX_INDICATORS = 5

function getIndicatorWindow(count: number, selectedIndex: number) {
  if (count <= MAX_INDICATORS) {
    return Array.from({ length: count }, (_, index) => ({
      index,
      overflow: false,
    }))
  }

  const start = Math.min(
    Math.max(selectedIndex - Math.floor(MAX_INDICATORS / 2), 0),
    count - MAX_INDICATORS
  )
  const end = start + MAX_INDICATORS - 1

  return Array.from({ length: MAX_INDICATORS }, (_, offset) => {
    const index = start + offset
    // Figma Overflow: an end indicator with more slides past it.
    const overflow =
      (index === start && start > 0) || (index === end && end < count - 1)
    return { index, overflow }
  })
}

// Figma Indicators: 12px dots 12px apart, Background/Accent/Strong for the
// selected slide and Background/Disabled/Strong for the rest; an Overflow
// one is 8px. Each one is a button that goes to its slide.
function CarouselIndicators({
  className,
  getLabel = (index) => `Go to slide ${index + 1}`,
  ...props
}: React.ComponentProps<"div"> & {
  /** Accessible name of each indicator. */
  getLabel?: (index: number) => string
}) {
  const { count, selectedIndex, scrollTo } = useCarousel()

  return (
    <div
      data-slot="carousel-indicators"
      className={cn("flex items-center gap-3", className)}
      {...props}
    >
      {getIndicatorWindow(count, selectedIndex).map(({ index, overflow }) => {
        const active = index === selectedIndex
        return (
          <button
            key={index}
            type="button"
            data-slot="carousel-indicator"
            data-active={active || undefined}
            data-overflow={overflow || undefined}
            aria-label={getLabel(index)}
            aria-current={active || undefined}
            onClick={() => scrollTo(index)}
            className="size-3 shrink-0 rounded-full bg-background-disabled-strong outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-border-accent-strong focus-visible:outline-solid data-overflow:size-2 data-active:bg-background-accent-strong"
          />
        )
      })}
    </div>
  )
}

// Figma Controls: the arrows at both ends and the Indicators in the middle.
function CarouselControls({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="carousel-controls"
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      <CarouselPrevious />
      <CarouselIndicators />
      <CarouselNext />
    </div>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselIndicators,
  CarouselControls,
  useCarousel,
}
