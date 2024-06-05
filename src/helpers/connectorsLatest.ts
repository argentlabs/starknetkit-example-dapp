import { InjectedConnector } from "starknetkit-latest/injected"
import { ArgentMobileConnector } from "starknetkit-latest/argentMobile"
import { WebWalletConnector } from "starknetkit-latest/webwallet"
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
