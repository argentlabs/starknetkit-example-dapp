import { signMessage, signMessageRcpMethod } from "@/services/signMessage"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import { walletStarknetkitNextAtom } from "@/state/connectedWalletStarknetkitNext"
import { lastTxStatusAtom } from "@/state/transactionState"
import { Button, Flex, Heading, Input, Textarea } from "@chakra-ui/react"
import { useAtomValue, useSetAtom } from "jotai"
import { FC, useState } from "react"
import { Account, AccountInterface, stark } from "starknet"
import { StarknetWindowObject } from "starknetkit-next"

const SignMessageLatest = () => {
  const wallet = useAtomValue(walletStarknetkitLatestAtom)
  return <SignMessage account={wallet?.account} />
}

const SignMessageNext = () => {
  const wallet = useAtomValue(walletStarknetkitNextAtom)
  return <SignMessage wallet={wallet} />
}

interface SignMessageProps {
  account?: Account | AccountInterface
  wallet?: StarknetWindowObject | null
}

const SignMessage: FC<SignMessageProps> = ({ account, wallet }) => {
  const [shortText, setShortText] = useState("")
  const [lastSig, setLastSig] = useState<string[]>([])

  const setTransactionStatus = useSetAtom(lastTxStatusAtom)

  const handleSignSubmit = async (skipDeploy?: boolean) => {
    try {
      if (!account && !wallet) {
        throw new Error("Account not connected")
      }

      setTransactionStatus("approve")
      const result = account
        ? await signMessage(
            account as Account,
            await account.getChainId(),
            shortText,
          )
        : await signMessageRcpMethod(wallet, shortText, skipDeploy)
      setLastSig(stark.formatSignature(result))
      setTransactionStatus("success")
    } catch (e) {
      console.error(e)
      setTransactionStatus("idle")
    }
  }

  return (
    <Flex flex={1} width="full">
      <Flex
        as="form"
        onSubmit={(e) => {
          e.preventDefault()
          handleSignSubmit()
        }}
        direction="column"
        flex={1}
        p="4"
        gap="3"
        borderTopLeftRadius="lg"
        borderBottomLeftRadius="lg"
      >
        <Heading as="h2">Sign Message</Heading>

        <Input
          type="text"
          id="short-text"
          name="short-text"
          placeholder="Short text"
          value={shortText}
          onChange={(e) => setShortText(e.target.value)}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
          <Button colorScheme="primary" type="submit" w="full">
            Sign
          </Button>
        </div>
      </Flex>
      <Flex
        as="form"
        direction="column"
        flex={1}
        p="4"
        gap="3"
        borderTopRightRadius="lg"
        borderBottomRightRadius="lg"
      >
        <Heading as="h2">Sign results</Heading>

        {/* Label and textarea for value r */}
        <Textarea id="r" name="r" placeholder="r" value={lastSig[0]} readOnly />
        {/* Label and textarea for value s */}
        <Textarea id="s" name="s" placeholder="s" value={lastSig[1]} readOnly />
      </Flex>
    </Flex>
  )
}

export { SignMessageLatest, SignMessageNext }
