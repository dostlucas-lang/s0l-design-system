// Library build of @lucasdost/design-system: ESM JavaScript and .d.ts types in dist/.
// Run with `npm run build:lib`; the CSS is built by scripts/build-css.ts.
//
// - One output file per source module (preserveModules), so apps only bundle
//   the components they import.
// - Dependencies and peer dependencies stay external: the app installs them.
// - The `@/` alias is resolved here and rewritten in the types by
//   vite-plugin-dts, since apps don't have it.
// - "use client" is kept at the top of each component file, so the package also
//   works with React Server Components (Next.js). Vite apps ignore it.

import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

import { defineConfig, type Plugin } from "vite"
import dts from "vite-plugin-dts"

const root = import.meta.dirname

const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"))
const externals = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
]

const RELATIVE_IMPORT = /(\bfrom\s+|\bimport\s*\(\s*|\bimport\s+)(["'])(\.{1,2}\/[^"']*)\2/g

// The sources import each other without extensions (moduleResolution
// "bundler"). The emitted JS already gets ".js" from the bundler, but the .d.ts
// files keep the bare paths, which TypeScript can't resolve under node16 /
// nodenext. Add the extension (or "/index.js" for folders), checking the
// source file that sits at the same path as the .d.ts being written.
function addDtsExtensions(filePath: string, content: string) {
  const sourceDir = path.dirname(
    path.join(root, path.relative(path.join(root, "dist"), filePath)),
  )
  const isModule = (p: string) => existsSync(`${p}.ts`) || existsSync(`${p}.tsx`)

  return content.replace(RELATIVE_IMPORT, (match, prefix, quote, spec) => {
    if (/\.(js|json|css)$/.test(spec)) return match
    const target = path.resolve(sourceDir, spec)
    if (isModule(target)) return `${prefix}${quote}${spec}.js${quote}`
    if (isModule(path.join(target, "index"))) {
      return `${prefix}${quote}${spec}/index.js${quote}`
    }
    return match
  })
}

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
      // Same line as the first statement, so the sourcemap lines stay valid.
      return { code: `"use client";${code}`, map: null }
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
      beforeWriteFile: (filePath, content) => ({
        filePath,
        content: addDtsExtensions(filePath, content),
      }),
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
      // Named after their path, so the JS lands in dist/src/ next to the types
      // (the package.json exports point there).
      entry: {
        "src/index": path.join(root, "src/index.ts"),
        "src/tokens": path.join(root, "src/tokens.ts"),
      },
      formats: ["es"],
    },
    rolldownOptions: {
      external: isExternal,
      // preserveUseClient() puts the directives back, so this warning is noise.
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return
        warn(warning)
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: root,
        entryFileNames: "[name].js",
      },
    },
  },
})
