import {
  Account,
  AccountInterface,
  constants,
  num,
  shortString,
} from "starknet"
import { StarknetWindowObject } from "starknetkit-next"

export const signMessage = async (
  account: Account | AccountInterface,
  chainId: constants.StarknetChainId | string,
  message: string,
) => {
  if (!shortString.isShortString(message)) {
    throw Error("message must be a short string")
  }

  return account.signMessage({
    domain: {
      name: "Example DApp",
      chainId,
      version: "0.0.1",
    },
    types: {
      StarkNetDomain: [
        { name: "name", type: "felt" },
        { name: "chainId", type: "felt" },
        { name: "version", type: "felt" },
      ],
      Message: [{ name: "message", type: "felt" }],
    },
    primaryType: "Message",
    message: {
      message,
    },
  })
}

export const signMessageRcpMethod = async (
  wallet: StarknetWindowObject | undefined | null,
  chainId: bigint | undefined,
  message: string,
  skipDeploy = false,
) => {
  if (!shortString.isShortString(message)) {
    throw Error("message must be a short string")
  }

  if (!wallet) {
    throw Error("wallet not connected")
  }

  return wallet.request({
    type: "wallet_signTypedData",
    params: {
      domain: {
        name: "Example DApp",
        chainId: num.toHex(chainId ?? 0),
        version: "0.0.1",
      },
      types: {
        StarkNetDomain: [
          { name: "name", type: "felt" },
          { name: "chainId", type: "felt" },
          { name: "version", type: "felt" },
        ],
        Message: [{ name: "message", type: "felt" }],
      },
      primaryType: "Message",
      message: {
        message,
      },
    },
    //@ts-ignore
    skipDeploy,
  })
}
