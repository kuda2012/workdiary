import Alarm from "./Alarm";
import UserAccountInfo from "./UserAccountInfo";
import OtherSettings from "./OtherSettings";

const AccountStuff = ({ closeAccountStuffModal }) => {
  return (
    <div id="container">
      <div className="row">
        <div className="col-4">
          <UserAccountInfo closeAccountStuffModal={closeAccountStuffModal} />
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

export default AccountStuff;
