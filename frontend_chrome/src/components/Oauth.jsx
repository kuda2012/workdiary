import { useEffect, useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

function Oauth() {
  const [googleAccessToken, setGoogleAccessToken] = useState();

  useEffect(() => {
    async function callBackend() {
      if (googleAccessToken) {
        const response = await axios.post("http://localhost:3000/users/login", {
          google_access_token: googleAccessToken,
        });
        return response;
      }
    }
    callBackend();
  }, [googleAccessToken]);
  return (
    <>
      <button
        onClick={() => {
          chrome.identity.getAuthToken({ interactive: true }, function (token) {
            setGoogleAccessToken(token);
          });
        }}
      >
        {" "}
        Identity button{" "}
      </button>
      <button
        onClick={() => {
          chrome.identity.removeCachedAuthToken(
            { token: googleAccessToken },
            function (response) {}
          );
        }}
      >
        Reset token
      </button>
    </>
  );
}

export default Oauth;
