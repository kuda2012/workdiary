import React, { useState } from "react";
import "../styles/ChangePassword.css";
import { Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../helpers/actionCreators";

const ChangePassword = ({ closeSettingsModal }) => {
  const INITIAL_STATE = {
    password: "",
    new_password: "",
    new_password_copy: "",
  };
  const dispatch = useDispatch();
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const user = useSelector((state) => state.user);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };
  const [showOriginalPassword, setShowOriginalPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const toggleShowOriginalPassword = () => {
    setShowOriginalPassword((password) => !password);
  };
  const toggleShowPassword1 = () => {
    setShowPassword1((password) => !password);
  };
  const toggleShowPassword2 = () => {
    setShowPassword2((password) => !password);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (formData.new_password === formData.new_password_copy) {
        dispatch(
          changePassword(worksnapToken, { ...formData, email: user.email })
        );
        setTimeout(() => {
          setFormData(INITIAL_STATE);
          closeSettingsModal();
        }, 2000);
      } else {
        alert("Passwords must match");
        // setFormData(INITIAL_STATE);
      }
    } catch (error) {
      setFormData(INITIAL_STATE);
      alert(error?.response?.data?.message);
    }
  };

  return (
    <div className="card mt-3">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="change-password-form-items form-group">
            <label htmlFor="password" className="mb-2">
              <h5>Change Password</h5>
            </label>
            <div className="input-password mt-1">
              <input
                autoComplete="password-copy"
                placeholder="Original Password"
                id="original_password"
                type={showOriginalPassword ? "text" : "password"}
                required={true}
                name="password"
                className="form-control signup-password"
                onChange={handleChange}
                value={formData.password}
              />
              <Button
                type="button"
                className="password-button"
                onClick={() => toggleShowOriginalPassword()}
              >
                {showOriginalPassword ? "Hide" : "Show"}
              </Button>
            </div>
            <div className="input-password mt-1">
              <input
                autoComplete="password-copy"
                placeholder="New Password"
                id="new_password"
                type={showPassword1 ? "text" : "password"}
                required={true}
                name="new_password"
                className="form-control signup-password"
                onChange={handleChange}
                value={formData.new_password}
              />
              <Button
                type="button"
                className="password-button"
                onClick={() => toggleShowPassword1()}
              >
                {showPassword1 ? "Hide" : "Show"}
              </Button>
            </div>
            <div className="input-password">
              <input
                autoComplete="password-copy"
                id="new_password_copy"
                placeholder="Enter again"
                type={showPassword2 ? "text" : "password"}
                required={true}
                name="new_password_copy"
                className="form-control signup-password"
                onChange={handleChange}
                value={formData.new_password_copy}
              />
              <Button
                type="button"
                className="password-button"
                onClick={() => toggleShowPassword2()}
              >
                {showPassword2 ? "Hide" : "Show"}
              </Button>
            </div>
            <Button color="primary" className="change-password-submit mt-4">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
