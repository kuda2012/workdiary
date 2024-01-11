import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import { ThreeDots } from "react-loader-spinner";
import {
  loggingIn as loggingInFunction,
  setGoogleAccessToken,
} from "../helpers/actionCreators";
import "../styles/LoginOrSignup.css";

const GoogleLoginOrSignupButton = ({ isSignup }) => {
  const dispatch = useDispatch();
  const loggingInVar = useSelector((state) => state.logging_in);
  const [loginButtonActive, setloginButtonActive] = useState(false);

  useEffect(() => {
    if (!loggingInVar && loginButtonActive) {
      setloginButtonActive(false);
    }
  }, [loggingInVar]);
  return (
    <Button
      id="google-login-button"
      color="primary"
      onClick={async () => {
        try {
          if (!loginButtonActive && !loggingInVar) {
            setloginButtonActive(true);
            dispatch(loggingInFunction(true));
            const authTokenResult = await chrome.identity.getAuthToken({
              interactive: true,
            });
            if (authTokenResult.token) {
              dispatch(setGoogleAccessToken(authTokenResult.token));
            }
          } else if (loginButtonActive && loggingInVar) {
            setloginButtonActive(false);
            dispatch(loggingInFunction(false));
          }
        } catch (error) {
          setloginButtonActive(false);
          dispatch(loggingInFunction(false));
          console.error(error);
        }
      }}
    >
      {!loginButtonActive && (
        <img id="google-login-img" src="/Google.png"></img>
      )}
      <span id="google-login-span">
        {!loginButtonActive ? (
          `${isSignup ? "Sign up" : "Login"} with Google `
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
                  color="white"
                  ariaLabel="loading"
                  wrapperStyle
                  wrapperClass
                />
              </div>
            </div>
          </div>
        )}
      </span>
    </Button>
  );
};

export default GoogleLoginOrSignupButton;
