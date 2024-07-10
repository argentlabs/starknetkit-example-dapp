import { InjectedConnector } from "starknetkit-next/injected"
import { ArgentMobileConnector } from "starknetkit-next/argentMobile"
import { WebWalletConnector } from "starknetkit-next/webwallet"
import { ARGENT_WEBWALLET_URL, CHAIN_ID } from "@/constants"

export const availableConnectors = [
  new InjectedConnector({ options: { id: "argentX" } }),
  new InjectedConnector({ options: { id: "braavos" } }),
  new ArgentMobileConnector({
    dappName: "Example dapp",
    chainId: CHAIN_ID,
  }),
  new WebWalletConnector({ url: ARGENT_WEBWALLET_URL }),
]
