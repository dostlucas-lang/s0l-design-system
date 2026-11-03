import type { Preview } from "@storybook/react-vite"
import { withThemeByClassName } from "@storybook/addon-themes"

import "../styles/globals.css"
import { tokens } from "@/tokens/data"
import { getCollection, slug } from "@/tokens/lib"

// One toolbar item per Accent mode in the Figma variables.
const accents = getCollection(tokens, "Accent").modes.map((name) => ({
  value: slug(name),
  title: name,
}))

const preview: Preview = {
  parameters: {
    layout: "centered",
    options: {
      storySort: { order: ["Foundations", "Components"] },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // "todo" reports violations in the panel without failing tests.
      test: "todo",
    },
  },
  globalTypes: {
    accent: {
      description: "Accent mode (data-accent)",
      toolbar: {
        title: "Accent",
        icon: "paintbrush",
        items: accents,
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    accent: accents[0].value,
  },
  decorators: [
    // Light/Dark mode is the .dark class on <html>, like next-themes in the app.
    withThemeByClassName({
      themes: { light: "light", dark: "dark" },
      defaultTheme: "light",
    }),
    (Story, context) => {
      document.documentElement.setAttribute(
        "data-accent",
        context.globals.accent
      )
      return <Story />
    },
  ],
}

export default preview
