import { Heading, SimpleGrid } from "@chakra-ui/react"
import { WalletRpcMessage } from "./WalletRpcMessage"
import { constants } from "starknet"
import { RpcMessage } from "@/types/RpcMessage"
import { StarknetWindowObject } from "starknetkit-next"

export function WalletRpcMsgContainer({
  wallet,
}: {
  wallet: StarknetWindowObject
}) {
  return (
    <>
      <Heading as="h2">Wallet RPC</Heading>
      <SimpleGrid
        columns={{
          base: 1,
          md: 3,
        }}
        spacing="20px"
        paddingBottom="20px"
      >
        <WalletRpcMessage
          message={RpcMessage.wallet_requestAccounts}
          param=""
          wallet={wallet}
        />
        <WalletRpcMessage
          message={RpcMessage.wallet_requestChainId}
          param=""
          wallet={wallet}
        />
        <WalletRpcMessage
          message={RpcMessage.wallet_watchAsset}
          param={
            "0x62376175ba2ddc307b30813312d8f09796f777b8c24dd327a5cdd65c3539fba"
          }
          symbol={"snjs6"}
          wallet={wallet}
        />
        <WalletRpcMessage
          message={RpcMessage.wallet_switchStarknetChain}
          param={constants.StarknetChainId.SN_MAIN}
          wallet={wallet}
        />
        <WalletRpcMessage
          message={RpcMessage.wallet_addStarknetChain}
          param="ZORG"
          wallet={wallet}
        />

        <WalletRpcMessage
          message={RpcMessage.wallet_addInvokeTransaction}
          param="10"
          wallet={wallet}
        />
        <WalletRpcMessage
          message={RpcMessage.wallet_addDeclareTransaction}
          param="Object"
          tip="Declare only once the same contract. Change contract in DAPP code each time."
          wallet={wallet}
        />
        {/*  <WalletRpcMessage
          message={RpcMessage.wallet_addDeployAccountTransaction}
          param="Object"
          wallet={wallet}
        /> */}
        <WalletRpcMessage
          message={RpcMessage.wallet_signTypedData}
          param="Object"
          wallet={wallet}
        />
        <WalletRpcMessage
          message={RpcMessage.wallet_supportedSpecs}
          param=""
          wallet={wallet}
        />
        <WalletRpcMessage
          message={RpcMessage.wallet_getPermissions}
          param=""
          wallet={wallet}
        />
        <WalletRpcMessage
          message={RpcMessage.wallet_deploymentData}
          param=""
          wallet={wallet}
        />
      </SimpleGrid>
    </>
  )
}
