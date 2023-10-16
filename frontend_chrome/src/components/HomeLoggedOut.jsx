import { useDispatch, useSelector } from "react-redux";
import { loggingIn, setGoogleAccessToken } from "../helpers/actionCreators";

const HomeLoggedOut = () => {
  const dispatch = useDispatch();
  const signingIn = useSelector((state) => state.logging_in);
  return (
    <div className="container">
      <div className="row flex-column align-items-center">
        <div className="col-md-6">
          <img src="/w_extension.png" />
        </div>
        <div className="col-md-6">
          <button
            onClick={() => {
              dispatch(loggingIn());
              chrome.identity.getAuthToken(
                { interactive: true },
                function (token) {
                  dispatch(setGoogleAccessToken(token));
                }
              );
            }}
          >
            {!signingIn ? `Sign in with Google ` : "Authenticating..."}
            {!signingIn && <img src="/Google.png"></img>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeLoggedOut;
