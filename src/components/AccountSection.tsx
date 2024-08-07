import {
  lastTxErrorAtom,
  lastTxHashAtom,
  lastTxStatusAtom,
} from "@/state/transactionState"
import {
  starknetReactVersionAtom,
  starknetkitVersionAtom,
} from "@/state/versionState"
import { Box, Flex, Heading, useToast } from "@chakra-ui/react"
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
  const toast = useToast()

  const hexChainId =
    typeof chainId === "bigint" ? num.toHex(chainId ?? 0) : null

  return (
    <>
      <Flex flexDirection="column" gap="2">
        <Heading size="sm">{starknetkitVersion}</Heading>
        {starknetReactVersion && (
          <Heading size="sm">{starknetReactVersion}</Heading>
        )}
      </Flex>
      <Section>
        <Box
          cursor={address ? "pointer" : "default"}
          onClick={() => {
            if (address) {
              navigator.clipboard.writeText(address || "")
              toast({
                title: "Address copied",
                duration: 1000,
                containerStyle: { minWidth: "50px" },
                status: "success",
              })
            }
          }}
        >
          Account: {address}
        </Box>
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
