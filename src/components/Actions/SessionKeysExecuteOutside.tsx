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
  SessionDappService,
  buildSessionAccount,
} from "@argent/x-sessions"
import { useAtomValue } from "jotai"
import { useState } from "react"
import { Abi, Calldata, Contract, RawArgs, shortString, stark } from "starknet"
import Erc20Abi from "../../abi/ERC20.json"
import { Box, Button, Flex, Heading, Input } from "@chakra-ui/react"

type OutsideExecution = {
  contractAddress: string
  entrypoint: string
  calldata?: Calldata | RawArgs
}

const SessionKeysExecuteOutside = ({}) => {
  const accountSessionSignature = useAtomValue(accountSessionSignatureAtom)
  const sessionRequest = useAtomValue(sessionRequestAtom)
  const connectorData = useAtomValue(connectorDataAtom)
  const transactionStatus = useAtomValue(lastTxStatusAtom)

  const [amount, setAmount] = useState("")
  const [outsideExecution, setOutsideExecution] = useState<
    OutsideExecution | undefined
  >()
  const [error, setError] = useState<string | null>(null)
  const buttonsDisabled =
    ["approve", "pending"].includes(transactionStatus) ||
    !accountSessionSignature

  const handleSubmitEFO = async (e: React.FormEvent) => {
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

      const { contractAddress, entrypoint, calldata } =
        await sessionDappService.getOutsideExecutionCall(
          sessionRequest,
          stark.formatSignature(accountSessionSignature),
          false,
          [transferCallData],
          connectorData.account,
          await provider.getChainId(),
          shortString.encodeShortString("ANY_CALLER"),
        )

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
  }

  return (
    <Flex
      as="form"
      flexDirection="column"
      p="4"
      gap="3"
      onSubmit={handleSubmitEFO}
      w="fit-content"
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
          Get execution data
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
