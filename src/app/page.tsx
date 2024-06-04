"use client"
import { ConnectButtonStarknetkitLatest } from "@/components/connect/ConnectButtonStarknetkitLatest"
import { ConnectButtonStarknetkitNext } from "@/components/connect/ConnectButtonStarknetkitNext"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import {
  connectorAtom,
  connectorDataAtom,
  walletStarknetkitNextAtom,
} from "@/state/connectedWalletStarknetkitNext"
import { Button, Flex, Heading } from "@chakra-ui/react"
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
      <Button
        as="a"
        href="/withStarknetReactLatest"
        p="4"
        rounded="lg"
        colorScheme="secondary"
        h="20"
      >
        <Flex flexDirection="column" alignItems="center">
          <span>
            starknetkit@latest ({process.env.starknetkitLatestVersion})
          </span>
          <span>+</span>
          <span>starknet-react ({process.env.starknetReactVersion})</span>
        </Flex>
      </Button>
      <Flex flexDirection="column">
        <Button
          as="a"
          href="/with"
          p="4"
          rounded="lg"
          colorScheme="primary"
          h="20"
          isDisabled
        >
          <Flex flexDirection="column" alignItems="center">
            <span>starknetkit@next ({process.env.starknetkitNextVersion})</span>
            <span>+</span>
            <span>starknet-react ({process.env.starknetReactVersion})</span>
          </Flex>
        </Button>
        <Flex justifyContent="center">
          <strong>TODO (wait for starknet-react v3)</strong>
        </Flex>
      </Flex>
    </Flex>
  )
}
