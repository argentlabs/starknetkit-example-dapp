import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import { starknetkitVersionAtom } from "@/state/versionState"
import { Button } from "@chakra-ui/react"
import { useSetAtom } from "jotai"
import { useRouter } from "next/navigation"
import { FC } from "react"
import { connect } from "starknetkit-latest"

const ConnectButtonStarknetkitLatest: FC = () => {
  const setWallet = useSetAtom(walletStarknetkitLatestAtom)
  const setStarknetkitVersion = useSetAtom(starknetkitVersionAtom)
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
          chainId: CHAIN_ID,
          icons: [],
        },
      })

      setWallet(wallet)
      setStarknetkitVersion(
        `starknetkit@latest (${process.env.starknetkitLatestVersion})`,
      )
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
