"use client"
import { ConnectButtonStarknetkitLatest } from "@/components/connect/ConnectButtonStarknetkitLatest"
import { ConnectButtonStarknetkitNext } from "@/components/connect/ConnectButtonStarknetkitNext"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import {
  connectorAtom,
  connectorDataAtom,
  walletStarknetkitNextAtom,
} from "@/state/connectedWalletStarknetkitNext"
import { Flex, Heading } from "@chakra-ui/react"
import { useSetAtom } from "jotai"
import { RESET } from "jotai/utils"
import { useEffect } from "react"

export default function Home() {
  const setWalletLatest = useSetAtom(walletStarknetkitLatestAtom)
  const setWalletNext = useSetAtom(walletStarknetkitNextAtom)
  const setConnectorData = useSetAtom(connectorDataAtom)
  const setConnector = useSetAtom(connectorAtom)

  useEffect(() => {
    setWalletLatest(RESET)
    setWalletNext(RESET)
    setConnectorData(RESET)
    setConnector(RESET)
  }, [])

  return (
    <Flex
      as="main"
      flexDirection="column"
      p="10"
      gap="4"
      flexWrap="wrap"
      maxW="50%"
      w="full"
    >
      <Heading as="h1">Starknetkit</Heading>
      <ConnectButtonStarknetkitLatest />
      <ConnectButtonStarknetkitNext />
      <Heading as="h1">Starknetkit + Starknet-react</Heading>
      <div>Starknetkit@next + starknet-react</div>
      <div>Starknetkit@latest + starknet-react</div>
    </Flex>
  )
}
