import Alarm from "./Alarm";
import UserAccountInfo from "./UserAccountInfo";
import OtherSettings from "./OtherSettings";

const Settings = ({ closeSettingsModal }) => {
  return (
    <div id="settings-container">
      <UserAccountInfo closeSettingsModal={closeSettingsModal} />
      <Alarm />
      <OtherSettings />
    </div>
  );
};

export default Settings;
