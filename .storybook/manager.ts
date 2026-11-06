import { addons } from "storybook/manager-api"
import { create } from "storybook/theming"

import tokenFile from "../tokens/s0l.tokens.json"

// Text/Font Family/Primary (Barlow) in the Storybook UI. The font files are
// loaded by manager-head.html.
const primitives = tokenFile.collections.find((c) => c.name === "Primitives")
const primary = primitives?.variables["Text/Font Family/Primary"] ?? "Barlow"
const fontBase = `"${primary}", sans-serif`

// Logo da Station Zero Lab no topo do painel lateral (Figma: Logo, variante
// Secondary, Color=True, On Dark=False). O arquivo é servido por staticDirs
// (../public), por isso o caminho começa na raiz.
addons.setConfig({
  theme: create({
    base: "light",
    fontBase,
    brandTitle: "Station Zero Lab",
    brandImage: "/brand/s0l-logo-secondary.svg",
    brandTarget: "_self",
  }),
})
