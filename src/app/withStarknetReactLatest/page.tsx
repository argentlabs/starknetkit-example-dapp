"use client"

import { AccountSection } from "@/components/AccountSection"
import { MintWithStarknetReact } from "@/components/Actions/MintWithStarknetReact"
import { SignMessageWithStarknetReact } from "@/components/Actions/SignMessageWithStarknetReact"
import { TransferWithStarknetReact } from "@/components/Actions/TransferWithStarknetReact"
import { DisconnectButton } from "@/components/DisconnectButton"
import { Section } from "@/components/Section"
import { ConnectStarknetReact } from "@/components/connect/ConnectStarknetReact"
import { CHAIN_ID } from "@/constants"
import { availableConnectors } from "@/helpers/connectorsLatest"
import { useWaitForTx } from "@/hooks/useWaitForTx"
import { Flex } from "@chakra-ui/react"
import { mainnet, sepolia } from "@starknet-react/chains"
import {
  StarknetConfig,
  publicProvider,
  useAccount,
  useConnect,
} from "@starknet-react/core"
import { useEffect, useState } from "react"
import { constants } from "starknet"
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
      {!isConnected && <ConnectStarknetReact />}
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
            <Section>
              <MintWithStarknetReact />
            </Section>
            <Section>
              <TransferWithStarknetReact />
            </Section>
            <Section>
              <SignMessageWithStarknetReact chainId={chainId} />
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

export default function StarknetReactLatest() {
  const chains = [
    CHAIN_ID === constants.NetworkName.SN_MAIN ? mainnet : sepolia,
  ]
  const providers = publicProvider()

  return (
    <>
      <StarknetConfig
        chains={chains}
        provider={providers}
        connectors={availableConnectors as any /* Connector[] */}
      >
        <StarknetReactDappContent />
      </StarknetConfig>
    </>
  )
}
