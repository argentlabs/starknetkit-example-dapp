import { atom } from "jotai"
import { StarknetWindowObject } from "starknetkit-latest"

export const walletStarknetkitLatestAtom = atom<
  StarknetWindowObject | null | undefined
>(undefined)
