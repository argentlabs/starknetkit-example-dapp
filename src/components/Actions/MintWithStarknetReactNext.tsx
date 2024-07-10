import { ETHTokenAddress, provider } from "@/constants"
import { lastTxHashAtom, lastTxStatusAtom } from "@/state/transactionState"
import { Flex, Heading, Input } from "@chakra-ui/react"
import { useAtom, useSetAtom } from "jotai"
import { useState } from "react"
import { Abi, useContract } from "starknet-react-core-next"

const abi = [
  {
    type: "function",
    name: "permissionedMint",
    state_mutability: "external",
    inputs: [
      {
        name: "recipient",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "amount",
        type: "core::integer::u256",
      },
    ],
    outputs: [],
  },
] as const satisfies Abi

const MintWithStarknetReact = () => {
  const [mintAmount, setMintAmount] = useState("10")

  const [transactionStatus, setTransactionStatus] = useAtom(lastTxStatusAtom)
  const setLastTransactionHash = useSetAtom(lastTxHashAtom)

  const buttonsDisabled = ["approve", "pending"].includes(transactionStatus)

  const { contract } = useContract({
    abi,
    address: ETHTokenAddress,
    provider,
  })

  const handleMintSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setTransactionStatus("approve")
      const { transaction_hash } = await contract
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

        <Input
          type="submit"
          disabled={true || buttonsDisabled}
          value="Not possible with ETH!"
        />
      </Flex>
    </Flex>
  )
}

export { MintWithStarknetReact }
