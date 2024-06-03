"use client"

import { AccountSection } from "@/components/AccountSection"
import { AddNetworkNext } from "@/components/Actions/AddNetwork"
import { AddTokenNext } from "@/components/Actions/AddToken"
import { Declare } from "@/components/Actions/Declare"
import { Deploy } from "@/components/Actions/Deploy"
import { MintRpcMethod } from "@/components/Actions/MintRpcMethod"
import { SessionKeysExecute } from "@/components/Actions/SessionKeysExecute"
import { SessionKeysExecuteOutside } from "@/components/Actions/SessionKeysExecuteOutside"
import { SessionKeysSign } from "@/components/Actions/SessionKeysSign"
import { SessionKeysTypedDataOutside } from "@/components/Actions/SessionKeysTypedDataOutside"
import { SignMessageRpcMethod } from "@/components/Actions/SignMessageRpcMethod"
import { TransferRpcMethod } from "@/components/Actions/TransferRpcMethod"
import { WalletRpcMsgContainer } from "@/components/Actions/WalletRpcMsgContainer"
import { DisconnectButton } from "@/components/DisconnectButton"
import { Section } from "@/components/Section"
import { ARGENT_WEBWALLET_URL } from "@/constants"
import {
  connectorAtom,
  connectorDataAtom,
  walletStarknetkitNextAtom,
} from "@/state/connectedWalletStarknetkitNext"
import { Flex } from "@chakra-ui/react"
import { useAtom, useSetAtom } from "jotai"
import { RESET } from "jotai/utils"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { constants } from "starknet"
import { connect, disconnect } from "starknetkit-next"

export default function StarknetkitLatest() {
  const [wallet, setWallet] = useAtom(walletStarknetkitNextAtom)
  const [connectorData, setConnectorData] = useAtom(connectorDataAtom)
  const setConnector = useSetAtom(connectorAtom)
  const navigate = useRouter()

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
          chainId: constants.NetworkName.SN_SEPOLIA,
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
          <Section>
            <MintRpcMethod />
          </Section>
          <Section>
            <TransferRpcMethod />
          </Section>
          <Section>
            <SignMessageRpcMethod />
          </Section>
          <Section>
            <SessionKeysSign />
            <SessionKeysExecute />
            <Flex alignItems="center" gap="100">
              <SessionKeysExecuteOutside />
              <SessionKeysTypedDataOutside />
            </Flex>
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
          <Flex>
            <AddTokenNext />
            <AddNetworkNext />
          </Flex>
          <Section>
            <WalletRpcMsgContainer wallet={wallet} />
          </Section>
        </>
      )}
    </Flex>
  )
}
