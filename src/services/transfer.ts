import Erc20Abi from "@/abi/ERC20.json"
import { ETHTokenAddress } from "@/constants"
import { parseInputAmountToUint256 } from "@/helpers/token"
import { Account, AccountInterface, CallData, Contract } from "starknet"
import { StarknetWindowObject } from "starknetkit-next"

export const transfer = async (
  account: Account | AccountInterface,
  transferTo: string,
  transferAmount: string,
): Promise<any> => {
  const erc20Contract = new Contract(
    Erc20Abi as any,
    ETHTokenAddress,
    account as any,
  )
  return await erc20Contract.transfer(
    transferTo,
    parseInputAmountToUint256(transferAmount),
  )
}

export const transferJSONRpcMethod = async (
  wallet: StarknetWindowObject,
  transferTo: string,
  transferAmount: string,
): Promise<any> => {
  const transferCalldata = CallData.compile({
    to: transferTo,
    value: parseInputAmountToUint256(transferAmount),
  })

  return wallet.request({
    type: "wallet_addInvokeTransaction",
    params: {
      calls: [
        {
          contract_address: ETHTokenAddress,
          entry_point: "transfer",
          calldata: transferCalldata,
        },
      ],
    },
  })
}
