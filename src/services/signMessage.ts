import { Account, AccountInterface, constants, shortString } from "starknet"
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
  wallet: StarknetWindowObject,
  message: string,
  skipDeploy = false,
) => {
  if (!shortString.isShortString(message)) {
    throw Error("message must be a short string")
  }

  const chainId = await wallet?.request({
    type: "wallet_requestChainId",
  })

  return wallet.request({
    type: "wallet_signTypedData",
    params: {
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
    },
    //@ts-ignore
    skipDeploy,
  })
}
