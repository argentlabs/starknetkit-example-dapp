"use client"

import { ConnectButton } from "@/components/ConnectButton"
import { DeploymentData } from "@/components/DeploymentData"
import { SessionKeysExecute } from "@/components/SessionKeysExecute"
import { SessionKeysExecuteOutside } from "@/components/SessionKeysExecuteOutside"
import { SessionKeysSign } from "@/components/SessionKeysSign"
import { SessionKeysTypedDataOutside } from "@/components/SessionKeysTypedDataOutside"
import { provider } from "@/constants"
import { Status } from "@/helpers/status"
import { formatTruncatedAddress } from "@/utils/formatAddress"
import { OffChainSession } from "@argent/x-sessions"
import { useEffect, useState } from "react"
import { GatewayError, Signature, constants } from "starknet"
import { StarknetChainId } from "starknet-types"
import { StarknetWindowObject, disconnect } from "starknetkit-next"

export default function Session() {
  const [connectedWallet, setConnectedWallet] = useState<
    StarknetWindowObject | undefined | null
  >(null)
  const [connectorData, setConnectorData] = useState<
    | {
        account?: string
        chainId?: StarknetChainId
      }
    | undefined
    | null
  >(null)
  const [chainId, setChainId] = useState<constants.StarknetChainId | undefined>(
    undefined,
  )

  const [lastTransactionHash, setLastTransactionHash] = useState("")
  const [transactionStatus, setTransactionStatus] = useState<Status>("idle")
  const [transactionError, setTransactionError] = useState("")
  const [accountSessionSignature, setAccountSessionSignature] = useState<
    string[] | Signature
  >()
  const [sessionRequest, setSessionRequest] = useState<OffChainSession>()

  useEffect(() => {
    const waitTx = async () => {
      if (lastTransactionHash && transactionStatus === "pending") {
        setTransactionError("")
        try {
          await provider.waitForTransaction(lastTransactionHash)
          setTransactionStatus("success")
        } catch (error) {
          setTransactionStatus("failure")
          let message = error ? `${error}` : "No further details"
          if (error instanceof GatewayError) {
            message = JSON.stringify(error.message, null, 2)
          }
          setTransactionError(message)
        }
      }
    }
    waitTx()
  }, [transactionStatus, lastTransactionHash])

  return (
    <main className="flex min-h-screen flex-col p-24 gap-4">
      <div>
        {!connectedWallet && (
          <ConnectButton
            setConnectedWallet={setConnectedWallet}
            setChainId={setChainId}
            setConnectorData={setConnectorData}
          />
        )}
      </div>

      {connectedWallet && connectorData?.account && (
        <>
          <button
            className="bg-white text-black p-2 rounded-lg absolute top-4 right-4"
            onClick={() => {
              disconnect()
              setConnectedWallet(undefined)
            }}
          >
            Disconnect
          </button>
          <div>
            <div>Account: {formatTruncatedAddress(connectorData?.account)}</div>
          </div>
          <div>
            {connectedWallet && <DeploymentData wallet={connectedWallet} />}
          </div>
          <div>
            Chain:{" "}
            {chainId === constants.StarknetChainId.SN_SEPOLIA
              ? "SN_SEPOLIA"
              : "SN_MAIN"}
          </div>
          <div
            className={`${lastTransactionHash ? "cursor-pointer hover:underline" : "default"}`}
            onClick={() => {
              if (!lastTransactionHash) return
              window.open(
                `https://sepolia.starkscan.co/tx/${lastTransactionHash}`,
                "_blank",
              )
            }}
          >
            Last tx hash: {lastTransactionHash || "---"}
          </div>
          <div>Tx status: {transactionStatus}</div>
          <div color="##ff4848">{transactionError.toString()}</div>

          <div className="flex flex-col text-black">
            <SessionKeysSign
              wallet={connectedWallet}
              setTransactionStatus={setTransactionStatus}
              setAccountSessionSignature={setAccountSessionSignature}
              setSessionRequest={setSessionRequest}
            />
          </div>

          <div className="flex flex-col text-black">
            <SessionKeysExecute
              address={connectorData?.account}
              accountSessionSignature={accountSessionSignature}
              sessionRequest={sessionRequest}
              setTransactionStatus={setTransactionStatus}
              setLastTransactionHash={setLastTransactionHash}
              transactionStatus={transactionStatus}
            />
          </div>

          <div className="flex text-black justify-between">
            <div className="flex flex-col text-black ">
              <SessionKeysExecuteOutside
                address={connectorData?.account}
                accountSessionSignature={accountSessionSignature}
                sessionRequest={sessionRequest}
                transactionStatus={transactionStatus}
              />
            </div>
            <div className="flex flex-col text-black ">
              <SessionKeysTypedDataOutside
                address={connectorData?.account}
                accountSessionSignature={accountSessionSignature}
                sessionRequest={sessionRequest}
                transactionStatus={transactionStatus}
              />
            </div>
          </div>
        </>
      )}
    </main>
  )
}
