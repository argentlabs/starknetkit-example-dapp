import { addNetworkLatest, addNetworkNext } from "@/services/addNetwork.ts"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import { walletStarknetkitNextAtom } from "@/state/connectedWalletStarknetkitNext"
import { Flex, Heading } from "@chakra-ui/react"
import { useAtomValue } from "jotai"
import { FC, useState } from "react"

const AddNetworkNext = () => {
  const wallet = useAtomValue(walletStarknetkitNextAtom)
  return <AddNetwork addNetworkFn={async () => await addNetworkNext(wallet)} />
}

const AddNetworkLatest = () => {
  const wallet = useAtomValue(walletStarknetkitLatestAtom)
  return (
    <AddNetwork addNetworkFn={async () => await addNetworkLatest(wallet)} />
  )
}

interface AddNetworkProps {
  addNetworkFn: () => Promise<void>
}

const AddNetwork: FC<AddNetworkProps> = ({ addNetworkFn }) => {
  const [addNetworkError, setAddNetworkError] = useState("")

  const handleAddNetwork = async () => {
    try {
      await addNetworkFn()
      setAddNetworkError("")
    } catch (error) {
      setAddNetworkError((error as any).message)
    }
  }

  return (
    <Flex direction="column" gap="3" flex="1">
      <Heading as="h2">Network</Heading>
      <Flex
        as="button"
        color="#0097fc"
        fontWeight="bold"
        onClick={handleAddNetwork}
      >
        Add network to wallet
      </Flex>
      <span className="error-message">{addNetworkError}</span>
    </Flex>
  )
}

export { AddNetworkLatest, AddNetworkNext }
