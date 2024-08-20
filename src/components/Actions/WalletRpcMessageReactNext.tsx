import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react"
import { RpcMessage } from "@starknet-io/types-js"
import { useState } from "react"
import { useWalletRequest } from "starknet-react-core-next"

type Props = {
  type: RpcMessage["type"]
  symbol?: string
  params?: RpcMessage["params"]
  tip?: string
}

export function WalletRpcMessageReactNext({
  type,
  symbol,
  params,
  tip,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [response, setResponse] = useState<string>("N/A")

  const walletRequest = useWalletRequest({
    type,
    params,
  })

  return (
    <>
      <Flex
        color="black"
        borderWidth="0px"
        borderRadius="lg"
        justifyContent="flex-start"
        w="full"
      >
        <Tooltip hasArrow label={tip} bg="yellow.100" color="black">
          <Button
            bg="primary.500"
            w="full"
            onClick={async () => {
              const r = (await walletRequest.requestAsync()) as typeof type
              setResponse(r)
              onOpen()
            }}
          >
            {type} {symbol}
          </Button>
        </Tooltip>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />

          <ModalContent>
            <ModalHeader fontSize="lg" fontWeight="bold">
              Message sent to Wallet.
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Message : {type} <br />
              Param : {params ? JSON.stringify(params) : "N/A"} <br />
              Response : {response}
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="red" onClick={onClose} ml={3}>
                OK
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  )
}
