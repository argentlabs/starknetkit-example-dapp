import { ARGENT_WEBWALLET_URL } from "@/constants"
import { Button } from "@chakra-ui/react"
import { constants } from "starknet"
import { connect } from "starknetkit-next"

const ConnectButtonStarknetkitNext = () => {
  const connectFn = async () => {
    const res = await connect({
      modalMode: "alwaysAsk",
      webWalletUrl: ARGENT_WEBWALLET_URL,
      argentMobileOptions: {
        dappName: "Starknetkit example dapp",
        url: window.location.hostname,
        chainId: constants.NetworkName.SN_SEPOLIA,
        icons: [],
      },
    })

    const { wallet, connectorData } = res
  }

  /* 
  *** perform auto connect on page load ***
  useEffect(() => {
    const autoConnect = async () => {
      const res = await connect({
        modalMode: "neverAsk",
        webWalletUrl: ARGENT_WEBWALLET_URL,
        argentMobileOptions: {
          dappName: "Starknetkit example dapp",
          url: window.location.hostname,
          chainId: constants.NetworkName.SN_SEPOLIA,
          icons: [],
        },
      });

      const { wallet, connectorData } = res;
      setConnectedWallet(wallet);
      setConnectorData(connectorData);
      setChainId(connectorData?.chainId);
    };
    autoConnect();
  }, []); */

  return (
    <Button className="p-2 radius rounded-md" onClick={connectFn}>
      Connect with Starknetkit@next
    </Button>
  )
}

export { ConnectButtonStarknetkitNext }
