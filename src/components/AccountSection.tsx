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
import { constants, num } from "starknet"
import { Section } from "./Section"
import { CHAIN_ID } from "@/constants"
import { ChainId } from "@starknet-io/types-js"

interface AccountSectionProps {
  address?: string
  chainId?: bigint | string
}

const AccountSection: FC<AccountSectionProps> = ({ address, chainId }) => {
  const lastTxHash = useAtomValue(lastTxHashAtom)
  const lastTxStatus = useAtomValue(lastTxStatusAtom)
  const lastTxError = useAtomValue(lastTxErrorAtom)
  const starknetkitVersion = useAtomValue(starknetkitVersionAtom)
  const starknetReactVersion = useAtomValue(starknetReactVersionAtom)

  const hexChainId =
    typeof chainId === "bigint" ? num.toHex(chainId ?? 0) : null

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading>{starknetkitVersion}</Heading>
        {starknetReactVersion && <Heading>{starknetReactVersion}</Heading>}
      </Flex>
      <Section>
        <Box>Account: {address}</Box>
        <Box>
          Chain:{" "}
          {!hexChainId
            ? chainId
            : hexChainId === constants.StarknetChainId.SN_SEPOLIA
              ? constants.NetworkName.SN_SEPOLIA
              : constants.NetworkName.SN_MAIN}
        </Box>
        <Box
          cursor={lastTxHash ? "pointer" : "default"}
          _hover={{ textDecoration: lastTxHash ? "underline" : "none" }}
          onClick={() => {
            if (!lastTxHash) return
            window.open(
              CHAIN_ID === constants.NetworkName.SN_MAIN
                ? `https://voyager.online/tx/${lastTxHash}`
                : `https://sepolia.voyager.online/tx/${lastTxHash}`,
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
