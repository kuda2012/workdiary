import { useState } from "react";
import { useSelector } from "react-redux";
import Calendar from "./Calendar";
import AccountStuff from "./AccountStuff";
import AccountStuffModal from "./AccountStuffModal";
import HowToModal from "./HowToModal";
import HowTo from "./HowTo";
import "../styles/Home.css";

const TopRowMain = ({ isHowToModalOpen, closeHowToModal, openHowToModal }) => {
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const [isAccountStuffModalOpen, setIsAccountStuffModalOpen] = useState(false);
  const openAccountStuffModal = () => setIsAccountStuffModalOpen(true);
  const closeAccountStuffModal = () => setIsAccountStuffModalOpen(false);

  return (
    <div className="row justify-content-between">
      <div className="col mt-1 d-flex justify-content-start px-0">
        <button
          onClick={() => openHowToModal()}
          className="top-row-buttons unclickable-exception-elements"
        >
          <img src="/info.png" className="unclickable-exception-elements"></img>
        </button>
        {isHowToModalOpen && (
          <HowToModal
            isHowToModalOpen={isHowToModalOpen}
            closeHowToModal={closeHowToModal}
          >
            <HowTo closeHowToModal={closeHowToModal} />
          </HowToModal>
        )}
      </div>
      <div
        id="calendar-column"
        className="col mt-2 d-flex justify-content-center"
      >
        <Calendar />
      </div>
      <div className="col mt-1 d-flex justify-content-end px-0">
        <button
          className="top-row-buttons"
          onClick={() => openAccountStuffModal()}
        >
          <img src="/user_information.png"></img>
        </button>
        {isAccountStuffModalOpen && workdiaryToken && (
          <AccountStuffModal
            isAccountStuffModalOpen={isAccountStuffModalOpen}
            closeAccountStuffModal={closeAccountStuffModal}
          >
            <h5>Your Account</h5>
            <AccountStuff closeAccountStuffModal={closeAccountStuffModal} />
          </AccountStuffModal>
        )}
      </div>
    </div>
  );
};

export default TopRowMain;
