import React, { useState } from "react";
import axios from "axios";
import "../styles/resetPassword.css";
import { Button } from "reactstrap";
import { useLocation } from "react-router-dom";

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
      if (formData.new_password === formData.new_password_copy) {
        const response = await axios.patch(
          "http://localhost:3000/users/reset-password",
          {
            new_password: formData.new_password,
            new_password_copy: formData.new_password_copy,
          },
          { headers: { Authorization: `Bearer ${resetToken}` } }
        );
        alert(response?.data?.message);
      } else {
        alert("Passwords must match");
        setFormData(INITIAL_STATE);
      }
    } catch (error) {
      setFormData(INITIAL_STATE);
      alert(error?.response?.data?.message);
    }
  };

  return (
    <div className="card mt-3" style={{ width: "600px" }}>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="reset-password-form-items form-group">
            <label htmlFor="password" className="mb-2">
              <h5>Reset Password</h5>
            </label>
            <div className="input-password">
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
                placeholder="Enter new password again"
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
            <Button color="primary" className="reset-password-submit mt-4">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
