import { OffChainSession } from "@argent/x-sessions"
import { atomWithReset } from "jotai/utils"
import { Signature } from "starknet"

export const sessionAccountAtom = atomWithReset<string | undefined>(undefined)
export const accountSessionSignatureAtom = atomWithReset<
  string[] | Signature | undefined
>(undefined)
export const sessionRequestAtom = atomWithReset<OffChainSession | undefined>(
  undefined,
)
