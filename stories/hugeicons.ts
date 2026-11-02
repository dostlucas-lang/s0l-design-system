import * as Hugeicons from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@/components/ui/icon"

// Looks up any Hugeicons icon by name for text controls in stories, so the
// whole free library is available without a long select. Matching ignores
// case, spaces, dashes and the "Icon" suffix, and falls back to the 01
// version: "search", "Search 01", "search-01" and "Search01Icon" all find
// Search01Icon. Stories only; components import their icons directly.
const normalize = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/icon$/, "")

const iconsByName = new Map<string, IconSvgElement>()
for (const [exportName, icon] of Object.entries(Hugeicons)) {
  if (exportName.endsWith("Icon") && Array.isArray(icon)) {
    iconsByName.set(normalize(exportName), icon as IconSvgElement)
  }
}

function findHugeicon(name: string | undefined) {
  if (!name?.trim()) return undefined
  const key = normalize(name)
  return iconsByName.get(key) ?? iconsByName.get(`${key}01`)
}

export { findHugeicon }
