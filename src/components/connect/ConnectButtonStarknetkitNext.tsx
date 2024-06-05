import { ARGENT_WEBWALLET_URL } from "@/constants"
import {
  connectorAtom,
  connectorDataAtom,
  walletStarknetkitNextAtom,
} from "@/state/connectedWalletStarknetkitNext"
import { starknetkitVersionAtom } from "@/state/versionState"
import { Button, Flex } from "@chakra-ui/react"
import { useSetAtom } from "jotai"
import { useRouter } from "next/navigation"
import { constants } from "starknet"
import { connect } from "starknetkit-next"

const ConnectButtonStarknetkitNext = () => {
  const setWallet = useSetAtom(walletStarknetkitNextAtom)
  const setConnectorData = useSetAtom(connectorDataAtom)
  const setConnector = useSetAtom(connectorAtom)
  const setStarknetkitVersion = useSetAtom(starknetkitVersionAtom)
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
    setStarknetkitVersion(
      `starknetkit@next (${process.env.starknetkitNextVersion})`,
    )
    navigate.push("/starknetkitNext")
  }

  return (
    <Flex flexDirection="column" alignItems="center">
      <Button
        p="4"
        rounded="lg"
        colorScheme="primary"
        onClick={connectFn}
        h="20"
        w="full"
      >
        starknetkit@next ({process.env.starknetkitNextVersion})
      </Button>
      <strong>(with session keys)</strong> {/* TODO: will be removed */}
    </Flex>
  )
}

export { ConnectButtonStarknetkitNext }
