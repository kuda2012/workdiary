import { useState } from "react";
import { Input } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteAccount } from "../helpers/actionCreators";
import ChangePassword from "./ChangePassword";

const UserAccountInfo = ({ closeSettingsModal }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const allPostDates = useSelector((state) => state?.all_post_dates);
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const [isModalOpen, setModalOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };
  const handleDelete = (e) => {
    // Put your delete account logic here
    e.preventDefault();
    if (confirmation === "delete account") {
      dispatch(deleteAccount(worksnapToken));
      setTimeout(() => {
        window.location.reload();
      }, [2000]);
    } else {
      alert(`Must spell "delete account" correctly`);
    }
  };

  return (
    <div className="dropdown">
      <button
        className="dropdown-toggle"
        id="userInfoDropdown"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        data-target="#userInfoDropdown"
        aria-haspopup="true"
        aria-expanded="false"
        style={{
          textAlign: "center",
          // border: ".2px solid black",
          borderRadius: "15px",
        }}
      >
        <img src="/user_information.png"></img>
        <div> User Information</div>
      </button>
      <div
        className="dropdown-menu"
        aria-labelledby="userInfoDropdown"
        style={{ width: "400px" }}
      >
        {user && (
          <div class="accordion" id="accordionExample">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button
                  class="accordion-button"
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
                class="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                  <div>
                    <strong>Name:</strong> {user.name}
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
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingTwo">
                  <button
                    class="accordion-button collapsed"
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
                  class="accordion-collapse collapse"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#accordionExample"
                >
                  <div class="accordion-body">
                    <ChangePassword closeSettingsModal={closeSettingsModal} />
                  </div>
                </div>
              </div>
            )}
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingThree">
                <button
                  class="accordion-button collapsed"
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
                class="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                  <form onSubmit={handleDelete}>
                    <p>
                      We are sorry to see you go. Deleting this account will
                      only delete your Work Diary account, not your Google
                      account.
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
                            className="btn btn-danger"
                            onClick={handleDelete}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={closeSettingsModal}
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
