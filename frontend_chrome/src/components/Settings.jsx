import Alarm from "./Alarm";
import UserAccountInfo from "./UserAccountInfo";
import OtherSettings from "./OtherSettings";

const Settings = ({ closeSettingsModal }) => {
  return (
    <div id="settings-container container">
      <div className="row">
        <div className="col-4">
          <UserAccountInfo closeSettingsModal={closeSettingsModal} />
        </div>
        <div className="col-4">
          <Alarm />
        </div>
        <div className="col-4">
          <OtherSettings />
        </div>
      </div>
    </div>
  );
};

export default Settings;
