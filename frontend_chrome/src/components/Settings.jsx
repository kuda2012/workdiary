import React from "react";
import Alarm from "./Alarm";
import UserAccountInfo from "./UserAccountInfo";

const Settings = () => {
  const componentStyle = {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "50px",
    // Add this property for space between the components
  };

  return (
    <div style={componentStyle}>
      <UserAccountInfo />
      <Alarm />
    </div>
  );
};

export default Settings;
