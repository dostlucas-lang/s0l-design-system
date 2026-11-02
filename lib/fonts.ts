import { Barlow, Geist_Mono, Inter } from "next/font/google"

import { cn } from "@/lib/utils"

// Font variables are named after the family; see Text/Font Family in app/tokens.css.
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-barlow",
})

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

// Shared by the app layout and Storybook so both load the same fonts.
export const fontVariables = cn(
  fontMono.variable,
  barlow.variable,
  inter.variable
)
