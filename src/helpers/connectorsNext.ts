import { ARGENT_WEBWALLET_URL, CHAIN_ID } from "@/constants"
import { getStarknet } from "@starknet-io/get-starknet-core"
import {
  isInArgentMobileAppBrowser,
  ArgentMobileConnector,
} from "starknetkit-next/argentMobile"
import { InjectedConnector } from "starknetkit-next/injected"
import { WebWalletConnector } from "starknetkit-next/webwallet"

export const availableConnectors = () => {
  if (typeof window !== "undefined") {
    getStarknet()
  }
  return isInArgentMobileAppBrowser()
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
        new InjectedConnector({ options: { id: "argentX" } }),
        new InjectedConnector({ options: { id: "braavos" } }),
        ArgentMobileConnector.init({
          options: {
            url: typeof window !== "undefined" ? window.location.href : "",
            dappName: "Example dapp",
            chainId: CHAIN_ID,
          },
        }),
        new WebWalletConnector({ url: ARGENT_WEBWALLET_URL }),
      ]
}

export const connectors = availableConnectors()
