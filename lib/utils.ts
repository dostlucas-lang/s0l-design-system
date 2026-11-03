import type { CnFunction } from "cn"
import { createCn } from "cn/config"

// The Figma text styles become text-heading-*, text-body-* and text-label-*
// (see styles/tokens.css). Without this, cn reads them as text colors and drops
// the real text color whenever both are combined.
// Annotated so the published .d.ts references cn's public CnFunction type
// instead of an internal file of the cn package.
export const cn: CnFunction = createCn({
  extend: {
    classGroups: {
      "font-size": [
        { text: [(value: string) => /^(heading|body|label)-/.test(value)] },
      ],
    },
  },
})
