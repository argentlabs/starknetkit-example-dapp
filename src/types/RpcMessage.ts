export enum RpcMessage {
  wallet_requestAccounts = "wallet_requestAccounts",
  wallet_watchAsset = "wallet_watchAsset",
  wallet_addStarknetChain = "wallet_addStarknetChain",
  wallet_switchStarknetChain = "wallet_switchStarknetChain",
  wallet_addInvokeTransaction = "wallet_addInvokeTransaction",
  wallet_addDeclareTransaction = "wallet_addDeclareTransaction",
  wallet_addDeployAccountTransaction = "wallet_addDeployAccountTransaction",
  wallet_signTypedData = "wallet_signTypedData",
  wallet_supportedSpecs = "wallet_supportedSpecs",
  wallet_requestChainId = "wallet_requestChainId",
  wallet_getPermissions = "wallet_getPermissions",
  wallet_deploymentData = "wallet_deploymentData",
}
