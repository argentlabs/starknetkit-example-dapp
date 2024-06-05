// app/providers.tsx
"use client"
import { ThemeProvider } from "@/theme/theme"
import { ColorModeScript } from "@chakra-ui/react"
import { Provider as JotaiProvider } from "jotai"
import { ReactNode, useEffect, useState } from "react"

export function Providers({ children }: { children: ReactNode }) {
  // solving white loading flash on dark mode when serving the page
  // https://brianlovin.com/writing/adding-dark-mode-with-next-js
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const body = (
    <>
      <ColorModeScript initialColorMode={"light"} />
      <JotaiProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </JotaiProvider>
    </>
  )

  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{body}</div>
  }

  return body
}
