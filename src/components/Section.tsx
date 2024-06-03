import { Flex } from "@chakra-ui/react"
import { FC, PropsWithChildren } from "react"

const Section: FC<PropsWithChildren> = ({ children }) => (
  <Flex
    bg="white"
    flexDir="column"
    gap="2"
    w="full"
    border="solid 1px"
    borderColor="neutrals.300"
    borderRadius="12"
    p="4"
    h="fit-content"
  >
    {children}
  </Flex>
)

export { Section }
