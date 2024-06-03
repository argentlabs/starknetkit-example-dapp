import { Status } from "@/helpers/status"
import { Button, Input, Heading } from "@chakra-ui/react"
import { Flex } from "@chakra-ui/react"
import { FC, useState } from "react"
import { Account, AccountInterface, Contract } from "starknet"
import Erc20Abi from "@/abi/ERC20.json"
import { transfer } from "@/services/transfer"

interface TransferProps {
  account?: Account | AccountInterface
  setTransactionStatus: (status: Status) => void
  setLastTransactionHash: (status: string) => void
  transactionStatus: Status
}

const Transfer: FC<TransferProps> = ({
  account,
  setTransactionStatus,
  setLastTransactionHash,
  transactionStatus,
}) => {
  const [transferTo, setTransferTo] = useState("")
  const [transferAmount, setTransferAmount] = useState("1")

  const buttonsDisabled =
    ["approve", "pending"].includes(transactionStatus) ||
    transferTo === "" ||
    transferAmount === ""

  const handleTransferSubmit = async (e: React.FormEvent) => {
    try {
      if (!account) throw new Error("Account not connected")

      e.preventDefault()
      setTransactionStatus("approve")
      const { transaction_hash } = await transfer(
        account,
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

export { Transfer }
