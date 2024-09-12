"use client"

import { AccountSection } from "@/components/AccountSection"
import { AddNetworkNext } from "@/components/Actions/AddNetwork"
import { AddTokenNext } from "@/components/Actions/AddToken"
import { Declare } from "@/components/Actions/Declare"
import { DeployNext } from "@/components/Actions/Deploy"
import { MintNext } from "@/components/Actions/Mint"
import { SessionKeysExecute } from "@/components/Actions/SessionKeysExecute"
import { SessionKeysExecuteOutside } from "@/components/Actions/SessionKeysExecuteOutside"
import { SessionKeysSign } from "@/components/Actions/SessionKeysSign"
import { SessionKeysTypedDataOutside } from "@/components/Actions/SessionKeysTypedDataOutside"
import { SignMessageNext } from "@/components/Actions/SignMessage"
import { SwitchNetworkNext } from "@/components/Actions/SwitchNetwork"
import { TransferNext } from "@/components/Actions/Transfer"
import { UniversalSignExecutorNext } from "@/components/Actions/UniversalSignExecutor"
import { UniversalTransactionExecutorNext } from "@/components/Actions/UniversalTransactionExecutor"
import { WalletRpcMsgContainer } from "@/components/Actions/WalletRpcMsgContainer"
import { DisconnectButton } from "@/components/DisconnectButton"
import { Section } from "@/components/Section"
import { ARGENT_WEBWALLET_URL, CHAIN_ID } from "@/constants"
import { useWaitForTx } from "@/hooks/useWaitForTx"
import {
  connectorAtom,
  connectorDataAtom,
  useWalletAccountChange,
  walletStarknetkitNextAtom,
} from "@/state/connectedWalletStarknetkitNext"
import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { useAtom, useSetAtom } from "jotai"
import { RESET } from "jotai/utils"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { connect, disconnect } from "starknetkit-next"

export default function StarknetkitLatest() {
  const [wallet, setWallet] = useAtom(walletStarknetkitNextAtom)
  const [connectorData, setConnectorData] = useAtom(connectorDataAtom)
  const setConnector = useSetAtom(connectorAtom)
  const navigate = useRouter()
  useWalletAccountChange()
  useWaitForTx()

  useEffect(() => {
    const autoConnect = async () => {
      const {
        wallet: connectedWallet,
        connector,
        connectorData,
      } = await connect({
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
      setConnectorData(connectorData)
      setConnector(connector)

      if (!connectedWallet) {
        navigate.replace("/")
      }
    }
    if (!wallet) {
      autoConnect()
    }
  }, [navigate, setConnector, setConnectorData, setWallet, wallet])

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.addEventListener("wallet_disconnected", async () => {
        setWallet(RESET)
        setConnectorData(RESET)
        setConnector(RESET)
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
              setConnectorData(RESET)
              setConnector(RESET)
            }}
          />
          <AccountSection
            address={connectorData?.account}
            chainId={connectorData?.chainId}
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
                    <MintNext />
                  </Section>
                  <Section>
                    <TransferNext />
                  </Section>
                  <Section>
                    <SignMessageNext />
                  </Section>
                  <Section>
                    <SessionKeysSign />
                    <SessionKeysExecute />
                    <Flex
                      alignItems={{
                        base: "flex-start",
                        md: "center",
                      }}
                      gap={{ base: "5", md: "100" }}
                      flexDirection={{ base: "column", md: "row" }}
                    >
                      <SessionKeysExecuteOutside />
                      <SessionKeysTypedDataOutside />
                    </Flex>
                  </Section>
                  {wallet.id !== "argentWebWallet" &&
                    wallet.id !== "argentMobileWallet" && (
                      <Section>
                        <Flex alignItems="center" gap="10">
                          <Declare />
                          <DeployNext />
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
                      <AddTokenNext />
                      <AddNetworkNext />
                      <SwitchNetworkNext />
                    </Flex>
                  </Section>
                  <Section>
                    <WalletRpcMsgContainer wallet={wallet} />
                  </Section>
                </Flex>
              </TabPanel>
              <TabPanel>
                <UniversalTransactionExecutorNext />
              </TabPanel>
              <TabPanel>
                <UniversalSignExecutorNext />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      )}
    </Flex>
  )
}
