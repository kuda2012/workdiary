import { Button, Modal } from "reactstrap";
import { getUserAccountInfo, deleteAccount } from "../helpers/actionCreators";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteAccountModal from "./DeleteAccountModal";

const UserAccountInfo = () => {
  const dispatch = useDispatch();
  const userAccountInfo = useSelector((state) => state.user);
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };
  const handleDelete = () => {
    // Put your delete account logic here
    dispatch(deleteAccount(worksnapToken));
    toggleModal();
  };
  return (
    <div>
      {userAccountInfo && (
        <>
          <h1>User Information</h1>
          <div>
            <strong>Name:</strong> {userAccountInfo.name}
          </div>
          <div>
            <strong>Email:</strong> {userAccountInfo.email}
          </div>
          <Button onClick={toggleModal} color="primary">
            Delete account?
          </Button>
          <DeleteAccountModal
            isOpen={isModalOpen}
            toggleModal={toggleModal}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
};

export default UserAccountInfo;
