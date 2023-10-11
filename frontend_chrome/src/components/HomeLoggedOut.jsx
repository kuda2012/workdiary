import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { setGoogleAccessToken } from "../helpers/actionCreators";

const HomeLoggedOut = () => {
  const dispatch = useDispatch();

  return (
    <div className="container">
      <div className="row flex-column align-items-center">
        <div className="col-md-6">
          <img src="/w_extension.png" />
        </div>
        <div className="col-md-6">
          <button
            onClick={() => {
              chrome.identity.getAuthToken(
                { interactive: true },
                function (token) {
                  dispatch(setGoogleAccessToken(token));
                }
              );
            }}
          >
            Sign in with Google <img src="/Google.png"></img>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeLoggedOut;
