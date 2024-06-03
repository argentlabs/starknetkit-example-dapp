import { atomWithReset } from "jotai/utils"
import { ConnectorData, StarknetWindowObject } from "starknetkit-next"
import { Connector } from "starknetkit-next"

export const walletStarknetkitNextAtom = atomWithReset<
  StarknetWindowObject | null | undefined
>(undefined)

// TODO: export ConnectorData from starknetkit
/* {
  account?: string
  chainId?: Connector
} | null */
export const connectorDataAtom = atomWithReset<ConnectorData | null>(null)

export const connectorAtom = atomWithReset<Connector | null>(null)
