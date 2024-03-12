import React, { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup } from "reactstrap";
import { Autosave } from "react-autosave";
import { useDispatch, useSelector } from "react-redux";
import { changeAlarm, setAlarm } from "../helpers/actionCreators";
import isEqual from "lodash/isEqual";
import "../styles/Alarm.css";

function useDeepCompareEffect(callback, dependencies) {
  const dependenciesRef = useRef(null);
  useEffect(() => {
    if (!isEqual(dependenciesRef.current, dependencies)) {
      callback();
    }
    dependenciesRef.current = dependencies;
  }, [dependencies]);
}

const Alarm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user);
  const alarmDays = useSelector((state) => state?.user?.alarm_days);
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const [buttonText, setButtonText] = useState("Save");
  const [selectedTime, setSelectedTime] = useState(user?.alarm_time);
  const [initialRender, setInitialRender] = useState(true);

  const handleSwitchToggle = () => {
    setButtonText("Save");
    dispatch(
      changeAlarm(workdiaryToken, { alarm_status: !user?.alarm_status })
    );
  };

  const handleTimeChange = (event) => {
    setButtonText("Save");
    setSelectedTime(event.target.value);
  };

  useDeepCompareEffect(() => {
    if (initialRender) {
      setInitialRender(false);
      return;
    }
    setAlarm(user);
    setButtonText("Saved ✔");
  }, [user.alarm_days, user.alarm_time, user.alarm_status]);

  const handleDayCheckboxChange = (changedDay) => {
    let atLeastOneDayActive = false;
    let updatedAlarmDays = alarmDays?.map((day) => {
      if (changedDay.day === day.day) {
        if (!day.value && !atLeastOneDayActive) {
          atLeastOneDayActive = true;
        }
        return { day: changedDay.day, value: !day.value };
      } else {
        if (day.value && !atLeastOneDayActive) {
          atLeastOneDayActive = true;
        }
        return day;
      }
    });
    dispatch(
      changeAlarm(workdiaryToken, {
        alarm_days: updatedAlarmDays,
        alarm_status:
          user?.alarm_status && !atLeastOneDayActive
            ? !user?.alarm_status
            : user?.alarm_status,
      })
    );
    setButtonText("Save");
  };

  return (
    <div className="dropdown">
      <button
        className="dropdown-toggle dropdown-toggle-settings-modal-buttons"
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
        <div className="btn-group" role="group" aria-label="Toggle Switch">
          <ButtonGroup>
            <Button
              color={user?.alarm_status ? "success" : "secondary"}
              onClick={() => handleSwitchToggle(user?.alarm_status)}
            >
              On
            </Button>
            <Button
              color={user?.alarm_status ? "secondary" : "danger"}
              onClick={() => handleSwitchToggle(user?.alarm_status)}
            >
              Off
            </Button>
          </ButtonGroup>
        </div>
        <div className="d-flex mt-4">
          {alarmDays?.map((day) => (
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
          value={selectedTime}
          onChange={handleTimeChange}
        />
        <Autosave
          data={selectedTime}
          interval={1500}
          onSave={() => {
            dispatch(changeAlarm(workdiaryToken, { alarm_time: selectedTime }));
          }}
        />

        <button
          className="mt-4"
          id="save-alarm"
          color="secondary"
          onClick={() => {
            setButtonText("Saved ✔");
          }}
        >
          {buttonText === "Saved ✔" && <b>{buttonText}</b>}
          {buttonText === "Save" && <>{buttonText}</>}
        </button>
      </div>
    </div>
  );
};

export default Alarm;
