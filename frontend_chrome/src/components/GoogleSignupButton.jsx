import { useDispatch, useSelector } from "react-redux";
import {
  loggingIn,
  resetApp,
  setGoogleAccessToken,
} from "../helpers/actionCreators";
import { Button } from "reactstrap";

const GoogleLoginButton = ({ isSignup }) => {
  const dispatch = useDispatch();
  const signingIn = useSelector((state) => state.logging_in);
  return (
    <Button
      color="primary"
      style={{ width: "300px", position: "relative", right: "40px" }}
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
      {!signingIn && (
        <img
          style={{ position: "relative", right: "50px" }}
          src="/Google.png"
        ></img>
      )}
      <span style={{ position: "relative", right: "12px" }}>
        {!signingIn
          ? `${isSignup ? "Sign up" : "Log-in"} with Google `
          : "Authenticating..."}
      </span>
    </Button>
  );
};

export default GoogleLoginButton;
