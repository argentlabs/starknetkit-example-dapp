import {
  ARGENT_DUMMY_CONTRACT_ADDRESS,
  ARGENT_SESSION_SERVICE_BASE_URL,
  CHAIN_ID,
  ETHTokenAddress,
} from "@/constants"
import { sessionKey } from "@/helpers/openSessionHelper"
import { parseInputAmountToUint256 } from "@/helpers/token"
import { sessionAccountAtom, sessionAtom } from "@/state/argentSessionState"
import { connectorDataAtom } from "@/state/connectedWalletStarknetkitNext"
import { lastTxStatusAtom } from "@/state/transactionState"
import { createOutsideExecutionCall } from "@argent/x-sessions"
import { Box, Button, Flex, Heading, Input, useToast } from "@chakra-ui/react"
import { useAtomValue } from "jotai"
import { useState } from "react"
import { Abi, Calldata, constants, Contract, RawArgs } from "starknet"
import DummyAbi from "../../abi/DummyContract.json"
import Erc20Abi from "../../abi/ERC20.json"

type OutsideExecution = {
  contractAddress: string
  entrypoint: string
  calldata?: Calldata | RawArgs
}

const SessionKeysExecuteOutside = ({}) => {
  const session = useAtomValue(sessionAtom)
  const sessionAccount = useAtomValue(sessionAccountAtom)
  const connectorData = useAtomValue(connectorDataAtom)
  const transactionStatus = useAtomValue(lastTxStatusAtom)
  const toast = useToast()

  const [amount, setAmount] = useState("")
  const [outsideExecution, setOutsideExecution] = useState<
    OutsideExecution | undefined
  >()
  const [error, setError] = useState<string | null>(null)
  const buttonsDisabled =
    ["approve", "pending"].includes(transactionStatus) || !session

  const handleSubmitEFO = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      console.log({ session, sessionAccount })

      if (!session || !sessionAccount) {
        throw new Error("No open session")
      }

      if (!connectorData || !connectorData.account) {
        throw new Error("No connector data")
      }

      let transferCallData
      if (CHAIN_ID === constants.NetworkName.SN_MAIN) {
        const dummyContract = new Contract(
          DummyAbi as Abi,
          ARGENT_DUMMY_CONTRACT_ADDRESS,
          sessionAccount,
        )
        transferCallData = dummyContract.populate("set_number", {
          number: 1,
        })
      } else {
        const erc20Contract = new Contract(
          Erc20Abi as Abi,
          ETHTokenAddress,
          sessionAccount,
        )

        // https://www.starknetjs.com/docs/guides/use_erc20/#interact-with-an-erc20
        // check .populate
        transferCallData = erc20Contract.populate("transfer", {
          recipient: connectorData.account,
          amount: parseInputAmountToUint256(amount),
        })
      }

      const { contractAddress, entrypoint, calldata } =
        await createOutsideExecutionCall({
          session,
          sessionKey,
          calls: [transferCallData],
          argentSessionServiceUrl: ARGENT_SESSION_SERVICE_BASE_URL,
        })

      setOutsideExecution({ contractAddress, entrypoint, calldata })

      console.log(
        "execute from outside response",
        JSON.stringify({ contractAddress, entrypoint, calldata }),
      )
    } catch (e) {
      console.error(e)
      setError((e as any).message)
    }
  }

  const copyData = () => {
    navigator.clipboard.writeText(JSON.stringify(outsideExecution))
    toast({
      title: "Outside execution payload copied",
      duration: 1000,
      containerStyle: { minWidth: "50px" },
      status: "success",
    })
  }

  return (
    <Flex
      as="form"
      flexDirection="column"
      p="4"
      gap="3"
      onSubmit={handleSubmitEFO}
      w={{
        base: "full",
        md: "fit-content",
      }}
    >
      <Heading as="h4">Get outside execution call</Heading>
      <Input
        p="2"
        rounded="lg"
        type="text"
        id="transfer-amount"
        name="fname"
        placeholder="Amount"
        value={amount}
        disabled={!session}
        onChange={(e) => setAmount(e.target.value)}
      />

      <Flex alignItems="center" gap="4">
        <Button
          colorScheme="primary"
          w="full"
          p="2"
          rounded="lg"
          type="submit"
          isDisabled={buttonsDisabled}
        >
          Get data
        </Button>

        <Button
          colorScheme="secondary"
          w="full"
          p="2"
          rounded="lg"
          onClick={copyData}
          isDisabled={buttonsDisabled || !outsideExecution}
        >
          Copy data
        </Button>
      </Flex>

      {error && <Box color="primary.red.600">{error}</Box>}
    </Flex>
  )
}

export { SessionKeysExecuteOutside }
