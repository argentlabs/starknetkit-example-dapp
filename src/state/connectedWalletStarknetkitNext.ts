import {
  AccountChangeEventHandler,
  ChainId,
  NetworkChangeEventHandler,
} from "@starknet-io/types-js"
import { useAtomValue, useSetAtom } from "jotai"
import { atomWithReset } from "jotai/utils"
import { useEffect } from "react"
import { ConnectorData, StarknetWindowObject } from "starknetkit-next"
import { Connector } from "starknetkit-next"

export const walletStarknetkitNextAtom = atomWithReset<
  StarknetWindowObject | null | undefined
>(undefined)

export const connectorDataAtom = atomWithReset<ConnectorData | null>(null)

export const connectorAtom = atomWithReset<Connector | null>(null)

export const useWalletAccountChange = () => {
  const wallet = useAtomValue(walletStarknetkitNextAtom)
  const setConnectorData = useSetAtom(connectorDataAtom)

  const accountChangeHandler: AccountChangeEventHandler = (
    accounts?: string[],
  ) => {
    setConnectorData((prev) => ({
      account: accounts?.[0],
      chainId: prev?.chainId,
    }))
  }
  const networkChangeHandler: NetworkChangeEventHandler = async (
    chainId?: ChainId,
    accounts?: string[],
  ) => {
    let walletAccount = undefined
    if (!accounts || accounts.length === 0) {
      walletAccount = await wallet?.request({
        type: "wallet_requestAccounts",
      })
    }

    setConnectorData({
      account: accounts?.[0] || walletAccount?.[0],
      chainId: chainId ? BigInt(chainId) : undefined,
    })
  }

  wallet?.on("accountsChanged", accountChangeHandler)
  wallet?.on("networkChanged", networkChangeHandler)

  useEffect(() => {
    wallet?.off("accountsChanged", accountChangeHandler)
    wallet?.off("networkChanged", networkChangeHandler)
    return
  }, [wallet, accountChangeHandler, networkChangeHandler])
}
