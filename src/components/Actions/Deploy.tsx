import { deploy, deployRcpMethod } from "@/services/deploy"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import { walletStarknetkitNextAtom } from "@/state/connectedWalletStarknetkitNext"
import { lastTxHashAtom, lastTxStatusAtom } from "@/state/transactionState"
import { Button, Heading, Flex, Input } from "@chakra-ui/react"
import { useAtomValue, useSetAtom } from "jotai"
import { FC, useState } from "react"
import {
  Account,
  AccountInterface,
  UniversalDeployerContractPayload,
} from "starknet"
import { StarknetWindowObject } from "starknetkit-next"

const DeployLatest = () => {
  const wallet = useAtomValue(walletStarknetkitLatestAtom)
  return <Deploy account={wallet?.account as AccountInterface} />
}
const DeployNext = () => {
  const wallet = useAtomValue(walletStarknetkitNextAtom)
  return <Deploy wallet={wallet} />
}

interface DeployProps {
  account?: Account | AccountInterface
  wallet?: StarknetWindowObject | undefined | null
}

const Deploy: FC<DeployProps> = ({ account, wallet }) => {
  const setTransactionStatus = useSetAtom(lastTxStatusAtom)
  const setLastTransactionHash = useSetAtom(lastTxHashAtom)
  const [deployClassHash, setDeployClassHash] = useState("")

  const handleDeploy = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      if (!deployClassHash) {
        throw new Error("No class hash")
      }
      const payload: UniversalDeployerContractPayload = {
        classHash: deployClassHash,
      }

      const result = account
        ? await deploy(account, payload)
        : await deployRcpMethod(wallet, payload)
      setLastTransactionHash(result.transaction_hash)
      setTransactionStatus("pending")
    } catch (e) {
      console.error(e)
      setTransactionStatus("idle")
    }
  }

  return (
    <Flex
      as="form"
      onSubmit={handleDeploy}
      direction="column"
      flex={1}
      p="4"
      gap="3"
      borderTopRightRadius="lg"
      borderBottomRightRadius="lg"
    >
      <Heading as="h2">Deploy</Heading>

      <label htmlFor="deployClassHash">Class Hash to deploy:</label>
      <Input
        style={{ width: "100%" }}
        id="deployClassHash"
        name="deployClassHash"
        type="text"
        onChange={(e) => {
          setDeployClassHash(e.target.value)
        }}
        value={deployClassHash}
      />

      <Button type="submit">Deploy</Button>
    </Flex>
  )
}

export { DeployLatest, DeployNext }
