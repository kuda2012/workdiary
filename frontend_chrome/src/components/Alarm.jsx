import React, { useState } from "react";
import { Button, ButtonGroup } from "reactstrap";
import { Autosave } from "react-autosave";

const Alarm = () => {
  const [buttonText, setButtonText] = useState("Save");
  const [isOn, setIsOn] = useState(false);
  const [pullsTabsReminder, setPullsTabsReminder] = useState(false);
  const [alarmTime, setAlarmTime] = useState("17:00");
  const [daysOfWeek, setDaysOfWeek] = useState({
    sun: false,
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: false,
  });

  const handleSwitchToggle = () => {
    setIsOn(!isOn);
  };
  const handlePullsTabReminder = () => {
    setPullsTabsReminder(!pullsTabsReminder);
  };

  const handleTimeChange = (event) => {
    setAlarmTime(event.target.value);
  };

  const handleDayCheckboxChange = (day) => {
    setDaysOfWeek({
      ...daysOfWeek,
      [day]: !daysOfWeek[day],
    });
  };

  return (
    <div className="dropdown">
      {/* <button
        className="btn btn-danger dropdown-toggle"
        type="button"
        id="alarmDropdown"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        data-target="#alarmDropdown" // Include data-target
        aria-haspopup="true"
        aria-expanded="false"
      >
        Set Daily Reminder
      </button> */}
      <div
        className="dropdown-toggle"
        type="button"
        id="alarmDropdown"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        data-target="#alarmDropdown" // Include data-target
        aria-haspopup="true"
        aria-expanded="false"
        style={{ textAlign: "center", border: "2px solid black" }}
      >
        <img src="/alarm.jpg"></img>
        <div>Set Reminder</div>
      </div>

      <div
        className="dropdown-menu text-center flex-column align-items-center"
        aria-labelledby="alarmDropdown"
      >
        <div class="btn-group" role="group" aria-label="Toggle Switch">
          <ButtonGroup>
            <Button
              color={isOn ? "success" : "secondary"}
              onClick={handleSwitchToggle}
            >
              On
            </Button>
            <Button
              color={isOn ? "secondary" : "danger"}
              onClick={handleSwitchToggle}
            >
              Off
            </Button>
          </ButtonGroup>
        </div>
        <div className="d-flex mt-4">
          {Object.keys(daysOfWeek).map((day) => (
            <div key={day} className="mx-2">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={day}
                  checked={daysOfWeek[day]}
                  onChange={() => handleDayCheckboxChange(day)}
                />
                <label className="form-check-label" htmlFor={day}>
                  {day.toUpperCase()}
                </label>
              </div>
            </div>
          ))}
        </div>
        <input
          type="time"
          className="form-control mt-3"
          style={{
            margin: "auto", // Center the input element vertically
            width: "200px",
          }}
          id="timePicker"
          value={alarmTime}
          onChange={handleTimeChange}
        />
        <div className="d-flex mt-4 align-items-center justify-content-center">
          <div className="mx-2">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="pullTabsReminder"
                checked={pullsTabsReminder}
                onChange={() => handlePullsTabReminder()}
              />
              <label className="form-check-label" htmlFor="pullTabsReminder">
                Automatically pull your browser tabs
              </label>
            </div>
          </div>
        </div>
        <Autosave
          data={isOn}
          interval={1500}
          onSave={(data) => {
            setButtonText("Saved");
          }}
        />
        <button
          onClick={() => {
            setButtonText("Saved");
          }}
        >
          {buttonText === "Saved" && <b>{buttonText}</b>}
          {buttonText === "Save" && <>{buttonText}</>}
        </button>
      </div>
    </div>
  );
};

export default Alarm;
