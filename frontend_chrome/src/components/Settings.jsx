import React from "react";
import Alarm from "./Alarm";
import UserAccountInfo from "./UserAccountInfo";

const Settings = ({ closeSettingsModal }) => {
  return (
    <div id="settings-container">
      <UserAccountInfo closeSettingsModal={closeSettingsModal} />
      <Alarm />
    </div>
  );
};

export default Settings;
