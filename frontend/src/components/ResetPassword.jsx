import { useState } from "react";
import { Button } from "reactstrap";
import { useLocation } from "react-router-dom";
const { VITE_BACKEND_URL } = import.meta.env;
import axios from "axios";
import "../styles/ResetPassword.css";

const ResetPassword = ({}) => {
  const INITIAL_STATE = {
    new_password: "",
    new_password_copy: "",
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };
  const [resetDone, setResetDone] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const toggleShowPassword1 = () => {
    setShowPassword1((password) => !password);
  };
  const toggleShowPassword2 = () => {
    setShowPassword2((password) => !password);
  };
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const resetToken = searchParams.get("token");
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (
        formData?.new_password?.length < 8 ||
        formData?.new_password?.length > 25
      ) {
        alert(
          "Password length must be at least 8 characters but not longer than 25"
        );
        return;
      } else if (formData.new_password === formData.new_password_copy) {
        const response = await axios.patch(
          `${VITE_BACKEND_URL}/users/reset-password`,
          {
            new_password: formData.new_password,
            new_password_copy: formData.new_password_copy,
          },
          { headers: { Authorization: `Bearer ${resetToken}` } }
        );
        alert(response?.data?.message);
        setResetDone(true);
        setFormData(INITIAL_STATE);
      } else {
        alert("Passwords must match");
      }
    } catch (error) {
      setFormData(INITIAL_STATE);
      alert(error?.response?.data?.message || error?.message);
    }
  };

  return (
    <>
      {!resetDone ? (
        <div id="reset-password-card" className="card mt-3">
          <div className="card-body">
            <form name="reset-password-form" onSubmit={handleSubmit}>
              <div className="reset-password-form-items form-group">
                <label htmlFor="password" className="mb-2">
                  <h5>Reset Password</h5>
                </label>
                <div className="input-password">
                  <input
                    autoComplete="off"
                    placeholder="New Password"
                    id="new_password"
                    type={showPassword1 ? "text" : "password"}
                    required={true}
                    name="new_password"
                    className="form-control signup-password mb-2"
                    onChange={handleChange}
                    value={formData.new_password}
                  />
                  <button
                    type="button"
                    className="password-button mb-2"
                    onClick={() => toggleShowPassword1()}
                  >
                    {showPassword1 ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="input-password">
                  <input
                    autoComplete="off"
                    id="new_password_copy"
                    placeholder="Enter new password again"
                    type={showPassword2 ? "text" : "password"}
                    required={true}
                    name="new_password_copy"
                    className="form-control signup-password"
                    onChange={handleChange}
                    value={formData.new_password_copy}
                  />
                  <button
                    type="button"
                    className="password-button"
                    onClick={() => toggleShowPassword2()}
                  >
                    {showPassword2 ? "Hide" : "Show"}
                  </button>
                </div>
                <Button color="primary" className="reset-password-submit mt-4">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <h5 className="mt-2">
          Your password has been reset. You can return to the app now :)
        </h5>
      )}
    </>
  );
};

export default ResetPassword;
