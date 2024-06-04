import { Status } from "@/types/status"
import { atomWithReset } from "jotai/utils"

export const lastTxHashAtom = atomWithReset<string | undefined>(undefined)
export const lastTxStatusAtom = atomWithReset<Status>("idle")
export const lastTxErrorAtom = atomWithReset<string | undefined>(undefined)
