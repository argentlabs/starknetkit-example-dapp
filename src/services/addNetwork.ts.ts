import { StarknetWindowObject as StarknetWindowObjectNext } from "starknetkit-next"
import { StarknetWindowObject as StarknetWindowObjectLatest } from "starknetkit-latest"

export const addNetworkNext = async (
  wallet: StarknetWindowObjectNext | undefined | null,
) => {
  if (!wallet) {
    throw Error("starknet wallet not connected")
  }

  await wallet.request({
    type: "wallet_addStarknetChain",
    params: {
      id: "dapp-test",
      chain_id: "SN_DAPP_TEST",
      chain_name: "Test chain name",
      rpc_urls: ["http://localhost:5050/rpc"],
    },
  })
}
export const switchNetworkNext = async (
  wallet: StarknetWindowObjectNext | undefined | null,
) => {
  if (!wallet) {
    throw Error("starknet wallet not connected")
  }

  await wallet.request({
    type: "wallet_switchStarknetChain",
    params: {
      chainId: "SN_DAPP_TEST",
    },
  })
}

export const switchNetworkLatest = async (
  wallet: StarknetWindowObjectLatest | undefined | null,
) => {
  if (!wallet) {
    throw Error("starknet wallet not connected")
  }

  await wallet.request({
    type: "wallet_switchStarknetChain",
    params: {
      chainId: "SN_DAPP_TEST",
    },
  })
}

export const addNetworkLatest = async (
  wallet: StarknetWindowObjectLatest | undefined | null,
) => {
  if (!wallet) {
    throw Error("starknet wallet not connected")
  }

  await wallet.request({
    type: "wallet_addStarknetChain",
    params: {
      id: "dapp-test",
      chainId: "SN_DAPP_TEST",
      chainName: "Test chain name",
      baseUrl: "http://localhost:5050",
      rpcUrls: ["http://localhost:5050/rpc"],
    },
  })
}
