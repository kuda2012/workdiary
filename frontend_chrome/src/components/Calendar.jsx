import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { setDate } from "../helpers/actionCreators";

const Calendar = () => {
  const date = useSelector((state) => state.date);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!date) {
      dispatch(setDate(new Date()));
    }
  }, [date]);

  return (
    <>
      <DatePicker
        selected={date}
        onChange={(date) => dispatch(setDate(date))}
      />
    </>
  );
};

export default Calendar;
