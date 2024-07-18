import { TypedData } from "@starknet-io/types-js"
import { Account, AccountInterface } from "starknet"
import { StarknetWindowObject } from "starknetkit-next"

interface UniversalSignProps {
  account: Account | AccountInterface
  typedData: TypedData
}

interface UniversalSignJSONRpcMethodProps {
  wallet: StarknetWindowObject | undefined | null
  typedData: TypedData
}

export const universalSign = async ({
  account,
  typedData,
}: UniversalSignProps): Promise<any> => {
  if (!account) {
    throw Error("account not connected")
  }

  return account.signMessage(typedData)
}

export const universalSignJSONRpcMethod = async ({
  wallet,
  typedData,
}: UniversalSignJSONRpcMethodProps): Promise<any> => {
  if (!wallet) {
    throw Error("wallet not connected")
  }

  return wallet.request({
    type: "wallet_signTypedData",
    params: typedData,
  })
}
