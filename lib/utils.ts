import { createCn } from "cn/config"

// The Figma text styles become text-heading-*, text-body-* and text-label-*
// (see app/tokens.css). Without this, cn reads them as text colors and drops
// the real text color whenever both are combined.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        { text: [(value: string) => /^(heading|body|label)-/.test(value)] },
      ],
    },
  },
})
