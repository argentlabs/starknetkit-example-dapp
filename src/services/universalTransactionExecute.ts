import {
  Account,
  AccountInterface,
  AllowArray,
  Call,
  Calldata,
  CallData,
} from "starknet"
import { StarknetWindowObject } from "starknetkit-next"

interface ExecuteTransaction {
  account: Account | AccountInterface
  calls: AllowArray<Call> | undefined
}

interface ExecuteTransactionJSONRpcMethodProps {
  contract_address: string
  entry_point: string
  calldata: Calldata
  wallet: StarknetWindowObject | undefined | null
}

export const universalTransactionExecute = async ({
  account,
  calls,
}: ExecuteTransaction): Promise<any> => {
  if (!account) {
    throw Error("account not connected")
  }

  if (calls === undefined) {
    throw Error("calls not defined")
  }

  return account.execute(calls)
}

export const universalTransactionExecuteJSONRpcMethod = async ({
  wallet,
  calldata,
  contract_address,
  entry_point,
}: ExecuteTransactionJSONRpcMethodProps): Promise<any> => {
  if (!wallet) {
    throw Error("wallet not connected")
  }

  console.log({
    contract_address,
    entry_point,
    calldata,
  })

  return wallet.request({
    type: "wallet_addInvokeTransaction",
    params: {
      calls: [
        {
          contract_address,
          entry_point,
          calldata: CallData.compile(calldata),
        },
      ],
    },
  })
}
