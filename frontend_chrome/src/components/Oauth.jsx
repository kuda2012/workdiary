import { useEffect, useState } from "react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

function Oauth() {
  const [code, setCode] = useState();
  const [googleAccessToken, setGoogleAccessToken] = useState();
  // const login = useGoogleLogin({
  //   onSuccess: (codeResponse) => {
  //     setCode(codeResponse.code);
  //   },
  //   flow: "auth-code",
  // });

  useEffect(() => {
    async function callBackend() {
      if (googleAccessToken) {
        const response = await axios.post("http://localhost:3000/users/login", {
          google_access_token: googleAccessToken,
        });
        console.log(response);
        return response;
      }
    }
    callBackend();
  }, [code, googleAccessToken]);
  return (
    <>
      <GoogleLogin
        onSuccess={(response) => {
          setGoogleAccessToken(response.credential);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
        flow="auth-code"
        useOneTap
      />
      {/* <button onClick={() => login()}>Sign in with Google 🚀 </button> */}
      <button
        onClick={() => {
          console.log("hello");
          chrome.identity.getAuthToken({ interactive: true }, function (token) {
            setGoogleAccessToken(token);
          });
        }}
      >
        {" "}
        Identity button{" "}
      </button>
    </>
  );
}

export default Oauth;
