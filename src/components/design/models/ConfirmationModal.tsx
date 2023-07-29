import { FC } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  onYes: () => void;
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  message,
  onYes,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="transparent" backdropFilter="blur(2px)" />
      <ModalContent>
        <ModalHeader color={"blackAlpha.800"}>Confirmation</ModalHeader>
        <ModalCloseButton />
        <ModalBody color={"black"}>{message}</ModalBody>
        <ModalFooter>
          <Button
            variant={"outline"}
            colorScheme="green"
            mr={3}
            onClick={onYes}
          >
            Yes
          </Button>
          <Button variant={"outline"} onClick={onClose} colorScheme="blue">
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
