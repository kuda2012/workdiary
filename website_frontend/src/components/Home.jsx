import { useEffect, useState } from "react";
import ResetPassword from "./ResetPassword";
import HowTo from "./HowTo";
import HowToModal from "./HowToModal";
import VerifyAccount from "./VerifyAccount";
import SendDownloadLink from "./SendDownloadLink";
import "../styles/Home.css";

const Home = ({
  isHowToModalOpen,
  openHowToModal,
  closeHowToModal,
  isValidUrl,
}) => {
  const [openToPrivacyPolicy, setOpenToPrivacyPolicy] = useState(false);
  const isMobile = window.innerWidth <= 768;
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
        {isHowToModalOpen && !isMobile && (
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

        {!isMobile &&
          (window.location.pathname === "/" ||
            window.location.pathname === "/privacy-policy" ||
            !isValidUrl) && (
            <h4 id="welcome-header" className="mt-2">
              Welcome! Click the icon to learn more.
            </h4>
          )}

        {isMobile && (window.location.pathname === "/" || !isValidUrl) && (
          <div>
            <div className="mt-2 mb-2">
              <a
                href="https://chromewebstore.google.com/detail/workdiary/lbjmgndoajjfcodenfoicgenhjphacmp"
                target="_blank"
              >
                Workdiary
              </a>{" "}
              is only available for desktop, but enter your email and we'll send
              you a link so you can use it next time you're at your computer.
            </div>
            <SendDownloadLink />
          </div>
        )}
        {window.location.pathname === "/reset-password" && <ResetPassword />}
        {window.location.pathname === "/verify-account" && <VerifyAccount />}
      </div>
    </div>
  );
};

export default Home;
