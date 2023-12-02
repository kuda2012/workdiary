import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { login, signup } from "../helpers/actionCreators";
import "../styles/LoginOrSignup.css";

const LoginOrSignup = ({ isSignup, setIsForgotPassword }) => {
  const dispatch = useDispatch();
  const INITIAL_STATE = {
    email: "",
    password: "",
    password_copy: "",
    name: "",
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [showPassword1, setShowPassword1] = useState(false);
  // const [showPassword2, setShowPassword2] = useState(false);
  const toggleShowPassword1 = () => {
    setShowPassword1((password) => !password);
  };
  // const toggleShowPassword2 = () => {
  //   setShowPassword2((password) => !password);
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (formData.password !== formData.password_copy && isSignup) {
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
                  type={showPassword1 ? "text" : "password"}
                  required={true}
                  id="password"
                  name="password"
                  className="form-control signup-password"
                  onChange={handleChange}
                  value={formData.password}
                />
                <button
                  type="button"
                  className="password-button"
                  onClick={() => toggleShowPassword1()}
                >
                  {showPassword1 ? "Hide" : "Show"}
                </button>
              </div>
              {/* {isSignup && (
                <div className="input-password mt-2">
                  <input
                    autoComplete="new-password-copy"
                    placeholder="Enter password again"
                    type={showPassword2 ? "text" : "password"}
                    required={true}
                    id="password_copy"
                    name="password_copy"
                    className="form-control signup-password"
                    onChange={handleChange}
                    value={formData.password_copy}
                  />
                  <button
                    type="button"
                    className="password-button"
                    onClick={() => toggleShowPassword2()}
                  >
                    {showPassword2 ? "Hide" : "Show"}
                  </button>
                </div>
              )} */}
              <Button color="primary" className="signup-submit mt-2">
                {isSignup ? "Sign up" : "Login"}
              </Button>
            </div>
            {!isSignup && (
              <span
                className="forgot-password"
                onClick={() => setIsForgotPassword(true)}
              >
                Forgot your password?
              </span>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginOrSignup;
