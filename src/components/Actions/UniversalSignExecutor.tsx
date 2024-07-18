import {
  universalSign,
  universalSignJSONRpcMethod,
} from "@/services/universalSign"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import { walletStarknetkitNextAtom } from "@/state/connectedWalletStarknetkitNext"
import { lastTxHashAtom, lastTxStatusAtom } from "@/state/transactionState"
import { Button, Flex, Heading, Textarea } from "@chakra-ui/react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { FC, useState } from "react"
import { Account, AccountInterface, constants } from "starknet"
import { StarknetWindowObject } from "starknetkit-next"

const UniversalSignExecutorNext = () => {
  const wallet = useAtomValue(walletStarknetkitNextAtom)
  return <UniversalSignExecutor wallet={wallet} />
}

const UniversalSignExecutorLatest = () => {
  const wallet = useAtomValue(walletStarknetkitLatestAtom)
  return <UniversalSignExecutor account={wallet?.account as AccountInterface} />
}

interface TransferProps {
  account?: Account | AccountInterface
  wallet?: StarknetWindowObject | null
}

const UniversalSignExecutor: FC<TransferProps> = ({ account, wallet }) => {
  const [typedData, setTypedData] = useState("")

  const [transactionStatus, setTransactionStatus] = useAtom(lastTxStatusAtom)
  const setLastTransactionHash = useSetAtom(lastTxHashAtom)

  const buttonsDisabled =
    ["approve", "pending"].includes(transactionStatus) || typedData === ""

  const handleTransferSubmit = async (e: React.FormEvent) => {
    try {
      if (!account && !wallet) {
        throw new Error("Account not connected")
      }

      e.preventDefault()
      setTransactionStatus("approve")

      const parsed = JSON.parse(typedData)
      const { transaction_hash } = account
        ? await universalSign({
            account,
            typedData: parsed,
          })
        : await universalSignJSONRpcMethod({
            wallet,
            typedData: parsed,
          })

      setLastTransactionHash(transaction_hash)
      setTransactionStatus("pending")
    } catch (e) {
      console.error(e)
      setTransactionStatus("idle")
    }
  }
  return (
    <Flex flex={1} width="full" gap={10}>
      <Flex
        as="form"
        onSubmit={handleTransferSubmit}
        direction="column"
        flex={1}
        p="4"
        gap="3"
        borderRadius="lg"
      >
        <Heading as="h2">Transaction executor</Heading>
        <strong>Enter data as a JSON</strong>
        <Textarea
          placeholder={`// Example message - please replace before executing
{
	"domain": {
	  "name": "Example DApp",
	  "chainId": "0x1",
	  "version": "0.0.1"
	},
	"types": {
	  "StarkNetDomain": [
		{ "name": "name", "type": "felt" },
		{ "name": "chainId", "type": "felt" },
		{ "name": "version", "type": "felt" }
	  ],
	  "Message": [{ "name": "message", "type": "felt" }]
	},
	"primaryType": "Message",
	"message": {
	  "message": "1234"
	}
}`}
          value={typedData}
          minH="500px"
          onChange={(e) => setTypedData(e.target.value)}
        />

        <Button
          colorScheme="primary"
          type="submit"
          isDisabled={buttonsDisabled}
          maxW="200px"
        >
          Sign message
        </Button>
      </Flex>
    </Flex>
  )
}

export { UniversalSignExecutorLatest, UniversalSignExecutorNext }
