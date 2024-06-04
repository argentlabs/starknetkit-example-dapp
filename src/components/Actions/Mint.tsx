import { useWaitForTx } from "@/hooks/useWaitForTx"
import { mintToken, mintTokenRcpMethod } from "@/services/mint"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import { walletStarknetkitNextAtom } from "@/state/connectedWalletStarknetkitNext"
import { lastTxHashAtom, lastTxStatusAtom } from "@/state/transactionState"
import { Flex, Heading, Input } from "@chakra-ui/react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { FC, useState } from "react"
import { Account, AccountInterface } from "starknet"
import { StarknetWindowObject } from "starknetkit-next"

const MintLatest = () => {
  const wallet = useAtomValue(walletStarknetkitLatestAtom)
  return <Mint account={wallet?.account as AccountInterface} />
}

const MintNext = () => {
  const wallet = useAtomValue(walletStarknetkitNextAtom)
  return <Mint wallet={wallet} />
}

interface MintProps {
  account?: Account | AccountInterface
  wallet?: StarknetWindowObject | null
}

const Mint: FC<MintProps> = ({ account, wallet }) => {
  const [transactionStatus, setTransactionStatus] = useAtom(lastTxStatusAtom)
  const setLastTransactionHash = useSetAtom(lastTxHashAtom)

  const [mintAmount, setMintAmount] = useState("10")
  const buttonsDisabled = ["approve", "pending"].includes(transactionStatus)

  const handleMintSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setTransactionStatus("approve")
      const { transaction_hash } = account
        ? await mintToken(account, mintAmount)
        : await mintTokenRcpMethod(wallet, mintAmount)
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

export { MintLatest, MintNext }
