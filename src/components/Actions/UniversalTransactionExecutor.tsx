import {
  universalTransactionExecute,
  universalTransactionExecuteJSONRpcMethod,
} from "@/services/universalTransactionExecute"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import { walletStarknetkitNextAtom } from "@/state/connectedWalletStarknetkitNext"
import { lastTxHashAtom, lastTxStatusAtom } from "@/state/transactionState"
import { Button, Flex, Heading, Textarea } from "@chakra-ui/react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { FC, useState } from "react"
import { Account, AccountInterface, AllowArray, Call } from "starknet"
import { StarknetWindowObject } from "starknetkit-next"

const UniversalTransactionExecutorNext = () => {
  const wallet = useAtomValue(walletStarknetkitNextAtom)
  return <UniversalTransactionExecutor wallet={wallet} />
}

const UniversalTransactionExecutorLatest = () => {
  const wallet = useAtomValue(walletStarknetkitLatestAtom)
  return (
    <UniversalTransactionExecutor
      account={wallet?.account as AccountInterface}
    />
  )
}

interface TransferProps {
  account?: Account | AccountInterface
  wallet?: StarknetWindowObject | null
}

const UniversalTransactionExecutor: FC<TransferProps> = ({
  account,
  wallet,
}) => {
  const [calldata, setCalldata] = useState("")

  const [transactionStatus, setTransactionStatus] = useAtom(lastTxStatusAtom)
  const setLastTransactionHash = useSetAtom(lastTxHashAtom)

  const buttonsDisabled =
    ["approve", "pending"].includes(transactionStatus) || calldata === ""

  const handleTransferSubmit = async (e: React.FormEvent) => {
    try {
      if (!account && !wallet) {
        throw new Error("Account not connected")
      }

      e.preventDefault()
      setTransactionStatus("approve")

      const [parsed] = JSON.parse(calldata)
      const { transaction_hash } = account
        ? await universalTransactionExecute({
            account,
            calls: JSON.parse(calldata) as AllowArray<Call>,
          })
        : await universalTransactionExecuteJSONRpcMethod({
            wallet,
            calldata: (parsed as any).calldata,
            contract_address: (parsed as any).contract_address,
            entry_point: (parsed as any).entry_point,
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
          placeholder={`// Example calldata - please replace before executing
starknetkit v1:
[
  {
    "contractAddress": "contract address",
    "entrypoint": "entrypoint",
    "calldata": ["0", "1"]
  }
]

starknetkit v2
[
  {
    "contract_address": "contract address",
    "entry_point": "entrypoint",
    "calldata": ["0", "1"]
  }
]`}
          value={calldata}
          minH="500px"
          onChange={(e) => setCalldata(e.target.value)}
        />

        <Button
          colorScheme="primary"
          type="submit"
          isDisabled={buttonsDisabled}
          maxW="200px"
        >
          Execute transaction
        </Button>
      </Flex>
    </Flex>
  )
}

export { UniversalTransactionExecutorLatest, UniversalTransactionExecutorNext }
