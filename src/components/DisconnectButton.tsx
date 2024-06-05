import {
  accountSessionSignatureAtom,
  sessionAccountAtom,
  sessionRequestAtom,
} from "@/state/argentSessionState"
import {
  lastTxErrorAtom,
  lastTxHashAtom,
  lastTxStatusAtom,
} from "@/state/transactionState"
import {
  starknetReactVersionAtom,
  starknetkitVersionAtom,
} from "@/state/versionState"
import { Box, Button, Flex } from "@chakra-ui/react"
import { useSetAtom } from "jotai"
import { RESET } from "jotai/utils"
import { useRouter } from "next/navigation"
import { FC } from "react"

interface DisconnectButtonProps {
  disconnectFn: () => void
  resetFn?: () => void
}

const DisconnectButton: FC<DisconnectButtonProps> = ({
  disconnectFn,
  resetFn,
}) => {
  const navigate = useRouter()
  const setLastTxHash = useSetAtom(lastTxHashAtom)
  const setLastTxStatus = useSetAtom(lastTxStatusAtom)
  const setLastTxError = useSetAtom(lastTxErrorAtom)
  const setAccountSessionSignature = useSetAtom(accountSessionSignatureAtom)
  const setSessionRequest = useSetAtom(sessionRequestAtom)
  const setSessionAccount = useSetAtom(sessionAccountAtom)
  const setStarknetkitVersion = useSetAtom(starknetkitVersionAtom)
  const setStarknetReactVersion = useSetAtom(starknetReactVersionAtom)

  return (
    <Flex justifyContent="flex-end">
      <Box h="min-content">
        <Button
          p="2"
          rounded="lg"
          onClick={() => {
            disconnectFn()
            resetFn?.()
            setLastTxHash(RESET)
            setLastTxStatus(RESET)
            setLastTxError(RESET)
            setSessionAccount(RESET)
            setSessionRequest(RESET)
            setAccountSessionSignature(RESET)
            setStarknetkitVersion(RESET)
            setStarknetReactVersion(RESET)
            navigate.push("/")
          }}
        >
          Disconnect
        </Button>
      </Box>
    </Flex>
  )
}

export { DisconnectButton }
