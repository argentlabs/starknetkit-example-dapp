import { Box } from "@chakra-ui/react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Starknetkit example dapp",
  description: "Example dapp for Starknetkit",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Box as="body" className={inter.className} bgColor="#f9f9f9">
        <Providers>{children}</Providers>
      </Box>
    </html>
  )
}
