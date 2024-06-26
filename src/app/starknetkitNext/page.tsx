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
import { TransferNext } from "@/components/Actions/Transfer"
import { WalletRpcMsgContainer } from "@/components/Actions/WalletRpcMsgContainer"
import { DisconnectButton } from "@/components/DisconnectButton"
import { Section } from "@/components/Section"
import { ARGENT_WEBWALLET_URL } from "@/constants"
import { useWaitForTx } from "@/hooks/useWaitForTx"
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
  }, [wallet])

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

          {wallet.id === "argentWebWallet" && (
            <a
              target="_blank"
              href={`${process.env.NEXT_PUBLIC_ARGENT_WEBWALLET_URL}`}
              rel="noopener noreferrer"
            >
              Webwallet dashboard
            </a>
          )}

          <AccountSection
            address={connectorData?.account}
            chainId={connectorData?.chainId}
          />
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
                  <DeployNext />
                </Flex>
              </Section>
            )}
          <Section>
            <Flex>
              <AddTokenNext />
              <AddNetworkNext />
            </Flex>
          </Section>
          <Section>
            <WalletRpcMsgContainer wallet={wallet} />
          </Section>
        </>
      )}
    </Flex>
  )
}
