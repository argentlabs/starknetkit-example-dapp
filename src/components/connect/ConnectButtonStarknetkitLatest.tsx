import { ARGENT_WEBWALLET_URL, provider } from "@/constants"
import { Button, Flex } from "@chakra-ui/react"
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
    try {
      const { wallet } = await connect({
        provider,
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
    } catch (e) {
      console.error(e)
      alert((e as any).message)
    }
  }

  return (
    <Button
      p="4"
      rounded="lg"
      colorScheme="secondary"
      onClick={connectFn}
      h="20"
    >
      starknetkit@latest ({process.env.starknetkitLatestVersion})
    </Button>
  )
}

export { ConnectButtonStarknetkitLatest }
