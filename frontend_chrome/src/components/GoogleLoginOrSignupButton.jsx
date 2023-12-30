import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import { ThreeDots } from "react-loader-spinner";
import {
  loggingIn,
  resetApp,
  setGoogleAccessToken,
} from "../helpers/actionCreators";
import "../styles/LoginOrSignup.css";

const GoogleLoginOrSignupButton = ({ isSignup }) => {
  const dispatch = useDispatch();
  const signingIn = useSelector((state) => state.logging_in);
  return (
    <Button
      id="google-login-button"
      color="primary"
      onClick={() => {
        try {
          dispatch(loggingIn());
          chrome.identity.getAuthToken({ interactive: true }, function (token) {
            dispatch(setGoogleAccessToken(token));
          });
        } catch (error) {
          dispatch(resetApp());
        }
      }}
    >
      {!signingIn && <img id="google-login-img" src="/Google.png"></img>}
      <span id="google-login-span">
        {!signingIn ? (
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
