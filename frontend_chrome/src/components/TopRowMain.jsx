import { useState } from "react";
import { useSelector } from "react-redux";
import Calendar from "./Calendar";
import Settings from "./Settings";
import SettingsModal from "./SettingsModal";
import HowToModal from "./HowToModal";
import HowTo from "./HowTo";
import "../styles/Home.css";

const TopRowMain = ({ isHowToModalOpen, closeHowToModal, openHowToModal }) => {
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

  return (
    <div className="row justify-content-between">
      <div className="col mt-1 d-flex justify-content-start px-0">
        <button
          onClick={() => openHowToModal()}
          className="unclickable-exception-elements"
        >
          <img
            src="/question_mark.png"
            className="unclickable-exception-elements"
          ></img>
        </button>
        {isHowToModalOpen && (
          <HowToModal
            isHowToModalOpen={isHowToModalOpen}
            closeHowToModal={closeHowToModal}
          >
            <HowTo />
          </HowToModal>
        )}
      </div>
      <div id="calendar-column" className="col mt-2">
        <Calendar />
      </div>
      <div className="col mt-1 d-flex justify-content-end px-0">
        <button onClick={() => openSettingsModal()}>
          <img src="/gear-settings.png"></img>
        </button>
        {isSettingsModalOpen && worksnapToken && (
          <SettingsModal
            isSettingsModalOpen={isSettingsModalOpen}
            closeSettingsModal={closeSettingsModal}
          >
            <h5>Settings</h5>
            <Settings closeSettingsModal={closeSettingsModal} />
          </SettingsModal>
        )}
      </div>
    </div>
  );
};

export default TopRowMain;
