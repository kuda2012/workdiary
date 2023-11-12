import React, { useEffect, useState } from "react";
import { Button, ButtonGroup } from "reactstrap";
import { Autosave } from "react-autosave";
import { useDispatch, useSelector } from "react-redux";
import { changeAlarm, setAlarm } from "../helpers/actionCreators";

const Alarm = () => {
  const dispatch = useDispatch();
  const [buttonText, setButtonText] = useState("Save");
  const user = useSelector((state) => state?.user);
  const alarmDays = useSelector((state) => state?.user?.alarm_days);
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const [alarmChanged, setAlarmChanged] = useState(false);

  const handleSwitchToggle = () => {
    setButtonText("Save");
    dispatch(changeAlarm(worksnapToken, { alarm_status: !user.alarm_status }));
  };
  const handlePullsTabReminder = () => {
    setButtonText("Save");
    dispatch(
      changeAlarm(worksnapToken, { auto_pull_tabs: !user.auto_pull_tabs })
    );
  };

  const handleTimeChange = (event) => {
    setButtonText("Save");
    dispatch(changeAlarm(worksnapToken, { alarm_time: event.target.value }));
  };

  useEffect(() => {
    if (user && alarmChanged) {
      setAlarm(user);
      setAlarmChanged(false);
    }
  }, [user, alarmChanged]);

  const handleDayCheckboxChange = (changedDay) => {
    let updatedAlarmDays = alarmDays.map((day) => {
      if (changedDay.day === day.day) {
        return { day: changedDay.day, value: !day.value };
      } else {
        return day;
      }
    });
    dispatch(
      changeAlarm(worksnapToken, {
        alarm_days: updatedAlarmDays,
      })
    );
    setButtonText("Save");
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
              color={user.alarm_status ? "success" : "secondary"}
              onClick={() => handleSwitchToggle(user.alarm_status)}
            >
              On
            </Button>
            <Button
              color={user.alarm_status ? "secondary" : "danger"}
              onClick={() => handleSwitchToggle(user.alarm_status)}
            >
              Off
            </Button>
          </ButtonGroup>
        </div>
        <div className="d-flex mt-4">
          {alarmDays.map((day) => (
            <div key={day.day} className="mx-2">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={day.day}
                  checked={day.value}
                  onChange={() => handleDayCheckboxChange(day)}
                />
                <label className="form-check-label" htmlFor={day.day}>
                  {day.day.toUpperCase()}
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
          value={user.alarm_time}
          onChange={handleTimeChange}
        />
        <div className="d-flex mt-4 align-items-center justify-content-center">
          <div className="mx-2">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="pullTabsReminder"
                checked={user.auto_pull_tabs}
                onChange={() => handlePullsTabReminder(user.auto_pull_tabs)}
              />
              <label className="form-check-label" htmlFor="pullTabsReminder">
                Automatically pull your browser tabs
                <br /> (This will happen regardless of your alarm on/off status)
              </label>
            </div>
          </div>
        </div>
        <Autosave
          data={user}
          interval={2000}
          onSave={(data) => {
            setAlarmChanged(true);
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
