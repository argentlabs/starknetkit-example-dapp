import { ARGENT_WEBWALLET_URL, CHAIN_ID } from "@/constants"
import {
  isInArgentMobileAppBrowser,
  ArgentMobileConnector,
} from "starknetkit-next/argentMobile"
import { InjectedConnector } from "starknetkit-next/injected"
import { WebWalletConnector } from "starknetkit-next/webwallet"

export const availableConnectors = isInArgentMobileAppBrowser()
  ? [
      ArgentMobileConnector.init({
        options: {
          dappName: "Example dapp",
          chainId: CHAIN_ID,
        },
      }),
    ]
  : [
      new InjectedConnector({ options: { id: "argentX" } }),
      new InjectedConnector({ options: { id: "braavos" } }),
      ArgentMobileConnector.init({
        options: {
          dappName: "Example dapp",
          chainId: CHAIN_ID,
        },
      }),
      new WebWalletConnector({ url: ARGENT_WEBWALLET_URL }),
    ]
