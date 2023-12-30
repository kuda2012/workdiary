import { useState } from "react";
import GoogleLoginOrSignupButton from "./GoogleLoginOrSignupButton";
import LoginOrSignup from "./LoginOrSignup";
import ForgotPassword from "./ForgotPassword";
import "../styles/Auth.css";

const Auth = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  return (
    <div className="container">
      <div className="row flex-column align-items-center">
        <div className="col-6 mb-5 mt-5">
          <img id="login-logo" src="work_diary_0.png" />
        </div>
        {!isForgotPassword && (
          <>
            <div className="col-6 mt-3">
              <GoogleLoginOrSignupButton isSignup={isSignup} />
            </div>
            <div className="col mt-5 mb-4">
              <h5 className="text-center">Or</h5>
            </div>
            <div className="col">
              <LoginOrSignup
                isSignup={isSignup}
                isForgotPassword={isForgotPassword}
                setIsForgotPassword={setIsForgotPassword}
              />
            </div>
            <div className="col mt-3 text-center">
              <span
                id="span-auth-toggler"
                onClick={() => setIsSignup(!isSignup)}
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
