// Library build of @s0l/design-system: ESM JavaScript and .d.ts types in dist/.
// Run with `npm run build:lib`; the CSS is built by scripts/build-css.ts.
//
// - One output file per source module (preserveModules), so apps only bundle
//   the components they import.
// - Dependencies and peer dependencies stay external: the app installs them.
// - The `@/` alias is resolved here and rewritten in the types by
//   vite-plugin-dts, since apps don't have it.
// - "use client" is kept at the top of each component file, so the package also
//   works with React Server Components (Next.js). Vite apps ignore it.

import { readFileSync } from "node:fs"
import path from "node:path"

import { defineConfig, type Plugin } from "vite"
import dts from "vite-plugin-dts"

const root = import.meta.dirname

const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"))
const externals = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
]

function isExternal(id: string) {
  return externals.some((name) => id === name || id.startsWith(`${name}/`))
}

const USE_CLIENT =
  /^\s*(?:\/\/[^\n]*\n\s*|\/\*[\s\S]*?\*\/\s*)*["']use client["']/

// Bundlers drop module-level directives; put "use client" back on the output
// file of every module that starts with it.
function preserveUseClient(): Plugin {
  const clientModules = new Set<string>()

  return {
    name: "s0l:preserve-use-client",
    enforce: "pre",
    transform(code, id) {
      if (USE_CLIENT.test(code)) {
        clientModules.add(id.split("?")[0])
      }
      return null
    },
    renderChunk(code, chunk) {
      const id = chunk.facadeModuleId?.split("?")[0]
      if (!id || !clientModules.has(id) || USE_CLIENT.test(code)) {
        return null
      }
      return { code: `"use client";\n${code}`, map: null }
    },
  }
}

export default defineConfig({
  resolve: {
    alias: [{ find: /^@\//, replacement: `${root}/` }],
  },
  plugins: [
    preserveUseClient(),
    dts({
      tsconfigPath: "./tsconfig.build.json",
      entryRoot: root,
      outDir: "dist",
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    copyPublicDir: false,
    minify: false,
    sourcemap: true,
    target: "es2022",
    lib: {
      entry: {
        index: path.join(root, "src/index.ts"),
        tokens: path.join(root, "src/tokens.ts"),
      },
      formats: ["es"],
    },
    rolldownOptions: {
      external: isExternal,
      output: {
        preserveModules: true,
        preserveModulesRoot: root,
        entryFileNames: "[name].js",
      },
    },
  },
})
