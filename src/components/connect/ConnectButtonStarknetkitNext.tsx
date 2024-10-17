import { ARGENT_WEBWALLET_URL, CHAIN_ID } from "@/constants"
import {
  connectorAtom,
  connectorDataAtom,
  walletStarknetkitNextAtom,
} from "@/state/connectedWalletStarknetkitNext"
import { starknetkitVersionAtom } from "@/state/versionState"
import { Button, Flex } from "@chakra-ui/react"
import { useSetAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { connect } from "starknetkit-next"
import { ArgentMobileBaseConnector } from "starknetkit-next/argentMobile"
import { InjectedConnector } from "starknetkit-next/injected"
import { WebWalletConnector } from "starknetkit-next/webwallet"

const ConnectButtonStarknetkitNext = () => {
  const setWallet = useSetAtom(walletStarknetkitNextAtom)
  const setConnectorData = useSetAtom(connectorDataAtom)
  const setConnector = useSetAtom(connectorAtom)
  const setStarknetkitVersion = useSetAtom(starknetkitVersionAtom)
  const navigate = useRouter()

  const [withAdditionalWallets, setWithAdditionalWallets] = useState(false)

  const connectFn = async () => {
    const res = await connect(
      withAdditionalWallets
        ? {
            modalMode: "alwaysAsk",
            connectors: [
              new InjectedConnector({ options: { id: "argentX" } }),
              new InjectedConnector({ options: { id: "braavos" } }),
              new InjectedConnector({ options: { id: "keplr" } }),
              new InjectedConnector({ options: { id: "okxwallet" } }),
              new ArgentMobileBaseConnector({
                dappName: "Starknetkit example dapp",
                url: window.location.hostname,
                chainId: CHAIN_ID,
                icons: [],
              }),
              new WebWalletConnector({ url: ARGENT_WEBWALLET_URL }),
            ],
          }
        : {
            modalMode: "alwaysAsk",
            webWalletUrl: ARGENT_WEBWALLET_URL,
            argentMobileOptions: {
              dappName: "Starknetkit example dapp",
              url: window.location.hostname,
              chainId: CHAIN_ID,
              icons: [],
            },
          },
    )

    const { wallet, connectorData, connector } = res
    setWallet(wallet)
    setConnectorData(connectorData)
    setConnector(connector)
    setStarknetkitVersion(
      `starknetkit@next (${process.env.starknetkitNextVersion})`,
    )
    navigate.push("/starknetkitNext")
  }

  return (
    <>
      <Flex flexDirection="column" alignItems="center">
        <Button
          p="4"
          rounded="lg"
          colorScheme="primary"
          onClick={connectFn}
          h="20"
          w="full"
        >
          starknetkit@next ({process.env.starknetkitNextVersion}) +
          <strong>(with session keys)</strong> {/* TODO: will be removed */}
        </Button>
      </Flex>
      <Flex gap="1">
        <input
          type="checkbox"
          checked={withAdditionalWallets}
          onChange={() => setWithAdditionalWallets(!withAdditionalWallets)}
        />
        Include Keplr and OKX wallets with starknetkit@next (
        {process.env.starknetkitNextVersion})
      </Flex>
    </>
  )
}

export { ConnectButtonStarknetkitNext }
