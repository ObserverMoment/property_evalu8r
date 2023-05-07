import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
} from "@chakra-ui/react";
import { PrimaryButton, SecondaryButton } from "./styled";
import { ReactNode } from "react";
import { MySpacer } from "./layout";

interface MyModalProps {
  onConfirm: () => void;
  onCancel?: () => void;
  onClose: () => void;
  icon?: ReactNode;
  title: ReactNode;
  message?: ReactNode;
  isOpen: boolean;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

export const MyModal = ({
  onClose,
  isOpen,
  icon,
  title,
  message,
  showCloseButton = true,
  onConfirm,
  onCancel,
  closeOnOverlayClick = false,
}: MyModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closeOnOverlayClick={closeOnOverlayClick}
    >
      <ModalOverlay />
      <ModalContent backgroundColor="#212423" color="#fff">
        <ModalHeader>
          <Flex alignItems="center">
            {icon}
            {icon && <MySpacer width={8} />}
            {title}
          </Flex>
        </ModalHeader>
        {showCloseButton && <ModalCloseButton />}
        <ModalBody>{message && <span>{message}</span>}</ModalBody>

        <ModalFooter>
          {onCancel && (
            <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
          )}
          {onCancel && <MySpacer width={8} />}
          <PrimaryButton onClick={onConfirm}>OK</PrimaryButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
