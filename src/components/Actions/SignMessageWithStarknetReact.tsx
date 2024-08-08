import { lastTxStatusAtom } from "@/state/transactionState"
import { Button, Flex, Heading, Input, Textarea } from "@chakra-ui/react"
import { useSignTypedData } from "@starknet-react/core"
import { useSetAtom } from "jotai"
import { FC, useMemo, useState } from "react"
import { constants, stark } from "starknet"

interface SignMessageWithStarknetReactProps {
  chainId: constants.StarknetChainId | undefined
}

const SignMessageWithStarknetReact: FC<SignMessageWithStarknetReactProps> = ({
  chainId,
}) => {
  const [shortText, setShortText] = useState("")
  const [lastSig, setLastSig] = useState<string[]>([])

  const setTransactionStatus = useSetAtom(lastTxStatusAtom)

  const message: any = useMemo(() => {
    return {
      domain: {
        name: "Example DApp",
        chainId,
        version: "0.0.1",
      },
      types: {
        StarkNetDomain: [
          { name: "name", type: "felt" },
          { name: "chainId", type: "felt" },
          { name: "version", type: "felt" },
        ],
        Message: [{ name: "message", type: "felt" }],
      },
      primaryType: "Message",
      message: {
        message: shortText,
      },
    }
  }, [shortText, chainId])
  const { signTypedDataAsync } = useSignTypedData(message)

  // skipDeploy to manage in starknet-react. cannot right now
  const handleSignSubmit = async (skipDeploy: boolean) => {
    try {
      setTransactionStatus("approve")
      const result = await signTypedDataAsync()
      setLastSig(stark.formatSignature(result))
      setTransactionStatus("success")
    } catch (e) {
      console.error(e)
      setTransactionStatus("idle")
    }
  }

  return (
    <Flex flexDirection={{ base: "column", sm: "row" }} flex={1} width="full">
      <Flex
        as="form"
        onSubmit={(e) => {
          e.preventDefault()
          handleSignSubmit(false)
        }}
        direction="column"
        flex={1}
        p="4"
        gap="3"
        borderTopLeftRadius="lg"
        borderBottomLeftRadius="lg"
      >
        <Heading as="h2"> Sign Message</Heading>

        <Input
          type="text"
          id="short-text"
          name="short-text"
          placeholder="Short text"
          value={shortText}
          onChange={(e) => setShortText(e.target.value)}
        />

        <Flex
          flexDirection={{ base: "column", sm: "row" }}
          alignItems="center"
          gap="1em"
        >
          <Button colorScheme="primary" type="submit" w="full">
            Sign
          </Button>
          <Button
            w="full"
            colorScheme="secondary"
            type="submit"
            onClick={async () => {
              handleSignSubmit(true)
            }}
          >
            Sign without deploy
          </Button>
        </Flex>
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

export { SignMessageWithStarknetReact }
