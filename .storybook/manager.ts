import { addons } from "storybook/manager-api"
import { create } from "storybook/theming"

// Logo da Station Zero Lab no topo do painel lateral (Figma: Logo, variante
// Secondary, Color=True, On Dark=False). O arquivo é servido por staticDirs
// (../public), por isso o caminho começa na raiz.
addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Station Zero Lab",
    brandImage: "/brand/s0l-logo-secondary.svg",
    brandTarget: "_self",
  }),
})
