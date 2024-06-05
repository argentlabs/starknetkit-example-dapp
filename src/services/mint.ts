import { ETHTokenAddress } from "@/constants"
import { parseInputAmountToUint256 } from "@/helpers/token"
import { Abi, Account, AccountInterface, CallData, Contract } from "starknet"
import { StarknetWindowObject } from "starknetkit-next"
import Erc20Abi from "@/abi/ERC20.json"

export const mintToken = async (
  account: Account | AccountInterface,
  mintAmount: string,
): Promise<any> => {
  const erc20Contract = new Contract(
    Erc20Abi as Abi,
    ETHTokenAddress,
    account as any,
  )

  return erc20Contract.mint(
    account.address,
    parseInputAmountToUint256(mintAmount),
  )
}

export const mintTokenRcpMethod = async (
  wallet: StarknetWindowObject | undefined | null,
  mintAmount: string,
): Promise<any> => {
  if (!wallet) {
    throw new Error("No wallet")
  }

  const mintCalldata = CallData.compile({
    to: ETHTokenAddress,
    value: parseInputAmountToUint256(mintAmount),
  })

  return wallet.request({
    type: "wallet_addInvokeTransaction",
    params: {
      calls: [
        {
          contract_address: ETHTokenAddress,
          entry_point: "mint",
          calldata: mintCalldata,
        },
      ],
    },
  })
}
