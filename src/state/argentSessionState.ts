import { atom } from "jotai"
import { OffChainSession } from "@argent/x-sessions"
import { Signature } from "starknet"

export const sessionAccountAtom = atom<string | undefined>(undefined)
export const accountSessionSignatureAtom = atom<
  string[] | Signature | undefined
>(undefined)
export const sessionRequestAtom = atom<OffChainSession | undefined>(undefined)
