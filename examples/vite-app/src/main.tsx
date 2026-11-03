import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@s0l/design-system/fonts.css"
import "./index.css"

import { App } from "./app"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
