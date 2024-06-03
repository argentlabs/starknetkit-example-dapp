"use client"

import { AccountSection } from "@/components/AccountSection"
import { SignMessage } from "@/components/Actions/SignMessage"
import { Transfer } from "@/components/Actions/Transfer"
import { Section } from "@/components/Section"
import { useWaitForTx } from "@/hooks/useWaitForTx"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import { Box, Button, Flex } from "@chakra-ui/react"
import { useAtomValue } from "jotai"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { disconnect } from "starknetkit-latest"

export default function StarknetkitLatest() {
  const wallet = useAtomValue(walletStarknetkitLatestAtom)
  const navigate = useRouter()

  useWaitForTx()

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
          />
          <Section>
            <Transfer />
          </Section>
          <Section>
            <SignMessage />
          </Section>
        </>
      )}
    </Flex>
  )
}
