import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { forgotPassword } from "../helpers/actionCreators";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const INITIAL_STATE = {
    email: "",
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(forgotPassword(formData));
      setFormData(INITIAL_STATE);
    } catch (error) {
      setFormData(INITIAL_STATE);
      console.log(error);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <form name="forgot-password-form" onSubmit={handleSubmit}>
          <div className="forgot-password-form-items form-group">
            <label htmlFor="email" className="mb-2">
              <h5>Send Reset Link</h5>
            </label>
            <input
              required={true}
              type="text"
              id="email"
              placeholder="Email"
              className="form-control"
              name="email"
              onChange={handleChange}
              value={formData.email}
            />
            <Button color="primary" className="forgot-password-submit mt-4">
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
