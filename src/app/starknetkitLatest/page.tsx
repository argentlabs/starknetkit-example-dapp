"use client"

import { AccountSection } from "@/components/AccountSection"
import { Transfer } from "@/components/Actions/Transfer"
import { Section } from "@/components/Section"
import { provider } from "@/constants"
import { Status } from "@/helpers/status"
import { useWaitForTx } from "@/hooks/useWaitForTx"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import { formatTruncatedAddress } from "@/utils/formatAddress"
import { Box, Button, Flex } from "@chakra-ui/react"
import { useAtomValue } from "jotai"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Account, GatewayError, constants } from "starknet"
import { disconnect } from "starknetkit-latest"

export default function StarknetkitLatest() {
  const wallet = useAtomValue(walletStarknetkitLatestAtom)
  const navigate = useRouter()

  const {
    lastTxError,
    lastTxHash,
    lastTxStatus,
    setLastTxHash,
    setLastTxError,
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
            address={wallet?.account?.address}
            chainId={wallet.chainId}
            lastTxHash={lastTxHash}
            lastTxStatus={lastTxStatus}
            lastTxError={lastTxError}
          />
          <Section>
            <Transfer
              account={wallet.account as Account}
              setLastTransactionHash={setLastTxHash}
              setTransactionStatus={setLastTxStatus}
              transactionStatus={lastTxStatus}
            />
          </Section>
        </>
      )}
    </Flex>
  )
}
