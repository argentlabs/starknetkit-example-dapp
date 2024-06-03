import { transferJSONRpcMethod } from "@/services/transfer"
import { walletStarknetkitNextAtom } from "@/state/connectedWalletStarknetkitNext"
import { lastTxHashAtom, lastTxStatusAtom } from "@/state/transactionState"
import { Button, Flex, Heading, Input } from "@chakra-ui/react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useState } from "react"

const TransferRpcMethod = () => {
  const [transferTo, setTransferTo] = useState("")
  const [transferAmount, setTransferAmount] = useState("1")

  const wallet = useAtomValue(walletStarknetkitNextAtom)
  const [transactionStatus, setTransactionStatus] = useAtom(lastTxStatusAtom)
  const setLastTransactionHash = useSetAtom(lastTxHashAtom)

  const buttonsDisabled =
    ["approve", "pending"].includes(transactionStatus) ||
    transferTo === "" ||
    transferAmount === ""

  const handleTransferSubmit = async (e: React.FormEvent) => {
    try {
      if (!wallet) throw new Error("Account not connected")

      e.preventDefault()
      setTransactionStatus("approve")
      const { transaction_hash } = await transferJSONRpcMethod(
        wallet,
        transferTo,
        transferAmount,
      )
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
        <Heading as="h2">TransferRpcMethod token</Heading>

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
        <br />
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

export { TransferRpcMethod }
