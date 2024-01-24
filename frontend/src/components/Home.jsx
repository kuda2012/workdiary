import ResetPassword from "./ResetPassword";
import HowTo from "./HowTo";
import HowToModal from "./HowToModal";
import { useEffect } from "react";

const Home = ({ isHowToModalOpen, openHowToModal, closeHowToModal }) => {
  useEffect(() => {
    if (window.location.pathname === "/" && !isHowToModalOpen) {
      openHowToModal();
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
            <HowTo closeHowToModal={closeHowToModal} />
          </HowToModal>
        )}
        {window.location.pathname === "/" && (
          <h5 className="mt-2">Welcome! Click "about" to learn more :)</h5>
        )}
        {window.location.pathname === "/reset-password" && <ResetPassword />}
      </div>
    </div>
  );
};

export default Home;
