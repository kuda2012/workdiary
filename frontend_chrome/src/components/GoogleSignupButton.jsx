import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import {
  loggingIn,
  resetApp,
  setGoogleAccessToken,
} from "../helpers/actionCreators";
import "../styles/LoginOrSignup.css";

const GoogleLoginButton = ({ isSignup }) => {
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
        {!signingIn
          ? `${isSignup ? "Sign up" : "Login"} with Google `
          : "Authenticating..."}
      </span>
    </Button>
  );
};

export default GoogleLoginButton;
