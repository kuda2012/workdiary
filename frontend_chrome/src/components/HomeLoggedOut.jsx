import { useDispatch, useSelector } from "react-redux";
import {
  loggingIn,
  resetApp,
  setGoogleAccessToken,
} from "../helpers/actionCreators";
import { Button } from "reactstrap";

const HomeLoggedOut = () => {
  const dispatch = useDispatch();
  const signingIn = useSelector((state) => state.logging_in);
  return (
    <div className="container">
      <div className="row flex-column align-items-center">
        <div className="col-md-6 mb-5 mt-5">
          <img src="work_diary_0.png" />
        </div>
        <div className="col-md-6 mt-5">
          <Button
            color="primary"
            onClick={() => {
              try {
                dispatch(loggingIn());
                chrome.identity.getAuthToken(
                  { interactive: true },
                  function (token) {
                    dispatch(setGoogleAccessToken(token));
                  }
                );
              } catch (error) {
                dispatch(resetApp());
              }
            }}
          >
            {!signingIn ? `Sign in with Google ` : "Authenticating..."}
            {!signingIn && <img src="/Google.png"></img>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeLoggedOut;
