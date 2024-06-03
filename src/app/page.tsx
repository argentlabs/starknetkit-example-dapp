"use client"
import { ConnectButtonStarknetkitLatest } from "@/components/connect/ConnectButtonStarknetkitLatest"
import { ConnectButtonStarknetkitNext } from "@/components/connect/ConnectButtonStarknetkitNext"
import { Flex, SimpleGrid, GridItem } from "@chakra-ui/react"

export default function Home() {
  return (
    <Flex as="main" p="10" gap="4" flexWrap="wrap" w="100dvw" h="100dvh">
      <SimpleGrid columnGap="16" rowGap="16" columns={2} w="100%">
        <GridItem
          display="flex"
          w="100%"
          h="100%"
          border="solid 1px black"
          borderRadius="8px"
          alignItems="center"
          justifyContent="center"
          bgColor="white"
          boxShadow="0px 12px 30px 0px #0000001A"
        >
          <ConnectButtonStarknetkitLatest />
        </GridItem>
        <GridItem
          display="flex"
          w="100%"
          h="100%"
          border="solid 1px black"
          borderRadius="8px"
          alignItems="center"
          justifyContent="center"
          bgColor="white"
          boxShadow="0px 12px 30px 0px #0000001A"
        >
          <ConnectButtonStarknetkitNext />
        </GridItem>
        <GridItem
          display="flex"
          w="100%"
          h="100%"
          border="solid 1px black"
          borderRadius="8px"
          alignItems="center"
          justifyContent="center"
          bgColor="white"
          boxShadow="0px 12px 30px 0px #0000001A"
        >
          Starknetkit@next + starknet-react
        </GridItem>
        <GridItem
          display="flex"
          w="100%"
          h="100%"
          border="solid 1px black"
          borderRadius="8px"
          alignItems="center"
          justifyContent="center"
          bgColor="white"
          boxShadow="0px 12px 30px 0px #0000001A"
        >
          Starknetkit@latest + starknet-react
        </GridItem>
      </SimpleGrid>
    </Flex>
  )
}
