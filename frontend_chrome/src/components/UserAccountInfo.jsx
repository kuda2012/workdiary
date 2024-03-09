import { useState } from "react";
import { Input } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteAccount, isDeleting } from "../helpers/actionCreators";
import ChangePassword from "./ChangePassword";
import "../styles/UserAccountInfo.css";

const UserAccountInfo = ({ closeAccountStuffModal }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const allPostDates = useSelector((state) => state?.all_post_dates);
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const [confirmation, setConfirmation] = useState("");

  const handleDelete = (e) => {
    e.preventDefault();
    if (confirmation === "delete account") {
      dispatch(isDeleting(true));
      dispatch(deleteAccount(workdiaryToken));
      chrome.identity.clearAllCachedAuthTokens(function () {});
    } else {
      alert(`Must spell "delete account" correctly`);
    }
  };

  return (
    <div className="dropdown">
      <button
        className="dropdown-toggle dropdown-toggle-settings-modal-buttons"
        id="user-info-dropdown-button"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        data-target="#user-info-dropdown-button"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <img src="/user_information.png"></img>
        <div> User Information</div>
      </button>
      <div
        id="user-info-dropdown-menu"
        className="dropdown-menu"
        aria-labelledby="user-info-dropdown-button"
      >
        {user && (
          <div className="accordion" id="accordionExample">
            <div className="accordion-item" id="accordion-top-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  User Info
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <div>
                    <strong>Display name:</strong> {user.name}
                  </div>
                  <div>
                    <strong>Email:</strong> {user.email}
                  </div>
                  <div>
                    <strong>Number of posts:</strong> {allPostDates?.length}
                  </div>
                  <div>
                    <strong>Login type:</strong> {user.auth_provider}
                  </div>
                </div>
              </div>
            </div>
            {user?.auth_provider !== "google" && (
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    Change Password
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <ChangePassword
                      closeAccountStuffModal={closeAccountStuffModal}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingThree">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  Delete account?
                </button>
              </h2>
              <div
                id="collapseThree"
                className="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <form name="delete-account-form" onSubmit={handleDelete}>
                    <p className="text-center">
                      We are sorry to see you go. If this is the truly the end,
                      we hope to see you again in the future.
                    </p>
                    <Input
                      type="text"
                      placeholder="Type 'delete account' to confirm"
                      value={confirmation}
                      onChange={(e) => setConfirmation(e.target.value)}
                    />
                    <div className="container">
                      <div className="row">
                        <div className="col-12 d-flex justify-content-between px-0 mt-2">
                          <button
                            className="btn btn-success"
                            onClick={handleDelete}
                          >
                            Confirm
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={closeAccountStuffModal}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccountInfo;
