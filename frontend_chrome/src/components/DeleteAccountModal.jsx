import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";

const DeleteAccountModal = ({ isOpen, toggleModal, onDelete }) => {
  const [confirmation, setConfirmation] = useState("");

  const handleDelete = () => {
    if (confirmation === "delete account") {
      // Call the onDelete function to proceed with account deletion
      onDelete();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Delete Account</ModalHeader>
      <ModalBody>
        <p>
          We are sorry to see you go. Deleting this account will only delete
          your Worksnap account, not your Google account.
        </p>
        <Input
          type="text"
          placeholder="Type 'delete account' to confirm"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={handleDelete}>
          Delete
        </Button>
        <Button color="secondary" onClick={toggleModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteAccountModal;
