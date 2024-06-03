import { Box } from "@chakra-ui/react"
import { Section } from "./Section"
import { FC } from "react"
import { constants } from "starknet"
import { Status } from "@/helpers/status"

interface AccountSectionProps {
  address?: string
  chainId?: constants.StarknetChainId | string
  lastTxHash?: string
  lastTxStatus?: Status
  lastTxError?: string
}

const AccountSection: FC<AccountSectionProps> = ({
  address,
  chainId,
  lastTxHash,
  lastTxError,
  lastTxStatus,
}) => (
  <Section>
    <Box>Account: {address}</Box>
    <Box>Chain: {chainId}</Box>
    <Box
      className={`${lastTxHash ? "cursor-pointer hover:underline" : "default"}`}
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

export { AccountSection }
