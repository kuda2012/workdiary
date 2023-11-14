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
    <div className="dropdown">
      <div
        className="dropdown-toggle"
        type="button"
        id="userInfoDropdown"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        data-target="#userInfoDropdown"
        aria-haspopup="true"
        aria-expanded="false"
        style={{ textAlign: "center", border: "2px solid black" }}
      >
        <img src="/user_information.png"></img>
        <div> User Information</div>
      </div>
      <div
        className="dropdown-menu"
        aria-labelledby="userInfoDropdown"
        style={{ width: "400px" }}
      >
        {userAccountInfo && (
          <div className="text-center">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccountInfo;
