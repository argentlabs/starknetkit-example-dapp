import { Status } from "@/helpers/status"
import { atom } from "jotai"

export const lastTxHashAtom = atom<string | undefined>(undefined)
export const lastTxStatusAtom = atom<Status>("idle")
export const lastTxErrorAtom = atom<string | undefined>(undefined)
