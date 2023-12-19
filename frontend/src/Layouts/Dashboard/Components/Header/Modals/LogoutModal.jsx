import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  VStack,
} from "@chakra-ui/react";
import React from "react";

const LogoutModal = ({ isOpen, onClose }) => {
  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedIn");

    onClose();
    window.location.reload();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(1px)" />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Are You Sure You Want to Logout?</ModalHeader>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onLogout}>
            Logout
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LogoutModal;
