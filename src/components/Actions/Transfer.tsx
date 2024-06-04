import { useWaitForTx } from "@/hooks/useWaitForTx"
import { transfer, transferJSONRpcMethod } from "@/services/transfer"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import { walletStarknetkitNextAtom } from "@/state/connectedWalletStarknetkitNext"
import { lastTxHashAtom, lastTxStatusAtom } from "@/state/transactionState"
import { Box, Button, Flex, Heading, Input } from "@chakra-ui/react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { FC, useState } from "react"
import { Account, AccountInterface } from "starknet"
import { StarknetWindowObject } from "starknetkit-next"

const TransferLatest = () => {
  const wallet = useAtomValue(walletStarknetkitLatestAtom)
  return <Transfer account={wallet?.account as AccountInterface} />
}
const TransferNext = () => {
  const wallet = useAtomValue(walletStarknetkitNextAtom)
  return <Transfer wallet={wallet} />
}

interface TransferProps {
  account?: Account | AccountInterface
  wallet?: StarknetWindowObject | null
}

const Transfer: FC<TransferProps> = ({ account, wallet }) => {
  const [transferTo, setTransferTo] = useState("")
  const [transferAmount, setTransferAmount] = useState("1")

  const [transactionStatus, setTransactionStatus] = useAtom(lastTxStatusAtom)
  const setLastTransactionHash = useSetAtom(lastTxHashAtom)

  const buttonsDisabled =
    ["approve", "pending"].includes(transactionStatus) ||
    transferTo === "" ||
    transferAmount === ""

  const handleTransferSubmit = async (e: React.FormEvent) => {
    try {
      if (!account && !wallet) {
        throw new Error("Account not connected")
      }

      e.preventDefault()
      setTransactionStatus("approve")
      const { transaction_hash } = account
        ? await transfer(account as Account, transferTo, transferAmount)
        : await transferJSONRpcMethod(wallet, transferTo, transferAmount)
      setLastTransactionHash(transaction_hash)
      setTransactionStatus("pending")
      setTransferAmount("")
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
        <Heading as="h2">Transfer token</Heading>

        <Input
          type="text"
          id="transfer-to"
          name="fname"
          placeholder="To"
          value={transferTo}
          onChange={(e) => setTransferTo(e.target.value)}
        />

        <Input
          type="text"
          id="transfer-amount"
          name="fname"
          placeholder="Amount"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
        />

        <Button
          colorScheme="primary"
          type="submit"
          isDisabled={buttonsDisabled}
          maxW="200px"
        >
          Transfer
        </Button>
      </Flex>
    </Flex>
  )
}

export { TransferLatest, TransferNext }
