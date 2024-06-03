import { mintToken } from "@/services/mint"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import { lastTxHashAtom, lastTxStatusAtom } from "@/state/transactionState"
import { Flex, Heading, Input } from "@chakra-ui/react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useState } from "react"

const Mint = () => {
  const wallet = useAtomValue(walletStarknetkitLatestAtom)
  const [transactionStatus, setTransactionStatus] = useAtom(lastTxStatusAtom)
  const setLastTransactionHash = useSetAtom(lastTxHashAtom)

  const [mintAmount, setMintAmount] = useState("10")
  const buttonsDisabled = ["approve", "pending"].includes(transactionStatus)

  const handleMintSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setTransactionStatus("approve")
      const { transaction_hash } = await mintToken(wallet?.account, mintAmount)
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

        <Input type="submit" disabled={true} value="Not possible with ETH!" />
      </Flex>
    </Flex>
  )
}

export { Mint }
