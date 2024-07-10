import {
  /* AddDeployAccountTransactionParameters,
  AddDeployAccountTransactionResult,
  AddInvokeTransactionParameters, */
  /* AddStarknetChainParameters, */
  WatchAssetParameters,
} from "get-starknet-core"
import { RpcMessage } from "../types/RpcMessage"
import {
  CallData,
  DeployAccountContractPayload,
  DeployContractResponse,
  TypedData,
  ec,
  hash,
  num,
  shortString,
  stark,
} from "starknet"
import { useCallback } from "react"
import { StarknetWindowObject } from "starknetkit-next"
import { ETHTokenAddress } from "@/constants"
import {
  AddInvokeTransactionParameters,
  AddStarknetChainParameters,
} from "@starknet-io/types-js"

export function useRpcMessageHandler(
  wallet: StarknetWindowObject,
  onSuccess: (txt: string) => void,
) {
  return useCallback(
    (message: RpcMessage, param: string) =>
      handleRpcMessage(wallet, message, param, onSuccess),
    [onSuccess, wallet],
  )
}

export async function handleRpcMessage(
  wallet: StarknetWindowObject,
  message: RpcMessage,
  param: string,
  onSuccess: (txt: string) => void,
) {
  switch (message) {
    case RpcMessage.wallet_requestAccounts: {
      const response = await wallet.request({
        type: message,
        params: { silent_mode: false },
      })
      onSuccess(response[0])
      break
    }
    case RpcMessage.wallet_requestChainId: {
      const response = await wallet.request({ type: message })
      onSuccess(response)
      break
    }
    case RpcMessage.wallet_watchAsset: {
      const asset: WatchAssetParameters = {
        type: "ERC20",
        options: {
          address: param,
          decimals: 18,
          name: "snjs6-celebration",
          symbol: "snsj6",
        }, // decimals, name, symbol options are useless and are not taken into account by the Wallet
      }
      const response = await wallet.request({
        type: message,
        params: asset,
      })
      onSuccess(response ? "True" : "False")
      break
    }
    case RpcMessage.wallet_switchStarknetChain: {
      const response = await wallet.request({
        type: "wallet_switchStarknetChain",
        params: { chainId: param },
      })
      onSuccess(response ? "True" : "False")
      break
    }
    case RpcMessage.wallet_addStarknetChain: {
      const newChain: AddStarknetChainParameters = {
        id: param,
        chain_id: shortString.encodeShortString(param), // A 0x-prefixed hexadecimal string
        chain_name: param,
        rpc_urls: ["http://192.168.1.44:6060"],
        native_currency: {
          type: "ERC20",
          options: {
            address: ETHTokenAddress, // Not part of the standard, but required by StarkNet as it can work with any ERC20 token as the fee token
            name: "ETHEREUM",
            symbol: "ETH", // 2-6 characters long
            decimals: 18,
          },
        },
      } // hex of string
      const response = await wallet.request({
        type: "wallet_addStarknetChain",
        params: newChain,
      })
      onSuccess(response ? "True" : "False")
      break
    }
    case RpcMessage.wallet_addInvokeTransaction: {
      const contractAddress =
        "0x697d3bc2e38d57752c28be0432771f4312d070174ae54eef67dd29e4afb174"
      const entrypoint = "increase_balance"
      const invokeParams: AddInvokeTransactionParameters = {
        calls: [
          {
            contract_address: contractAddress,
            entry_point: entrypoint,
            calldata: [num.toHex(param)],
          },
        ],
      }
      const response = await wallet.request({
        type: "wallet_addInvokeTransaction",
        params: invokeParams,
      })

      if (!response.transaction_hash) {
        throw new Error("Transaction could not be added")
      }

      onSuccess(response.transaction_hash)
      break
    }
    case RpcMessage.wallet_addDeclareTransaction: {
      // const myParams: AddDeclareTransactionParameters = {
      //   compiled_class_hash: hash.computeCompiledClassHash(contractCasm),
      //   contract_class: {
      //     sierra_program: contractSierra.sierra_program,
      //     contract_class_version: "0x01",
      //     entry_points_by_type: contractSierra.entry_points_by_type,
      //     abi: json.stringify(contractSierra.abi),
      //   },
      // }
      // const myRequest = {
      //   type: message,
      //   params: myParams,
      // }
      // const response = await wallet.request(myRequest)
      // const txtResponse: string =
      //   typeof response == "string"
      //     ? response
      //     : (response as AddDeclareTransactionResult).transaction_hash +
      //       " " +
      //       (response as AddDeclareTransactionResult).class_hash
      // setResponse(txtResponse)
      // onOpen()
      break
    }
    /* case RpcMessage.wallet_addDeployAccountTransaction: {
      const decClassHash =
        "0x2bfd9564754d9b4a326da62b2f22b8fea7bbeffd62da4fcaea986c323b7aeb" // OZ cairo v2.1.0
      const privateKey = stark.randomAddress()
      console.log("New account :\nprivateKey=", privateKey)
      const starkKeyPub = ec.starkCurve.getStarkKey(privateKey)
      // calculate address
      const OZaccountConstructorCallData = CallData.compile([starkKeyPub])
      const OZcontractAddress = hash.calculateContractAddressFromHash(
        starkKeyPub,
        decClassHash,
        OZaccountConstructorCallData,
        0,
      )
      console.log("Precalculated account address=", OZcontractAddress)
      // fund account address
      // const myCalldata = CallData.compile([OZcontractAddress, cairo.uint256(5 * 10 ** 15)])
      // const myTransferParams: AddInvokeTransactionParameters = {
      //     calls: [{
      //         contract_address: constants.addrETH,
      //         entrypoint: "transfer",
      //         calldata: myCalldata
      //     }]
      // }
      // const myTransferRequest = {
      //     type: message,
      //     params: myTransferParams
      // };
      // const responseTransfer = await wallet.request(myTransferRequest);
      // const txtResponseTransfer: string = typeof (responseTransfer) == "string" ?
      //     responseTransfer : (responseTransfer as AddInvokeTransactionResult).transaction_hash;
      // console.log("transfer TH=", txtResponseTransfer);
      // await wait(5000);
      console.log("Start deploy account")
      // deploy account

      const myParams: DeployAccountContractPayload = {
        classHash: decClassHash,
        addressSalt: starkKeyPub,
        constructorCalldata: [starkKeyPub],
      }
      const myRequest = {
        type: "wallet_addDeclareTransaction",
        params: myParams,
      }
      const response = await wallet.request(myRequest)
      console.log("Result deploy account=", response)
      const txtResponse: string =
        typeof response == "string"
          ? response
          : "th:" +
            (response as DeployContractResponse).transaction_hash +
            " ad:" +
            (response as DeployContractResponse).contract_address +
            " (pk:" +
            privateKey +
            ")"
      onSuccess(txtResponse)
      break
    } */
    case RpcMessage.wallet_signTypedData: {
      const chainId = await wallet.request({ type: "wallet_requestChainId" })

      if (!chainId) {
        throw new Error("No chainId found")
      }

      const data: TypedData = {
        domain: {
          chainId, // keep chainId dynamic
          name: "myDapp",
          version: "0.0.1",
        },
        message: {
          message: `test message ${Math.floor(Math.random() * 1000)}`,
        },
        primaryType: "Message",
        types: {
          Message: [
            {
              name: "message",
              type: "string",
            },
          ],
          StarkNetDomain: [
            {
              name: "name",
              type: "felt",
            },
            {
              name: "chainId",
              type: "felt",
            },
            {
              name: "version",
              type: "felt",
            },
          ],
        },
      }

      const response = await wallet.request({
        type: message,
        params: data,
      })

      const txtResponse = response.map((res) => res).join(", ")

      onSuccess(txtResponse)
      break
    }
    case RpcMessage.wallet_supportedSpecs: {
      const response = await wallet.request({ type: message })
      onSuccess(response.join(", "))
      break
    }
    case RpcMessage.wallet_getPermissions: {
      const response = await wallet.request({ type: message })
      onSuccess(response.join(", "))
      break
    }
    case RpcMessage.wallet_deploymentData: {
      const response = await wallet.request({ type: message })
      onSuccess(JSON.stringify(response))
      break
    }
    default: {
      console.error("Invalid message :", message)
      break
    }
  }
}
