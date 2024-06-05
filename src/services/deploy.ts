import {
  Account,
  AccountInterface,
  CallData,
  InvocationsDetails,
  UniversalDeployerContractPayload,
  constants,
  num,
  stark,
  wallet,
} from "starknet"
import { StarknetWindowObject } from "starknetkit-next"

export const deploy = async (
  account: Account | AccountInterface,
  payload: UniversalDeployerContractPayload,
  details?: InvocationsDetails,
) => {
  return account.deploy(payload, details)
}

export const deployRcpMethod = async (
  wallet: StarknetWindowObject | undefined | null,
  payload: UniversalDeployerContractPayload,
) => {
  if (!wallet) {
    throw new Error("No wallet")
  }
  const { constructorCalldata, salt, classHash, unique = true } = payload
  const compiledConstructorCallData = CallData.toCalldata(constructorCalldata)
  const deploySalt = salt ?? stark.randomAddress()
  const call = {
    contract_address: constants.UDC.ADDRESS,
    entry_point: constants.UDC.ENTRYPOINT,
    calldata: [
      classHash.toString(),
      deploySalt,
      num.toCairoBool(unique),
      compiledConstructorCallData.length.toString(),
      ...compiledConstructorCallData,
    ],
  }

  return wallet.request({
    type: "wallet_addInvokeTransaction",
    params: {
      calls: [call],
    },
  })
}
