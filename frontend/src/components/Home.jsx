import ResetPassword from "./ResetPassword";
import HowTo from "./HowTo";
import HowToModal from "./HowToModal";
import { useEffect, useState } from "react";
import VerifyAccount from "./VerifyAccount";

const Home = ({
  isHowToModalOpen,
  openHowToModal,
  closeHowToModal,
  isValidUrl,
}) => {
  const [openToPrivacyPolicy, setOpenToPrivacyPolicy] = useState(false);
  useEffect(() => {
    if (window.location.pathname === "/" && !isHowToModalOpen) {
      openHowToModal();
    }
    if (window.location.pathname === "/privacy-policy" && !isHowToModalOpen) {
      openHowToModal();
      setOpenToPrivacyPolicy(true);
    }
  }, [window.location.pathname]);
  return (
    <div className="container">
      <div className="row justify-content-center">
        {isHowToModalOpen && (
          <HowToModal
            isHowToModalOpen={isHowToModalOpen}
            closeHowToModal={closeHowToModal}
          >
            <HowTo
              closeHowToModal={closeHowToModal}
              openToPrivacyPolicy={openToPrivacyPolicy}
            />
          </HowToModal>
        )}
        {(window.location.pathname === "/" ||
          window.location.pathname === "/privacy-policy" ||
          !isValidUrl) && (
          <h5 className="mt-2">Welcome! Click "about" to learn more :)</h5>
        )}
        {window.location.pathname === "/reset-password" && <ResetPassword />}
        {window.location.pathname === "/verify-account" && <VerifyAccount />}
      </div>
    </div>
  );
};

export default Home;
