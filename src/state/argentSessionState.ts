import { Session } from "@argent/x-sessions"
import { atomWithReset } from "jotai/utils"
import { Account, AccountInterface } from "starknet"

export const sessionAccountAtom = atomWithReset<
  Account | AccountInterface | undefined
>(undefined)
export const sessionAtom = atomWithReset<Session | undefined>(undefined)
