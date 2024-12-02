import { ARGENT_SESSION_SERVICE_BASE_URL, provider } from "@/constants"
import {
  allowedMethods,
  expiry,
  metaData,
  sessionKey,
} from "@/helpers/openSessionHelper"
import { sessionAccountAtom, sessionAtom } from "@/state/argentSessionState"
import {
  connectorDataAtom,
  walletStarknetkitNextAtom,
} from "@/state/connectedWalletStarknetkitNext"
import { lastTxStatusAtom } from "@/state/transactionState"
import {
  buildSessionAccount,
  createSession,
  CreateSessionParams,
  verifySession,
} from "@argent/x-sessions"
import { Button, Flex, Heading } from "@chakra-ui/react"
import { useAtomValue, useSetAtom } from "jotai"
import { useState } from "react"

const SessionKeysSign = () => {
  const wallet = useAtomValue(walletStarknetkitNextAtom)
  const connectorData = useAtomValue(connectorDataAtom)
  const setSession = useSetAtom(sessionAtom)
  const setSessionAccount = useSetAtom(sessionAccountAtom)
  const setTransactionStatus = useSetAtom(lastTxStatusAtom)
  const [isStarkFeeToken, setIsStarkFeeToken] = useState(false)

  const handleCreateSessionSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      setTransactionStatus("approve")

      if (!connectorData || !connectorData.account) {
        throw new Error("No connector data")
      }

      const sessionParams: CreateSessionParams = {
        allowedMethods,
        expiry,
        metaData: metaData(isStarkFeeToken),
        sessionKey,
      }

      const session = await createSession({
        address: connectorData.account,
        chainId: await provider.getChainId(),
        wallet: wallet as any,
        sessionParams,
      })

      // in this specific example a standard account is fine, since it's passed to erc20Contract
      const sessionAccount = await buildSessionAccount({
        session,
        sessionKey,
        provider: provider as any, // TODO: remove after starknetjs update to 6.9.0
        argentSessionServiceBaseUrl: ARGENT_SESSION_SERVICE_BASE_URL,
      })

      setSession(session)
      setSessionAccount(sessionAccount)

      console.log("verify:", verifySession({ session, sessionKey }))

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
