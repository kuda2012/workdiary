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
            <h5 className="mt-2">Welcome! Click "about" to learn more :)</h5>
          )}

        {isMobile && (window.location.pathname === "/" || !isValidUrl) && (
          <div>
            <a
              href="https://chromewebstore.google.com/detail/workdiary/lbjmgndoajjfcodenfoicgenhjphacmp"
              target="_blank"
            >
              Workdiary
            </a>{" "}
            is only available for desktop as an extension on the Chrome Web
            Store, but you can check out its demo below.
            <iframe
              className="mt-2"
              width="90%" // Adjust width and height as needed
              height="250"
              src={`https://www.youtube.com/embed/inx3tP8Zv4k`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        {window.location.pathname === "/reset-password" && <ResetPassword />}
        {window.location.pathname === "/verify-account" && <VerifyAccount />}
      </div>
    </div>
  );
};

export default Home;
