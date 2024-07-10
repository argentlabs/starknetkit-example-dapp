import {
  addNetworkLatest,
  addNetworkNext,
  switchNetworkLatest,
  switchNetworkNext,
} from "@/services/addNetwork.ts"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import { walletStarknetkitNextAtom } from "@/state/connectedWalletStarknetkitNext"
import { Flex, Heading } from "@chakra-ui/react"
import { useAtomValue } from "jotai"
import { FC, useState } from "react"

const SwitchNetworkLatest = () => {
  const wallet = useAtomValue(walletStarknetkitLatestAtom)
  return (
    <SwitchNetwork
      switchNetworkFn={async () => await switchNetworkLatest(wallet)}
    />
  )
}

const SwitchNetworkNext = () => {
  const wallet = useAtomValue(walletStarknetkitNextAtom)
  return (
    <SwitchNetwork
      switchNetworkFn={async () => await switchNetworkNext(wallet)}
    />
  )
}

interface SwitchNetworkProps {
  switchNetworkFn: () => Promise<void>
}

const SwitchNetwork: FC<SwitchNetworkProps> = ({ switchNetworkFn }) => {
  const [switchNetworkError, setSwitchNetworkError] = useState("")

  const handleSwitchNetwork = async () => {
    try {
      await switchNetworkFn()
      setSwitchNetworkError("")
    } catch (error) {
      setSwitchNetworkError((error as any).message)
    }
  }

  return (
    <Flex direction="column" gap="3" flex="1">
      <Heading as="h2">Network</Heading>
      <Flex
        as="button"
        color="#0097fc"
        fontWeight="bold"
        onClick={handleSwitchNetwork}
      >
        Switch network
      </Flex>
      <span className="error-message">{switchNetworkError}</span>
    </Flex>
  )
}

export { SwitchNetworkLatest, SwitchNetworkNext }
