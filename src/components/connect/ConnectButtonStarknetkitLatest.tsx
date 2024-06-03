import { ARGENT_WEBWALLET_URL } from "@/constants"
import { Button } from "@chakra-ui/react"
import { FC } from "react"
import { constants } from "starknet"
import { connect } from "starknetkit-latest"
import { useSetAtom } from "jotai"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import { useRouter } from "next/navigation"

const ConnectButtonStarknetkitLatest: FC = () => {
  const setWallet = useSetAtom(walletStarknetkitLatestAtom)
  const navigate = useRouter()

  const connectFn = async () => {
    const { wallet } = await connect({
      modalMode: "alwaysAsk",
      webWalletUrl: ARGENT_WEBWALLET_URL,
      argentMobileOptions: {
        dappName: "Starknetkit example dapp",
        url: window.location.hostname,
        chainId: constants.NetworkName.SN_SEPOLIA,
        icons: [],
      },
    })

    setWallet(wallet)

    navigate.push("/starknetkitLatest")
  }

  return (
    <Button p="2" rounded="lg" colorScheme="secondary" onClick={connectFn}>
      Connect with Starknetkit@latest
    </Button>
  )
}

export { ConnectButtonStarknetkitLatest }
