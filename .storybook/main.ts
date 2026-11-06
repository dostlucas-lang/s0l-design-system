import path from "node:path"

import type { StorybookConfig } from "@storybook/react-vite"

const root = path.resolve(import.meta.dirname, "..")

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@storybook/addon-vitest",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: [
    "../public",
    // Barlow files for the manager UI (see manager-head.html).
    { from: "../node_modules/@fontsource/barlow/files", to: "/fonts/barlow" },
  ],
  // The `@/` imports (components.json aliases) point at the repo root, like in
  // tsconfig.json and vite.lib.config.ts.
  // Tailwind runs through @tailwindcss/vite, like in the apps that use the
  // package (examples/vite-app, Figma Make). With @tailwindcss/postcss the
  // @fontsource imports were inlined without rebasing their url(./files/…), so
  // the font files were never emitted and every story fell back to sans-serif.
  async viteFinal(config) {
    const { default: tailwindcss } = await import("@tailwindcss/vite")
    config.plugins = [...(config.plugins ?? []), tailwindcss()]
    config.resolve ??= {}
    config.resolve.alias = [
      ...(Array.isArray(config.resolve.alias) ? config.resolve.alias : []),
      { find: /^@\//, replacement: `${root}/` },
    ]
    return config
  },
}

export default config
