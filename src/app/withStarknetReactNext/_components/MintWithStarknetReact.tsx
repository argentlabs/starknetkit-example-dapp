import { ETHTokenAddress } from "@/constants"
import { lastTxHashAtom, lastTxStatusAtom } from "@/state/transactionState"
import { bigDecimal } from "@argent/x-shared"
import { Flex, Heading, Input } from "@chakra-ui/react"
import {
  useAccount,
  useContract,
  Abi,
  useSendTransaction,
} from "starknet-react-core-next"
import { useAtom, useSetAtom } from "jotai"
import { useState } from "react"
import Erc20Abi from "@/abi/ERC20TransferAbi.json"

export const MintWithStarknetReact = () => {
  const { account } = useAccount()
  const [mintAmount, setMintAmount] = useState("10")

  const [transactionStatus, setTransactionStatus] = useAtom(lastTxStatusAtom)
  const setLastTransactionHash = useSetAtom(lastTxHashAtom)

  const buttonsDisabled = ["approve", "pending"].includes(transactionStatus)

  const { contract } = useContract({
    abi: Erc20Abi as Abi,
    address: ETHTokenAddress,
  })

  const { error, sendAsync: mintWithStarknetReact } = useSendTransaction({
    calls:
      contract && account?.address
        ? [
            contract.populate("transfer", [
              account.address,
              Number(bigDecimal.parseEther(mintAmount).value),
            ]),
          ]
        : undefined,
  })

  const handleMintSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setTransactionStatus("approve")
      const { transaction_hash } = await mintWithStarknetReact()
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
        onSubmit={handleMintSubmit}
        direction="column"
        flex={1}
        p="4"
        gap="3"
        borderRadius="lg"
      >
        <Heading as="h2">Mint token</Heading>
        <Input
          disabled
          placeholder="Amount"
          type="text"
          id="mint-amount"
          name="fname"
          value={mintAmount}
          onChange={(e) => setMintAmount(e.target.value)}
        />
        {/* TODO: Verify it's ok that the submit has been enabled */}

        <Input type="submit" disabled={buttonsDisabled} value="Submit" />
      </Flex>
    </Flex>
  )
}
