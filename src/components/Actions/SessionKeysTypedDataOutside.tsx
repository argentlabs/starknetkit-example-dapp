import {
  ARGENT_SESSION_SERVICE_BASE_URL,
  ETHTokenAddress,
  provider,
} from "@/constants"
import { dappKey } from "@/helpers/openSessionHelper"
import { parseInputAmountToUint256 } from "@/helpers/token"
import {
  accountSessionSignatureAtom,
  sessionRequestAtom,
} from "@/state/argentSessionState"
import { connectorDataAtom } from "@/state/connectedWalletStarknetkitNext"
import { lastTxStatusAtom } from "@/state/transactionState"
import {
  ArgentSessionService,
  OutsideExecutionTypedDataResponse,
  SessionDappService,
  buildSessionAccount,
} from "@argent/x-sessions"
import { Button, Flex, Heading, Input, useToast } from "@chakra-ui/react"
import { useAtomValue } from "jotai"
import { useState } from "react"
import { Abi, Contract, stark } from "starknet"
import Erc20Abi from "../../abi/ERC20.json"

const SessionKeysTypedDataOutside = () => {
  const accountSessionSignature = useAtomValue(accountSessionSignatureAtom)
  const sessionRequest = useAtomValue(sessionRequestAtom)
  const connectorData = useAtomValue(connectorDataAtom)
  const transactionStatus = useAtomValue(lastTxStatusAtom)
  const toast = useToast()

  const [amount, setAmount] = useState("")
  const [outsideExecution, setOutsideExecution] = useState<
    OutsideExecutionTypedDataResponse | undefined
  >()
  const [error, setError] = useState<string | null>(null)
  const buttonsDisabled =
    ["approve", "pending"].includes(transactionStatus) ||
    !accountSessionSignature

  const handleSubmitEFOTypedData = async (e: React.FormEvent) => {
    try {
      e.preventDefault()

      if (!accountSessionSignature || !sessionRequest) {
        throw new Error("No open session")
      }

      if (!connectorData || !connectorData.account) {
        throw new Error("No connector data")
      }

      // this could be stored instead of creating each time
      // in this specific example a standard account is fine, since it's passed to erc20Contract
      const sessionAccount = await buildSessionAccount({
        accountSessionSignature: stark.formatSignature(accountSessionSignature),
        sessionRequest,
        provider: provider as any, // TODO: remove after starknetjs update to 6.9.0
        chainId: await provider.getChainId(),
        address: connectorData.account,
        dappKey,
        argentSessionServiceBaseUrl: ARGENT_SESSION_SERVICE_BASE_URL,
      })

      const erc20Contract = new Contract(
        Erc20Abi as Abi,
        ETHTokenAddress,
        sessionAccount as any,
      )

      // https://www.starknetjs.com/docs/guides/use_erc20/#interact-with-an-erc20
      // check .populate
      const transferCallData = erc20Contract.populate("transfer", {
        recipient: connectorData.account,
        amount: parseInputAmountToUint256(amount),
      })

      const beService = new ArgentSessionService(
        dappKey.publicKey,
        accountSessionSignature,
        ARGENT_SESSION_SERVICE_BASE_URL,
      )

      const sessionDappService = new SessionDappService(
        beService,
        await provider.getChainId(),
        dappKey,
      )

      const { signature, outsideExecutionTypedData } =
        await sessionDappService.getOutsideExecutionTypedData(
          sessionRequest,
          stark.formatSignature(accountSessionSignature),
          false,
          [transferCallData],
          connectorData.account,
        )

      setOutsideExecution({ signature, outsideExecutionTypedData })

      console.log(
        "execute from outside typed data response",
        JSON.stringify({ signature, outsideExecutionTypedData }),
      )
    } catch (e) {
      console.error(e)
      setError((e as any).message)
    }
  }

  const copyData = () => {
    navigator.clipboard.writeText(JSON.stringify(outsideExecution))
    toast({
      title: "Outside execution typed data copied",
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
      onSubmit={handleSubmitEFOTypedData}
      w={{
        base: "full",
        md: "fit-content",
      }}
    >
      <Heading as="h2">Get outside typed data</Heading>
      <Input
        p="2"
        rounded="lg"
        type="text"
        id="transfer-amount"
        name="fname"
        placeholder="Amount"
        value={amount}
        disabled={!accountSessionSignature}
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

      {error && <div className="text-red-500">{error}</div>}
    </Flex>
  )
}

export { SessionKeysTypedDataOutside }
