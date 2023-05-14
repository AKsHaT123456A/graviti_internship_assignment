import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"

function VerticallyCenter({error}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
  
    return (
      <>
        <Button onClick={onOpen}>Trigger modal</Button>
  
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              You chose a location that is not suggested by google
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>error(false)</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }
  export default VerticallyCenter()