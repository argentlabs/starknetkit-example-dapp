import { merge } from "lodash-es"

import { colors as colorsGenerated } from "./colors.generated"
import { makeColorVariants } from "./utilities/makeColorVariants"

export const colors = merge(colorsGenerated, {
  transparent: "transparent",
  current: "currentColor",
  black: "#000000",
  "black.10": "rgba(0,0,0,0.1)",
  white: "#ffffff",
  gray: makeColorVariants(colorsGenerated["neutrals.600"]),
  primary: makeColorVariants(colorsGenerated["primary.orange.600"]),
  primaryExtraDark: makeColorVariants(colorsGenerated["primary.orange.1000"]),
  secondary: makeColorVariants("#08a681"),
  secondaryDark: "#068063",
  tertiary: makeColorVariants(colorsGenerated["neutrals.700"]),
  accent: makeColorVariants("#197aa6"),
  warn: makeColorVariants("#ffbf3d"), //primary.yellow.400
  "warn-high": makeColorVariants("#f36a3d"), // primary.orange.600
  info: makeColorVariants("#0078a4"), //primary.blue.800
  danger: makeColorVariants(colorsGenerated["primary.red.dark"]),
  warning: makeColorVariants("#f4bc54"),
  warningDark: makeColorVariants(colorsGenerated["primary.yellow.800"]),
  success: makeColorVariants("#3ed373"),
  error: makeColorVariants("#cc3247"),
  skyBlue: makeColorVariants(colorsGenerated["secondary.sky.blue"]),
  /** used by Chakra Alert and Toast */
  blue: makeColorVariants("#0078a4"), // primary.blue.800
  orange: makeColorVariants("#f4bc54"),
  red: makeColorVariants("#cc3247"),
  green: makeColorVariants("#08a681"),
})
