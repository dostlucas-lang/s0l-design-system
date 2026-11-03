import path from "node:path"

import type { StorybookConfig } from "@storybook/react-vite"

const root = path.resolve(import.meta.dirname, "..")

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: ["../public"],
  // The `@/` imports (components.json aliases) point at the repo root, like in
  // tsconfig.json and vite.lib.config.ts. Tailwind runs through
  // postcss.config.mjs.
  viteFinal(config) {
    config.resolve ??= {}
    config.resolve.alias = [
      ...(Array.isArray(config.resolve.alias) ? config.resolve.alias : []),
      { find: /^@\//, replacement: `${root}/` },
    ]
    return config
  },
}

export default config
