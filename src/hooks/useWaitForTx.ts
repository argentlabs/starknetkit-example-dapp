import { provider } from "@/constants"
import { useEffect, useState } from "react"
import { GatewayError } from "starknet"

const useWaitForTx = () => {
  const [lastTxHash, setLastTxHash] = useState("")
  const [lastTxStatus, setLastTxStatus] = useState("idle")
  const [lastTxError, setLastTxError] = useState("")

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
    waitTx()
  }, [lastTxStatus, lastTxHash])

  return {
    lastTxHash,
    setLastTxHash,
    lastTxError,
    setLastTxError,
    lastTxStatus,
    setLastTxStatus,
  }
}

export { useWaitForTx }
