"use client"

import { AccountSection } from "@/components/AccountSection"
import { SignMessageRpcMethod } from "@/components/Actions/SignMessageRpcMethod"
import { TransferRpcMethod } from "@/components/Actions/TransferRpcMethod"
import { Section } from "@/components/Section"
import { useWaitForTx } from "@/hooks/useWaitForTx"
import {
  connectorDataAtom,
  walletStarknetkitNextAtom,
} from "@/state/connectedWalletStarknetkitNext"
import { Box, Button, Flex } from "@chakra-ui/react"
import { useAtomValue } from "jotai"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { disconnect } from "starknetkit-latest"

export default function StarknetkitLatest() {
  const wallet = useAtomValue(walletStarknetkitNextAtom)
  const connectorData = useAtomValue(connectorDataAtom)

  const navigate = useRouter()

  const {
    lastTxError,
    lastTxHash,
    lastTxStatus,
    setLastTxHash,
    setLastTxStatus,
  } = useWaitForTx()

  useEffect(() => {
    if (!wallet) {
      navigate.replace("/")
    }
    return () => {
      //disconnect();
      //resetWalletAtom()
    }
  }, [])

  return (
    <Flex as="main" flexDirection="column" p="10" gap="4" w="dvw" h="100dvh">
      {wallet && (
        <>
          <Flex justifyContent="flex-end">
            <Box h="min-content">
              <Button
                p="2"
                rounded="lg"
                onClick={() => {
                  disconnect()
                  //resetWalletAtom()
                }}
              >
                Disconnect
              </Button>
            </Box>
          </Flex>
          <AccountSection
            address={connectorData.account}
            chainId={connectorData.chainId}
          />
          <Section>
            <TransferRpcMethod />
          </Section>
          <Section>
            <SignMessageRpcMethod />
          </Section>
        </>
      )}
    </Flex>
  )
}
