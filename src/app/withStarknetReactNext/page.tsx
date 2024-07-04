"use client"

import { AccountSection } from "@/components/AccountSection"
import { SignMessageWithStarknetReactNext } from "@/components/Actions/SignMessageWithStarknetReactNext"
import { TransferWithStarknetReactNext } from "@/components/Actions/TransferWithStarknetReactNext"
import { DisconnectButton } from "@/components/DisconnectButton"
import { Section } from "@/components/Section"
import { ConnectStarknetReactNext } from "@/components/connect/ConnectStarknetReactNext"
import { CHAIN_ID } from "@/constants"
import { availableConnectors } from "@/helpers/connectorsNext"
import { useWaitForTx } from "@/hooks/useWaitForTx"
import { Flex } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { constants } from "starknet"
import { mainnet, sepolia } from "starknet-react-chains-next"
import {
  StarknetConfig,
  publicProvider,
  useAccount,
} from "starknet-react-core-next"
import { disconnect } from "starknetkit-next"

const StarknetReactDappContent = () => {
  const { account, isConnected } = useAccount()
  const [chainId, setChainId] = useState<constants.StarknetChainId | undefined>(
    undefined,
  )

  useWaitForTx()

  useEffect(() => {
    const getChainId = async () => {
      setChainId(await account?.getChainId())
    }

    if (account) {
      getChainId()
    }
  }, [account])

  return (
    <>
      {!isConnected && <ConnectStarknetReactNext />}
      {isConnected && (
        <Flex
          as="main"
          flexDirection="column"
          p="10"
          gap="4"
          w="dvw"
          h="100dvh"
        >
          <>
            <DisconnectButton disconnectFn={disconnect} />
            <AccountSection address={account?.address} chainId={chainId} />
            {/* <Section>
              <MintWithStarknetReact />
            </Section> */}
            <Section>
              <TransferWithStarknetReactNext />
            </Section>
            <Section>
              <SignMessageWithStarknetReactNext chainId={chainId} />
            </Section>
            {/* 
            TODO: wait for the next version of starknetkit and starknet-react with rpc methods
            <Section>
              <SessionKeysSign />
              <SessionKeysExecute />
              <Flex alignItems="center" gap="100">
                <SessionKeysExecuteOutside />
                <SessionKeysTypedDataOutside />
              </Flex>
            </Section> */}
          </>
        </Flex>
      )}
    </>
  )
}

export default function StarknetReactNext() {
  const chains = [
    CHAIN_ID === constants.NetworkName.SN_MAIN ? mainnet : sepolia,
  ]
  const providers = publicProvider()

  return (
    <>
      <StarknetConfig
        chains={chains}
        provider={providers}
        connectors={
          availableConnectors as any
        } /* remove when starknet-react update types */
      >
        <StarknetReactDappContent />
      </StarknetConfig>
    </>
  )
}
