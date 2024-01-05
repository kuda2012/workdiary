import React, { useEffect, useState } from "react";
import { Button, ButtonGroup } from "reactstrap";
import { Autosave } from "react-autosave";
import { useDispatch, useSelector } from "react-redux";
import { changeAlarm, setAlarm } from "../helpers/actionCreators";
import "../styles/Alarm.css";

const Alarm = () => {
  const dispatch = useDispatch();
  const [buttonText, setButtonText] = useState("Save");
  const user = useSelector((state) => state?.user);
  const alarmDays = useSelector((state) => state?.user?.alarm_days);
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const [alarmChanged, setAlarmChanged] = useState(false);

  const handleSwitchToggle = () => {
    setButtonText("Save");
    dispatch(changeAlarm(workdiaryToken, { alarm_status: !user.alarm_status }));
  };

  const handleTimeChange = (event) => {
    setButtonText("Save");
    dispatch(changeAlarm(workdiaryToken, { alarm_time: event.target.value }));
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
      changeAlarm(workdiaryToken, {
        alarm_days: updatedAlarmDays,
      })
    );
    setButtonText("Save");
  };

  return (
    <div className="dropdown">
      <button
        className="dropdown-toggle"
        id="alarm-dropdown"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        data-target="#alarm-dropdown" // Include data-target
        aria-haspopup="true"
        aria-expanded="false"
      >
        <div>
          <img src="/alarm.png" />
          <div>Set Reminder</div>
        </div>
      </button>

      <div
        className="dropdown-menu text-center flex-column align-items-center"
        aria-labelledby="alarm-dropdown"
      >
        <div className="my-2">Set this for the end of your work day!</div>
        <div class="btn-group" role="group" aria-label="Toggle Switch">
          <ButtonGroup>
            <Button
              // className={`btn btn-${user.alarm_status ? success : secondary}`}
              color={user.alarm_status ? "success" : "secondary"}
              onClick={() => handleSwitchToggle(user.alarm_status)}
            >
              On
            </Button>
            <Button
              // className={`btn btn-${user.alarm_status ? secondary : danger}`}
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
          id="time-picker"
          value={user.alarm_time}
          onChange={handleTimeChange}
        />
        <Autosave
          data={user}
          interval={2000}
          onSave={() => {
            setAlarmChanged(true);
            setButtonText("Saved");
          }}
        />
        <button
          className="mt-4"
          id="save-alarm"
          color="secondary"
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
