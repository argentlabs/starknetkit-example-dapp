import { StarknetWindowObject as StarknetWindowObjectNext } from "starknetkit-next"
import { StarknetWindowObject as StarknetWindowObjectLatest } from "starknetkit-latest"

export const addTokenLatest = async (
  wallet: StarknetWindowObjectLatest | undefined | null,
  address: string,
): Promise<void> => {
  if (!wallet) {
    throw Error("starknet wallet not connected")
  }

  await wallet.request({
    type: "wallet_watchAsset",
    params: {
      type: "ERC20",
      options: {
        address,
      },
    },
  })
}

export const addTokenNext = async (
  wallet: StarknetWindowObjectNext | undefined | null,
  address: string,
): Promise<void> => {
  if (!wallet) {
    throw Error("starknet wallet not connected")
  }

  await wallet.request({
    type: "wallet_watchAsset",
    params: {
      type: "ERC20",
      options: {
        address,
      },
    },
  })
}
