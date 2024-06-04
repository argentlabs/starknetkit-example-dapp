import { Box } from "@chakra-ui/react"
import { Section } from "./Section"
import { FC } from "react"
import { constants } from "starknet"
import { useAtomValue } from "jotai"
import {
  lastTxErrorAtom,
  lastTxHashAtom,
  lastTxStatusAtom,
} from "@/state/transactionState"

interface AccountSectionProps {
  address?: string
  chainId?: constants.StarknetChainId | string
}

const AccountSection: FC<AccountSectionProps> = ({ address, chainId }) => {
  const lastTxHash = useAtomValue(lastTxHashAtom)
  const lastTxStatus = useAtomValue(lastTxStatusAtom)
  const lastTxError = useAtomValue(lastTxErrorAtom)
  return (
    <Section>
      <Box>Account: {address}</Box>
      <Box>Chain: {chainId}</Box>
      <Box
        cursor={lastTxHash ? "pointer" : "default"}
        _hover={{ textDecoration: lastTxHash ? "underline" : "none" }}
        onClick={() => {
          if (!lastTxHash) return
          window.open(`https://sepolia.starkscan.co/tx/${lastTxHash}`, "_blank")
        }}
      >
        Last tx hash: {lastTxHash || "---"}
      </Box>
      <Box>Tx status: {lastTxStatus}</Box>
      <Box color="##ff4848">{lastTxError?.toString()}</Box>
    </Section>
  )
}

export { AccountSection }
