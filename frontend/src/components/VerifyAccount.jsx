import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/VerifyAccount.css";
const { VITE_LOCAL_BACKEND_URL } = import.meta.env;

const VerifyAccount = ({}) => {
  const [accountVerificationCalled, setAccountVerificationCalled] =
    useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const verificationToken = searchParams.get("token");
  useEffect(() => {
    async function fetchData() {
      try {
        if (!accountVerificationCalled) {
          const { data } = await axios.get(
            `${VITE_LOCAL_BACKEND_URL}/users/verify-account?token=${verificationToken}`
          );
          setAccountVerificationCalled(true);
          if (data.message) {
            setVerificationMessage(data.message);
          }
        }
      } catch (error) {
        alert(error?.response?.data?.message || error?.message);
        // prevents another request to the backend
        setAccountVerificationCalled(true);
        setVerificationMessage(
          error?.response?.data?.message || error?.message
        );
      }
    }
    fetchData();
  }, []);
  return (
    <>
      <h5 className="mt-2" id='verify-account'>{verificationMessage}</h5>
    </>
  );
};

export default VerifyAccount;
