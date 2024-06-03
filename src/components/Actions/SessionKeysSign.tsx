import { provider } from "@/constants"
import {
  allowedMethods,
  dappKey,
  expiry,
  metaData,
} from "@/helpers/openSessionHelper"
import {
  accountSessionSignatureAtom,
  sessionRequestAtom,
} from "@/state/argentSessionState"
import { walletStarknetkitNextAtom } from "@/state/connectedWalletStarknetkitNext"
import { lastTxStatusAtom } from "@/state/transactionState"
import {
  SessionParams,
  createSessionRequest,
  openSession,
} from "@argent/x-sessions"
import { Button, Flex, Heading } from "@chakra-ui/react"
import { useAtomValue, useSetAtom } from "jotai"
import { useState } from "react"

const SessionKeysSign = () => {
  const wallet = useAtomValue(walletStarknetkitNextAtom)
  const setAccountSessionSignature = useSetAtom(accountSessionSignatureAtom)
  const setSessionRequest = useSetAtom(sessionRequestAtom)
  const setTransactionStatus = useSetAtom(lastTxStatusAtom)
  const [isStarkFeeToken, setIsStarkFeeToken] = useState(false)

  const handleCreateSessionSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      setTransactionStatus("approve")

      const sessionParams: SessionParams = {
        allowedMethods,
        expiry,
        metaData: metaData(isStarkFeeToken),
        publicDappKey: dappKey.publicKey,
      }

      const accountSessionSignature = await openSession({
        chainId: await provider.getChainId(),
        wallet: wallet as any,
        sessionParams,
      })

      const sessionRequest = createSessionRequest(
        allowedMethods,
        expiry,
        metaData(isStarkFeeToken),
        dappKey.publicKey,
      )

      setSessionRequest(sessionRequest)
      setAccountSessionSignature(accountSessionSignature)

      setTransactionStatus("success")
    } catch (e) {
      console.error(e)
      setTransactionStatus("idle")
    }
  }

  return (
    <Flex
      as="form"
      flexDirection="column"
      p="4"
      gap="3"
      onSubmit={handleCreateSessionSubmit}
      w="fit-content"
    >
      <Heading as="h2">Create session keys</Heading>

      {/* 
      TODO: enable in future release
      
      <Flex alignItems="center" gap="1">
        Use STRK fee token
        <input
          type="checkbox"
          onChange={() => {
            setIsStarkFeeToken((prev) => !prev)
          }}
        />
      </Flex> */}

      <Button colorScheme="primary" p="2" rounded="lg" type="submit">
        Authorize session
      </Button>
    </Flex>
  )
}

export { SessionKeysSign }
