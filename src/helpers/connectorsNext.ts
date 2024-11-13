import { ARGENT_WEBWALLET_URL, CHAIN_ID } from "@/constants"
import {
  isInArgentMobileAppBrowser,
  ArgentMobileConnector,
} from "starknetkit-next/argentMobile"
import { ArgentX } from "starknetkit-next/argentX"
import { Braavos } from "starknetkit-next/braavos"
import { BraavosMobileConnector } from "starknetkit-next/braavosMobile"
import { WebWalletConnector } from "starknetkit-next/webwallet"
import { Argent } from "starknetkit-next/argent"

export const availableConnectors = isInArgentMobileAppBrowser()
  ? [
      ArgentMobileConnector.init({
        options: {
          url: typeof window !== "undefined" ? window.location.href : "",
          dappName: "Example dapp",
          chainId: CHAIN_ID,
        },
      }),
    ]
  : [
      new Argent({
        mobile: {
          url: typeof window !== "undefined" ? window.location.href : "",
          dappName: "Example dapp",
          chainId: CHAIN_ID,
        },
      }),
      new ArgentX(),
      new Braavos(),
      BraavosMobileConnector.init(),
      ArgentMobileConnector.init({
        options: {
          url: typeof window !== "undefined" ? window.location.href : "",
          dappName: "Example dapp",
          chainId: CHAIN_ID,
        },
      }),
      new WebWalletConnector({ url: ARGENT_WEBWALLET_URL }),
    ]
