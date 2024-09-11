import { ETHTokenAddress } from "@/constants"
import { lastTxHashAtom, lastTxStatusAtom } from "@/state/transactionState"
import { bigDecimal } from "@argent/x-shared"
import { Button, Flex, Heading, Input } from "@chakra-ui/react"
import {
  Abi,
  useAccount,
  useContract,
  useSendTransaction,
} from "starknet-react-core-next"
import { useAtom, useSetAtom } from "jotai"
import { useState } from "react"
import Erc20Abi from "@/abi/ERC20TransferAbi.json"

export const TransferWithStarknetReact = () => {
  const { account } = useAccount()
  const [transferTo, setTransferTo] = useState("")
  const [transferAmount, setTransferAmount] = useState("1")

  const [transactionStatus, setTransactionStatus] = useAtom(lastTxStatusAtom)
  const setLastTransactionHash = useSetAtom(lastTxHashAtom)

  const { contract } = useContract({
    abi: Erc20Abi as Abi,
    address: ETHTokenAddress,
  })

  const { error, sendAsync: transferWithStarknetReact } = useSendTransaction({
    calls:
      contract && account?.address
        ? [
            contract.populate("transfer", [
              account.address,
              Number(bigDecimal.parseEther(transferAmount).value),
            ]),
          ]
        : undefined,
  })

  const buttonsDisabled = ["approve", "pending"].includes(transactionStatus)

  const handleTransferSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      setTransactionStatus("approve")
      const { transaction_hash } = await transferWithStarknetReact()
      setLastTransactionHash(transaction_hash)
      setTransactionStatus("pending")
    } catch (e) {
      console.error(e)
      console.error(error)
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
