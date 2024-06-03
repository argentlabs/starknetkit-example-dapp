import { atom } from "jotai"
import { StarknetWindowObject } from "starknetkit-next"
import { Connector } from "starknetkit-next"

export const walletStarknetkitNextAtom = atom<
  StarknetWindowObject | null | undefined
>(undefined)

// TODO: export ConnectorData from starknetkit
/* {
  account?: string
  chainId?: Connector
} | null */
export const connectorDataAtom = atom<any>(null)

export const connectorAtom = atom<Connector | null>(null)
