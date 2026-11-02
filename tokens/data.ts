import tokenFile from "./s0l.tokens.json"
import type { TokenFile } from "./lib"

// The Figma variables snapshot, typed for the Storybook docs and toolbar.
export const tokens = tokenFile as unknown as TokenFile
