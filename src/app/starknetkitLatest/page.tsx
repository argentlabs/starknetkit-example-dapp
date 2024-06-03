"use client"

import { AccountSection } from "@/components/AccountSection"
import { SignMessage } from "@/components/Actions/SignMessage"
import { Transfer } from "@/components/Actions/Transfer"
import { Section } from "@/components/Section"
import { useWaitForTx } from "@/hooks/useWaitForTx"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import { Box, Button, Flex } from "@chakra-ui/react"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { connect, disconnect } from "starknetkit-latest"
import { RESET } from "jotai/utils"
import { ARGENT_WEBWALLET_URL } from "@/constants"
import { constants } from "starknet"
import { Declare } from "@/components/Actions/Declare"
import { Deploy } from "@/components/Actions/Deploy"
import { Mint } from "@/components/Actions/Mint"
import { DisconnectButton } from "@/components/DisconnectButton"

export default function StarknetkitLatest() {
  const [wallet, setWallet] = useAtom(walletStarknetkitLatestAtom)
  const navigate = useRouter()

  useWaitForTx()

  useEffect(() => {
    const autoConnect = async () => {
      const { wallet: connectedWallet } = await connect({
        modalMode: "neverAsk",
        webWalletUrl: ARGENT_WEBWALLET_URL,
        argentMobileOptions: {
          dappName: "Starknetkit example dapp",
          url: window.location.hostname,
          chainId: constants.NetworkName.SN_SEPOLIA,
          icons: [],
        },
      })
      setWallet(connectedWallet)

      if (!connectedWallet) {
        navigate.replace("/")
      }
    }
    autoConnect()
  }, [])

  return (
    <Flex as="main" flexDirection="column" p="10" gap="4" w="dvw" h="100dvh">
      {wallet && (
        <>
          <DisconnectButton
            disconnectFn={disconnect}
            resetFn={() => {
              setWallet(RESET)
              setWallet(RESET)
            }}
          />
          <AccountSection
            address={wallet?.account?.address}
            chainId={wallet.chainId}
          />
          <Section>
            <Mint />
          </Section>
          <Section>
            <Transfer />
          </Section>
          <Section>
            <SignMessage />
          </Section>
          {wallet.id !== "argentWebWallet" &&
            wallet.id !== "argentMobileWallet" && (
              <Section>
                <Flex alignItems="center" gap="10">
                  <Declare />
                  <Deploy />
                </Flex>
              </Section>
            )}
        </>
      )}
    </Flex>
  )
}
