import { atomWithReset } from "jotai/utils"
import { StarknetWindowObject } from "starknetkit-latest"

export const walletStarknetkitLatestAtom = atomWithReset<
  StarknetWindowObject | null | undefined
>(undefined)
