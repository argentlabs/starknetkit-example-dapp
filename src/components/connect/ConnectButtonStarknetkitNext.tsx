import { ARGENT_WEBWALLET_URL } from "@/constants"
import {
  connectorAtom,
  connectorDataAtom,
  walletStarknetkitNextAtom,
} from "@/state/connectedWalletStarknetkitNext"
import { Button, Flex } from "@chakra-ui/react"
import { useSetAtom } from "jotai"
import { useRouter } from "next/navigation"
import { constants } from "starknet"
import { connect } from "starknetkit-next"

const ConnectButtonStarknetkitNext = () => {
  const setWallet = useSetAtom(walletStarknetkitNextAtom)
  const setConnectorData = useSetAtom(connectorDataAtom)
  const setConnector = useSetAtom(connectorAtom)
  const navigate = useRouter()

  const connectFn = async () => {
    const res = await connect({
      modalMode: "alwaysAsk",
      webWalletUrl: ARGENT_WEBWALLET_URL,
      argentMobileOptions: {
        dappName: "Starknetkit example dapp",
        url: window.location.hostname,
        chainId: constants.NetworkName.SN_SEPOLIA,
        icons: [],
      },
    })

    const { wallet, connectorData, connector } = res
    setWallet(wallet)
    setConnectorData(connectorData)
    setConnector(connector)

    navigate.push("/starknetkitNext")
  }

  return (
    <Flex flexDirection="column" alignItems="center">
      <Button
        p="4"
        rounded="lg"
        colorScheme="primary"
        onClick={connectFn}
        h="16"
        w="full"
      >
        starknetkit@next ({process.env.starknetkitNextVersion})
      </Button>
      <strong>(with session keys)</strong> {/* TODO: will be removed */}
    </Flex>
  )
}

export { ConnectButtonStarknetkitNext }
