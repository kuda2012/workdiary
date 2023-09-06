import { useEffect, useState } from "react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

function Oauth() {
  const [code, setCode] = useState();
  const [credential, setCredential] = useState();
  // const login = useGoogleLogin({
  //   onSuccess: (codeResponse) => {
  //     setCode(codeResponse.code);
  //   },
  //   flow: "auth-code",
  // });

  useEffect(() => {
    async function callBackend() {
      if (code || credential) {
        const response = await axios.post("http://localhost:3000/users/login", {
          token: code || credential,
        });
        console.log(response);
      }
    }
    callBackend();
  }, [code, credential]);
  return (
    <>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse.credential);
          setCredential(credentialResponse.credential);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
        flow="auth-code"
        useOneTap
      />
      {/* <button onClick={() => login()}>Sign in with Google 🚀 </button> */}
    </>
  );
}

export default Oauth;
