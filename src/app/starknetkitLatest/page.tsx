"use client"

import { AccountSection } from "@/components/AccountSection"
import { AddNetworkLatest } from "@/components/Actions/AddNetwork"
import { AddTokenLatest } from "@/components/Actions/AddToken"
import { Declare } from "@/components/Actions/Declare"
import { DeployLatest } from "@/components/Actions/Deploy"
import { MintLatest } from "@/components/Actions/Mint"
import { SignMessageLatest } from "@/components/Actions/SignMessage"
import { SwitchNetworkLatest } from "@/components/Actions/SwitchNetwork"
import { TransferLatest } from "@/components/Actions/Transfer"
import { UniversalSignExecutorLatest } from "@/components/Actions/UniversalSignExecutor"
import { UniversalTransactionExecutorLatest } from "@/components/Actions/UniversalTransactionExecutor"
import { DisconnectButton } from "@/components/DisconnectButton"
import { Section } from "@/components/Section"
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants"
import { useWaitForTx } from "@/hooks/useWaitForTx"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { useAtom } from "jotai"
import { RESET } from "jotai/utils"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { connect, disconnect } from "starknetkit-latest"

export default function StarknetkitLatest() {
  const [wallet, setWallet] = useAtom(walletStarknetkitLatestAtom)
  const navigate = useRouter()

  useWaitForTx()

  useEffect(() => {
    const autoConnect = async () => {
      try {
        const { wallet: connectedWallet } = await connect({
          provider,
          modalMode: "neverAsk",
          webWalletUrl: ARGENT_WEBWALLET_URL,
          argentMobileOptions: {
            dappName: "Starknetkit example dapp",
            url: window.location.hostname,
            chainId: CHAIN_ID,
            icons: [],
          },
        })
        setWallet(connectedWallet)

        if (!connectedWallet) {
          navigate.replace("/")
        }
      } catch (e) {
        console.error(e)
        alert((e as any).message)
      }
    }

    if (!wallet) {
      autoConnect()
    }
  }, [wallet])

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.addEventListener("wallet_disconnected", async () => {
        setWallet(RESET)
      })
    }
  }, [])

  return (
    <Flex as="main" flexDirection="column" p="10" gap="4" w="dvw" h="100dvh">
      {wallet && (
        <>
          <DisconnectButton
            disconnectFn={disconnect}
            resetFn={() => {
              setWallet(RESET)
            }}
          />
          <AccountSection
            address={wallet?.account?.address}
            chainId={wallet.chainId}
          />
          <Tabs isLazy>
            <TabList>
              <Tab>Main functions</Tab>
              <Tab>Universal transaction executor</Tab>
              <Tab>Universal sign executor</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex flexDirection="column" gap="4" w="full" h="full">
                  <Section>
                    <MintLatest />
                  </Section>
                  <Section>
                    <TransferLatest />
                  </Section>
                  <Section>
                    <SignMessageLatest />
                  </Section>
                  {wallet.id !== "argentWebWallet" &&
                    wallet.id !== "argentMobileWallet" && (
                      <Section>
                        <Flex alignItems="center" gap="10">
                          <Declare />
                          <DeployLatest />
                        </Flex>
                      </Section>
                    )}
                  <Section>
                    <Flex
                      flexDirection={{
                        base: "column",
                        md: "row",
                      }}
                    >
                      <AddTokenLatest />
                      <AddNetworkLatest />
                      <SwitchNetworkLatest />
                    </Flex>
                  </Section>
                </Flex>
              </TabPanel>
              <TabPanel>
                <UniversalTransactionExecutorLatest />
              </TabPanel>
              <TabPanel>
                <UniversalSignExecutorLatest />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      )}
    </Flex>
  )
}
