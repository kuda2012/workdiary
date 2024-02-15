import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import { ThreeDots } from "react-loader-spinner";
import {
  loggingIn as loggingInFunction,
  login,
  setIsSignup,
  signup,
} from "../helpers/actionCreators";
import "../styles/LoginOrSignup.css";

const LoginOrSignup = ({ setIsForgotPassword }) => {
  const dispatch = useDispatch();
  const INITIAL_STATE = {
    email: "",
    password: "",
    password_copy: "",
    name: "",
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [showPassword1, setShowPassword1] = useState(false);
  const [loadingDotsActive, setloadingDotsActive] = useState(false);
  const loggingInVar = useSelector((state) => state.logging_in);
  const isSignup = useSelector((state) => state.is_signup);
  const toggleShowPassword1 = () => {
    setShowPassword1((password) => !password);
  };
  useEffect(() => {
    if (!loggingInVar && loadingDotsActive) {
      setloadingDotsActive(false);
    }
  }, [loggingInVar]);

  useEffect(() => {
    setFormData(INITIAL_STATE);
  }, [isSignup]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData?.password?.length < 8 || formData?.password?.length > 25) {
        alert(
          "Password length must be at least 8 characters but not longer than 25"
        );
        return;
      }
      if (!loadingDotsActive && !loggingInVar) {
        setloadingDotsActive(true);
        dispatch(isSignup ? signup(formData) : login(formData));
        !isSignup && dispatch(setIsSignup(false));
        dispatch(loggingInFunction(true));
        setFormData(INITIAL_STATE);
      }
    } catch (error) {
      setloadingDotsActive(false);
      dispatch(loggingInFunction(false));
      setFormData(INITIAL_STATE);
      dispatch(setIsSignup(true));
      console.error(error);
    }
  };
  return (
    <>
      <div className="card">
        <div className="card-body">
          {!loadingDotsActive ? (
            <form name="login-or-signup-form" onSubmit={handleSubmit}>
              <div className="signup-form-items form-group">
                <input
                  required={true}
                  autocomplete={isSignup ? "off" : "on"}
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
                    autocomplete={isSignup ? "off" : "on"}
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
                    autocomplete="off"
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
          ) : (
            <div
              id="three-dots-container"
              className="container d-flex justify-content-center align-items-center"
            >
              <div className="row">
                <div className="col">
                  <ThreeDots
                    height="24px"
                    width="35px"
                    radius="6"
                    color="gray"
                    ariaLabel="loading"
                    wrapperStyle
                    wrapperClass
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginOrSignup;
