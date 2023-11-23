import React, { useState } from "react";
import "../styles/LoginOrSignup.css";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { login, signup } from "../helpers/actionCreators";
const LoginOrSignup = ({ isSignup, setIsForgotPassword }) => {
  const dispatch = useDispatch();
  const INITIAL_STATE = {
    email: "",
    password: "",
    name: "",
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword((password) => !password);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (formData.password !== formData.password_copy) {
    //   alert("Passwords do not match");
    //   return;
    // }
    try {
      dispatch(isSignup ? signup(formData) : login(formData));
      setFormData(INITIAL_STATE);
    } catch (error) {
      setFormData(INITIAL_STATE);
      alert(error[0]);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="signup-form-items form-group">
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
            </div>
            {isSignup && (
              <div className="signup-form-items form-group">
                <input
                  required={true}
                  type="text"
                  placeholder="Full Name"
                  id="name"
                  name="name"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>
            )}

            <div className="signup-form-items form-group">
              <div className="input-password">
                <input
                  autoComplete="new-password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  required={true}
                  id="password"
                  name="password"
                  className="form-control signup-password"
                  onChange={handleChange}
                  value={formData.password}
                />
                <Button
                  type="button"
                  className="password-button"
                  onClick={() => toggleShowPassword()}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </div>
              <Button color="primary" className="signup-submit mt-2">
                {isSignup ? "Sign up" : "Login"}
              </Button>
            </div>
            {!isSignup && (
              <span
                className="forgot-password"
                onClick={() => setIsForgotPassword(true)}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                Forgot your password?
                {/* <b style={{ textDecoration: "underline" }}> CLICK HERE</b> */}
              </span>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginOrSignup;
