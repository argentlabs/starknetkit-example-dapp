import { provider } from "@/constants"
import {
  lastTxErrorAtom,
  lastTxHashAtom,
  lastTxStatusAtom,
} from "@/state/transactionState"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useEffect } from "react"
import { GatewayError } from "starknet"

const useWaitForTx = () => {
  const lastTxHash = useAtomValue(lastTxHashAtom)
  const [lastTxStatus, setLastTxStatus] = useAtom(lastTxStatusAtom)
  const setLastTxError = useSetAtom(lastTxErrorAtom)

  useEffect(() => {
    const waitTx = async () => {
      if (lastTxHash && lastTxStatus === "pending") {
        setLastTxError("")
        try {
          await provider.waitForTransaction(lastTxHash)
          setLastTxStatus("success")
        } catch (error) {
          setLastTxStatus("failure")
          let message = error ? `${error}` : "No further details"
          if (error instanceof GatewayError) {
            message = JSON.stringify(error.message, null, 2)
          }
          setLastTxError(message)
        }
      }
    }

    if (lastTxHash && lastTxStatus === "pending") {
      waitTx()
    }
  }, [lastTxStatus, lastTxHash])
}

export { useWaitForTx }
