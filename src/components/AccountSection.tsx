import {
  lastTxErrorAtom,
  lastTxHashAtom,
  lastTxStatusAtom,
} from "@/state/transactionState"
import {
  starknetReactVersionAtom,
  starknetkitVersionAtom,
} from "@/state/versionState"
import { Box, Flex, Heading } from "@chakra-ui/react"
import { useAtomValue } from "jotai"
import { FC } from "react"
import { constants } from "starknet"
import { Section } from "./Section"

interface AccountSectionProps {
  address?: string
  chainId?: constants.StarknetChainId | string
}

const AccountSection: FC<AccountSectionProps> = ({ address, chainId }) => {
  const lastTxHash = useAtomValue(lastTxHashAtom)
  const lastTxStatus = useAtomValue(lastTxStatusAtom)
  const lastTxError = useAtomValue(lastTxErrorAtom)
  const starknetkitVersion = useAtomValue(starknetkitVersionAtom)
  const starknetReactVersion = useAtomValue(starknetReactVersionAtom)

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading>{starknetkitVersion}</Heading>
        {starknetReactVersion && <Heading>{starknetReactVersion}</Heading>}
      </Flex>
      <Section>
        <Box>Account: {address}</Box>
        <Box>Chain: {chainId}</Box>
        <Box
          cursor={lastTxHash ? "pointer" : "default"}
          _hover={{ textDecoration: lastTxHash ? "underline" : "none" }}
          onClick={() => {
            if (!lastTxHash) return
            window.open(
              `https://sepolia.starkscan.co/tx/${lastTxHash}`,
              "_blank",
            )
          }}
        >
          Last tx hash: {lastTxHash || "---"}
        </Box>
        <Box>Tx status: {lastTxStatus}</Box>
        <Box color="##ff4848">{lastTxError?.toString()}</Box>
      </Section>
    </>
  )
}

export { AccountSection }
