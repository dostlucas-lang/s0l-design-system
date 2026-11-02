import * as React from "react"
import {
  HugeiconsIcon as HugeiconsIconBase,
  type HugeiconsIconProps,
  type IconSvgElement,
} from "@hugeicons/react"

// The Figma icons are drawn with a 1.8 stroke on the 24×24 grid (1.2px at
// 16px, 1.5px at 20px, 1.8px at 24px); Hugeicons ships 1.5. Import
// HugeiconsIcon from here instead of @hugeicons/react to get the Figma stroke.
const STROKE_WIDTH = "1.8"

// Only the elements that already have a stroke width change: unlike the
// `strokeWidth` prop, filled shapes don't gain a stroke. Cached per icon, so
// each one is rewritten once.
const strokedIcons = new WeakMap<IconSvgElement, IconSvgElement>()

function withFigmaStroke(icon: IconSvgElement): IconSvgElement {
  let stroked = strokedIcons.get(icon)
  if (!stroked) {
    stroked = icon.map(([tag, attrs]) => [
      tag,
      attrs.strokeWidth != null
        ? { ...attrs, strokeWidth: STROKE_WIDTH }
        : attrs,
    ])
    strokedIcons.set(icon, stroked)
  }
  return stroked
}

/**
 * HugeiconsIcon with the Figma 1.8 stroke (on the 24×24 grid). An explicit
 * `strokeWidth` still wins.
 */
function HugeiconsIcon({
  icon,
  altIcon,
  ...props
}: HugeiconsIconProps & React.RefAttributes<SVGSVGElement>) {
  return (
    <HugeiconsIconBase
      icon={withFigmaStroke(icon)}
      altIcon={altIcon && withFigmaStroke(altIcon)}
      {...props}
    />
  )
}

/**
 * An icon from a single path of the Figma file, scaled to the 24×24 grid, for
 * the ones not drawn like their Hugeicons namesakes.
 */
function figmaIcon(d: string): IconSvgElement {
  return [
    [
      "path",
      {
        d,
        stroke: "currentColor",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: "1.8",
        key: "0",
      },
    ],
  ]
}

export {
  figmaIcon,
  HugeiconsIcon,
  type HugeiconsIconProps,
  type IconSvgElement,
}
