import { Box } from "@chakra-ui/react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Starknetkit example dapp",
  description:
    "This dapp demonstrates how to use starknetkit as standalone and with starknet-react",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Box as="body" className={inter.className}>
        <Providers>{children}</Providers>
      </Box>
    </html>
  )
}
