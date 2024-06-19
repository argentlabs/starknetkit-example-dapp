import {
  ARGENT_DUMMY_CONTRACT_ADDRESS,
  ARGENT_SESSION_SERVICE_BASE_URL,
  CHAIN_ID,
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
import {
  lastTxErrorAtom,
  lastTxHashAtom,
  lastTxStatusAtom,
} from "@/state/transactionState"
import { buildSessionAccount } from "@argent/x-sessions"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useState } from "react"
import { Abi, Contract, Provider, constants, stark } from "starknet"
import Erc20Abi from "../../abi/ERC20.json"
import DummyAbi from "../../abi/DummyContract.json"
import { Button, Flex, Heading, Input } from "@chakra-ui/react"

const SessionKeysExecute = () => {
  const [amount, setAmount] = useState("")
  const [error, setError] = useState<string | null>(null)

  const accountSessionSignature = useAtomValue(accountSessionSignatureAtom)
  const sessionRequest = useAtomValue(sessionRequestAtom)
  const connectorData = useAtomValue(connectorDataAtom)
  const [transactionStatus, setTransactionStatus] = useAtom(lastTxStatusAtom)
  const setLastTransactionHash = useSetAtom(lastTxHashAtom)
  const setLastTxError = useSetAtom(lastTxErrorAtom)

  const buttonsDisabled =
    ["approve", "pending"].includes(transactionStatus) ||
    !accountSessionSignature

  const submitSessionTransaction = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      setTransactionStatus("pending")
      setLastTxError("")
      if (!accountSessionSignature || !sessionRequest) {
        throw new Error("No open session")
      }

      if (!connectorData || !connectorData.account) {
        throw new Error("No connector data")
      }

      // this could be stored instead of creating each time
      const sessionAccount = await buildSessionAccount({
        accountSessionSignature: stark.formatSignature(accountSessionSignature),
        sessionRequest,
        provider: provider as any, // TODO: remove after starknetjs update to 6.9.0
        chainId: await provider.getChainId(),
        address: connectorData.account,
        dappKey,
        argentSessionServiceBaseUrl: ARGENT_SESSION_SERVICE_BASE_URL,
      })

      if (CHAIN_ID === constants.NetworkName.SN_MAIN) {
        const dummyContract = new Contract(
          DummyAbi as Abi,
          ARGENT_DUMMY_CONTRACT_ADDRESS,
          sessionAccount as any,
        )
        const transferCallData = dummyContract.populate("set_number", {
          number: 1,
        })

        // https://www.starknetjs.com/docs/guides/estimate_fees/#estimateinvokefee
        const { suggestedMaxFee } = await sessionAccount.estimateInvokeFee({
          contractAddress: ARGENT_DUMMY_CONTRACT_ADDRESS,
          entrypoint: "set_number",
          calldata: transferCallData.calldata,
        })

        // https://www.starknetjs.com/docs/guides/estimate_fees/#fee-limitation
        const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10)
        // send to same account
        const result = await dummyContract.set_number(
          transferCallData.calldata,
          {
            maxFee,
          },
        )
        setLastTransactionHash(result.transaction_hash)
      } else {
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

        // https://www.starknetjs.com/docs/guides/estimate_fees/#estimateinvokefee
        const { suggestedMaxFee } = await sessionAccount.estimateInvokeFee({
          contractAddress: ETHTokenAddress,
          entrypoint: "transfer",
          calldata: transferCallData.calldata,
        })

        // https://www.starknetjs.com/docs/guides/estimate_fees/#fee-limitation
        const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10)
        // send to same account
        const result = await erc20Contract.transfer(transferCallData.calldata, {
          maxFee,
        })
        setLastTransactionHash(result.transaction_hash)
      }

      setTransactionStatus("success")
    } catch (e) {
      console.error(e)
      setError((e as any).message)
      setTransactionStatus("idle")
    }
  }

  return (
    <Flex
      as="form"
      flexDirection="column"
      p="4"
      gap="3"
      onSubmit={submitSessionTransaction}
      w="fit-content"
    >
      {CHAIN_ID === constants.NetworkName.SN_MAIN ? (
        <Heading as="h2">Invoke dummy function with session keys</Heading>
      ) : (
        <>
          <Heading as="h2">Transfer with session keys</Heading>
          <Input
            //className="p-2 rounded-lg max-w-96"
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
        </>
      )}

      <Button
        p="2"
        rounded="lg"
        isDisabled={buttonsDisabled}
        colorScheme="primary"
        type="submit"
        disabled={buttonsDisabled}
      >
        Transfer with session
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </Flex>
  )
}

export { SessionKeysExecute }
