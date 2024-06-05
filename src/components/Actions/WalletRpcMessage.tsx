import { useRpcMessageHandler } from "@/services/rpcHandler"
import { RpcMessage } from "@/types/RpcMessage"
import {
  Box,
  Button,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Tooltip,
  Flex,
} from "@chakra-ui/react"
import React, { useState } from "react"
import { StarknetWindowObject } from "starknetkit-next"

type Props = {
  message: RpcMessage
  symbol?: string
  param: string
  tip?: string
  wallet: StarknetWindowObject
}

export function WalletRpcMessage({
  message,
  symbol,
  param,
  tip,
  wallet,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [response, setResponse] = useState<string>("N/A")

  const onSuccess = (txt: string) => {
    setResponse(txt)
    onOpen()
  }

  const handleRpcMessage = useRpcMessageHandler(wallet, onSuccess)

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
            onClick={() => {
              handleRpcMessage(message, param)
            }}
          >
            {message} {symbol}
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
              Message : {message} <br />
              Param : {param} <br />
              Response : {response}
            </ModalBody>

            <ModalFooter>
              {/* <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button> */}
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
