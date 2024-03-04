import { useEffect, useState } from "react";
import GoogleLoginOrSignupButton from "./GoogleLoginOrSignupButton";
import LoginOrSignup from "./LoginOrSignup";
import ForgotPassword from "./ForgotPassword";
import { useDispatch, useSelector } from "react-redux";
import { setIsSignup } from "../helpers/actionCreators";
import "../styles/Auth.css";

const Auth = () => {
  const dispatch = useDispatch();
  const isSignup = useSelector((state) => state.is_signup);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await chrome.storage.local.get("repeat_user");
        if (result.repeat_user) {
          dispatch(setIsSignup(false));
        }
      } catch (error) {
        console.error("Error fetching data from chrome storage:", error);
        // Handle error if needed
      }
    };
    fetchData();
  }, []);

  useEffect(() => {}, [isSignup]);
  return (
    <div className="container">
      <div className="row flex-column align-items-center">
        <div className="col-6 mb-5 mt-5">
          <img id="login-logo" src="Workdiary_logo.png" />
        </div>
        {!isForgotPassword && (
          <>
            <div className="col-6 mt-3">
              <GoogleLoginOrSignupButton />
            </div>
            <div className="col mt-5 mb-4">
              <h5 className="text-center">Or</h5>
            </div>
            <div className="col">
              <LoginOrSignup
                isForgotPassword={isForgotPassword}
                setIsForgotPassword={setIsForgotPassword}
              />
            </div>
            <div className="col mt-3 text-center">
              <span
                id="span-auth-toggler"
                onClick={() => {
                  dispatch(setIsSignup(!isSignup));
                }}
              >
                {isSignup
                  ? `Already have an account? `
                  : "Don't have an account? "}
                <b id="bold-auth-toggler">{isSignup ? "LOGIN" : "SIGN UP"}</b>
              </span>
            </div>
          </>
        )}
        {isForgotPassword && (
          <>
            <div className="col">
              <ForgotPassword
                isForgotPassword={isForgotPassword}
                setIsForgotPassword={setIsForgotPassword}
              />
            </div>
            <div className="col mt-3 text-center forgot-password">
              <span
                id="span-auth-toggler"
                onClick={() => setIsForgotPassword(false)}
              >
                <b id="bold-auth-toggler"> Back to login</b>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
