import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import { ThreeDots } from "react-loader-spinner";
import {
  loggingIn as loggingInFunction,
  setGoogleAccessToken,
} from "../helpers/actionCreators";
import "../styles/LoginOrSignup.css";
const { VITE_GOOGLE_WEB_APP_CLIENT_ID } = import.meta.env;

const GoogleLoginOrSignupButton = () => {
  const dispatch = useDispatch();
  const isSignup = useSelector((state) => state.is_signup);
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
            // const authTokenResult = await chrome.identity.getAuthToken({
            //   interactive: true,
            // });
            // if (authTokenResult.token) {
            //   dispatch(setGoogleAccessToken(authTokenResult.token));
            // }
            const redirectUri = chrome.identity.getRedirectURL();
            const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${VITE_GOOGLE_WEB_APP_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
              redirectUri
            )}&scope=${encodeURIComponent(["email", "profile"].join(" "))}`;
            const responseUrl = await chrome.identity.launchWebAuthFlow({
              url: authUrl,
              interactive: true,
            });
            const params = new URLSearchParams(
              new URL(responseUrl).hash.slice(1)
            );
            const accessToken = params.get("access_token");
            if (accessToken) {
              dispatch(setGoogleAccessToken(accessToken));
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
        <img
          id={isSignup ? "google-signup-img" : "google-login-img"}
          src="/Google.png"
        ></img>
      )}
      <span id={isSignup ? "google-signup-span" : "google-login-span"}>
        {!loginButtonActive ? (
          `${isSignup ? "Get started" : "Login"} with Google `
        ) : (
          <div
            id="three-dots-container"
            className="container d-flex justify-content-center align-items-center"
          >
            <div className="row">
              <div
                className={`col ${
                  isSignup ? "three-dots-signup" : "three-dots-login"
                }`}
              >
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
