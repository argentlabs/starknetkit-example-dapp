import { FC, useState } from "react"
import { Code, Flex, Heading } from "@chakra-ui/react"
import { formatTruncatedAddress } from "@/utils/formatAddress"
import { DAITokenAddress, ETHTokenAddress } from "@/constants"
import { addTokenLatest, addTokenNext } from "@/services/addToken"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import { useAtomValue } from "jotai"
import { walletStarknetkitNextAtom } from "@/state/connectedWalletStarknetkitNext"

const AddTokenLatest = () => {
  const wallet = useAtomValue(walletStarknetkitLatestAtom)
  return (
    <AddToken
      addEthFn={async () => await addTokenLatest(wallet, ETHTokenAddress)}
      addDaiFn={async () => await addTokenLatest(wallet, DAITokenAddress)}
    />
  )
}

const AddTokenNext = () => {
  const wallet = useAtomValue(walletStarknetkitNextAtom)
  return (
    <AddToken
      addEthFn={async () => await addTokenNext(wallet, ETHTokenAddress)}
      addDaiFn={async () => await addTokenNext(wallet, DAITokenAddress)}
    />
  )
}

interface AddTokenProps {
  addEthFn: () => Promise<void>
  addDaiFn: () => Promise<void>
}

const AddToken: FC<AddTokenProps> = ({ addDaiFn, addEthFn }) => {
  const [addTokenError, setAddTokenError] = useState("")

  const handleAddEth = async () => {
    try {
      await addEthFn()
      setAddTokenError("")
    } catch (error) {
      setAddTokenError((error as any).message)
    }
  }

  const handleAddDai = async () => {
    try {
      await addDaiFn()
      setAddTokenError("")
    } catch (error) {
      setAddTokenError((error as any).message)
    }
  }

  return (
    <Flex direction="column" gap="3" flex="1">
      <Heading as="h2">ERC20</Heading>
      ETH token address
      <Code
        backgroundColor="#0097fc4f"
        borderRadius="8px"
        p="0 0.5rem"
        width="fit-content"
      >
        <a
          target="_blank"
          rel="noreferrer"
          style={{
            color: "#0097fc",
            display: "inline-block",
            textDecoration: "none",
          }}
        >
          {formatTruncatedAddress(ETHTokenAddress)}
        </a>
      </Code>
      <Flex
        as="button"
        color="#0097fc"
        fontWeight="bold"
        onClick={handleAddEth}
      >
        Add ETH token to wallet
      </Flex>
      <Flex
        as="button"
        color="#0097fc"
        fontWeight="bold"
        onClick={handleAddDai}
      >
        Add DAI token to wallet
      </Flex>
      <span className="error-message">{addTokenError}</span>
    </Flex>
  )
}

export { AddTokenNext, AddTokenLatest }
