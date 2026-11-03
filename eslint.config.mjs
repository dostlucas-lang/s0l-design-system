import js from "@eslint/js"
import { defineConfig, globalIgnores } from "eslint/config"
import reactHooks from "eslint-plugin-react-hooks"
import storybook from "eslint-plugin-storybook"
import globals from "globals"
import tseslint from "typescript-eslint"

const eslintConfig = defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  ...storybook.configs["flat/recommended"],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  // Icons go through components/ui/icon.tsx, which applies the Figma stroke.
  {
    ignores: ["components/ui/icon.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@hugeicons/react",
              message:
                "Import HugeiconsIcon from @/components/ui/icon (Figma 1.8 stroke).",
            },
          ],
        },
      ],
    },
  },
  globalIgnores(["dist/**", "storybook-static/**", "consumer-test/**", "examples/**"]),
])

export default eslintConfig
