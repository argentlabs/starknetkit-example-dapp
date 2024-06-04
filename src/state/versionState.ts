import { atomWithReset } from "jotai/utils"

export const starknetkitVersionAtom = atomWithReset<string | undefined>(
  undefined,
)
export const starknetReactVersionAtom = atomWithReset<string | undefined>(
  undefined,
)
