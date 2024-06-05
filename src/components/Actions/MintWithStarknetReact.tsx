import { ETHTokenAddress } from "@/constants"
import { lastTxHashAtom, lastTxStatusAtom } from "@/state/transactionState"
import { Status } from "@/types/status"
import { bigDecimal } from "@argent/x-shared"
import { Heading, Input } from "@chakra-ui/react"
import { Flex } from "@chakra-ui/react"
import { useAccount, useContractWrite } from "@starknet-react/core"
import { useAtom, useSetAtom } from "jotai"
import { FC, useMemo, useState } from "react"
import { AccountInterface } from "starknet"

const MintWithStarknetReact = () => {
  const { account } = useAccount()
  const [mintAmount, setMintAmount] = useState("10")

  const [transactionStatus, setTransactionStatus] = useAtom(lastTxStatusAtom)
  const setLastTransactionHash = useSetAtom(lastTxHashAtom)

  const buttonsDisabled = ["approve", "pending"].includes(transactionStatus)

  const mintCalls = useMemo(() => {
    if (!account) {
      return []
    }
    return [
      {
        contractAddress: ETHTokenAddress,
        entrypoint: "transfer",
        calldata: [
          account?.address,
          Number(bigDecimal.parseEther(mintAmount).value),
          0,
        ],
      },
    ]
  }, [account, mintAmount])

  const { writeAsync: mintWithStarknetReact } = useContractWrite({
    calls: mintCalls,
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
