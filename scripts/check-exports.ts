// Fails when a file in components/ui is not exported from src/index.ts, so a
// new component is never left out of the package. Run by `npm run build`.

import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const index = readFileSync(path.join(root, "src/index.ts"), "utf8")

const missing = readdirSync(path.join(root, "components/ui"))
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => file.replace(/\.tsx$/, ""))
  .filter((name) => !index.includes(`"../components/ui/${name}"`))

if (missing.length > 0) {
  console.error(`Missing from src/index.ts: ${missing.join(", ")}`)
  process.exit(1)
}

console.log("src/index.ts exports every component in components/ui")
