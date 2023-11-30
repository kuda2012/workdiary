import { useState } from "react";
import GoogleSignupButton from "./GoogleSignupButton";
import LoginLogo from "./LoginLogo";
import LoginOrSignup from "./LoginOrSignup";
import ForgotPassword from "./ForgotPassword";

const Auth = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  return (
    <div className="container">
      <div className="row flex-column align-items-center">
        <div className="col-6 mb-5 mt-5">
          <LoginLogo />
        </div>
        {!isForgotPassword && (
          <>
            <div className="col-6 mt-3">
              <GoogleSignupButton isSignup={isSignup} />
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
                style={{ cursor: "pointer" }}
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup
                  ? `Already have an account? `
                  : "Don't have an account? "}
                <b style={{ textDecoration: "underline" }}>
                  {isSignup ? "LOG IN" : "SIGN UP"}
                </b>
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
            </div>{" "}
            <div className="col mt-3 text-center forgot-password">
              <span
                style={{ cursor: "pointer" }}
                onClick={() => setIsForgotPassword(false)}
              >
                <b style={{ textDecoration: "underline" }}> Back to login</b>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
