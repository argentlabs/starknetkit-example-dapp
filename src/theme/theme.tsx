import {
  ChakraProvider,
  ChakraProviderProps,
  ThemeConfig,
  theme as baseTheme,
  extendTheme,
} from "@chakra-ui/react"
import { colors } from "./colors"

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
}

const extendedTheme = extendTheme({
  config,
})

export type UITheme = Omit<typeof baseTheme, "colors" | "semanticTokens"> & {
  colors: typeof colors
}

export const theme = {
  ...extendedTheme,
  colors /** omits default chakra colours */,
} as UITheme

/** Theme with initial color mode "light" also see {@link SetDarkMode} */
export const ThemeProvider = ({ children }: ChakraProviderProps) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
)
