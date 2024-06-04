import { availableConnectors } from "@/helpers/connectorsLatest"
import { Button, Flex, Heading, Image } from "@chakra-ui/react"
import { useConnect } from "@starknet-react/core"
import React, { useEffect, useState } from "react"
import { useStarknetkitConnectModal } from "starknetkit-latest"
import { isInArgentMobileAppBrowser } from "starknetkit-latest/argentMobile"

const ConnectStarknetReact = () => {
  const { connectAsync, connectors } = useConnect()
  const [isClient, setIsClient] = useState(false)

  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: availableConnectors,
  })

  // https://nextjs.org/docs/messages/react-hydration-error#solution-1-using-useeffect-to-run-on-the-client-only
  // starknet react had an issue with the `available` method
  // need to check their code, probably is executed only on client causing an hydration issue

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <></>
  }

  const inAppBrowserFilter = (c: any) => {
    if (isInArgentMobileAppBrowser()) {
      return c.id === "argentX"
    }
    return c
  }

  return (
    <Flex direction="column" gap="3" p="5">
      <Flex direction="column" gap="3">
        {connectors.filter(inAppBrowserFilter).map((connector: any) => {
          if (!connector.available()) {
            return <React.Fragment key={connector.id} />
          }
          const icon = connector.icon.dark ?? ""
          const isSvg = icon?.startsWith("<svg")

          return (
            <Button
              as="button"
              colorScheme="neutrals"
              key={connector.id}
              onClick={async () => {
                await connectAsync({ connector })
              }}
              alignItems="center"
              justifyContent="flex-start"
              cursor="pointer"
              maxW="350px"
              gap="2"
              py="2"
              px="4"
            >
              {isSvg ? (
                <div dangerouslySetInnerHTML={{ __html: icon }} />
              ) : (
                <Image
                  alt={connector.name}
                  src={icon}
                  height="32px"
                  width="32px"
                />
              )}
              {connector.name}
            </Button>
          )
        })}
      </Flex>

      <Heading as="h2" mt="8">
        Starknetkit modal + starknet-react
      </Heading>
      <Button
        colorScheme="neutrals"
        onClick={async () => {
          const { connector } = await starknetkitConnectModal()
          if (!connector) return // or throw error
          await connectAsync({ connector: connector as any })
        }}
        alignItems="center"
        justifyContent="flex-start"
        cursor="pointer"
        maxW="350px"
        gap="2"
        py="2"
        px="4"
        mt="2"
      >
        Starknetkit modal with starknet-react
      </Button>
    </Flex>
  )
}

export { ConnectStarknetReact }
