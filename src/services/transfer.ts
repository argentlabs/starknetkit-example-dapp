import Erc20Abi from "@/abi/ERC20.json"
import { parseInputAmountToUint256 } from "@/helpers/token"
import { Account, AccountInterface, CallData, Contract } from "starknet"
import { StarknetWindowObject } from "starknetkit-next"

export const ETHTokenAddress =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"

export const DAITokenAddress =
  "0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3"

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
    type: "starknet_addInvokeTransaction",
    params: {
      calls: [
        {
          contract_address: ETHTokenAddress,
          entrypoint: "transfer",
          calldata: transferCalldata,
        },
      ],
    },
  })
}
