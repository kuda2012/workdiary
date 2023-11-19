import React from "react";
import Alarm from "./Alarm";
import UserAccountInfo from "./UserAccountInfo";

const HowTo = () => {
  return (
    <div className="container">
      {/* <div className="row">
        <h5>How to use the app: Example</h5>
        <div className="col-12">
          *notification alarm pings at the end of your work day (5pm)* You open
          the app. Take a voice note of how your day went and have it turned
          into text. Or you just type out how your day went. Note text: "Today
          was a good day, I finished all of my assigned tickets. There was no
          meetings so I worked interrupted." You add a tag to your note so
          todays note can be associated with other days when you use the search
          functionality For example: A tag called "crypto-project" Pull your
          tabs down for today so you can have what tabs were associated with
          today's work
        </div>
      </div> */}
      <div className="row">
        <div className="col text-center">
          <h5>How to use the app</h5>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <ol>
            <li>
              Record a voice note of your work day went (or just type it out)
            </li>
            <li>
              Click the *insert color* button to have your voice turned into
              text
            </li>
            <li>Add a tag to your note </li>
            <li>
              Pull your tabs for today and X out the ones you don't want to keep
            </li>
            <li>
              Set your alarm so you can remember to come back tomorrow (it's
              already pre-set for 5pm)
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default HowTo;
