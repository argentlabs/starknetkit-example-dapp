import { Box, Button, Flex } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { FC } from "react"

interface DisconnectButtonProps {
  disconnectFn: () => void
  resetFn: () => void
}

const DisconnectButton: FC<DisconnectButtonProps> = ({
  disconnectFn,
  resetFn,
}) => {
  const navigate = useRouter()
  return (
    <Flex justifyContent="flex-end">
      <Box h="min-content">
        <Button
          p="2"
          rounded="lg"
          onClick={() => {
            disconnectFn()
            resetFn()
            navigate.replace("/")
          }}
        >
          Disconnect
        </Button>
      </Box>
    </Flex>
  )
}

export { DisconnectButton }
