import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { getPost } from "../helpers/actionCreators";

const Calendar = () => {
  const date = useSelector((state) => state.date);
  const post = useSelector((state) => state.post);

  const worksnapToken = useSelector((state) => state.worksnap_token);
  const dispatch = useDispatch();

  const handleDateInputChange = (event) => {
    const selectedDate = moment(event.target.value, "MM/DD/YYYY", true);
    if (selectedDate.isValid()) {
      dispatch(getPost(worksnapToken, selectedDate.format("MM/DD/YYYY")));
    }
  };

  return (
    <>
      <DatePicker
        selected={date ? moment(date, "MM/DD/YYYY").toDate() : new Date()}
        onChange={(datePickerDate) => {
          dispatch(
            getPost(worksnapToken, moment(datePickerDate).format("MM/DD/YYYY"))
          );
        }}
        customInput={
          <CustomDatePickerInput onDateChange={handleDateInputChange} />
        }
      />
    </>
  );
};

const CustomDatePickerInput = ({ value, onClick, onDateChange }) => (
  <input
    type="text"
    value={value}
    onClick={onClick}
    onChange={onDateChange}
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      width: "100%",
    }}
  />
);

export default Calendar;
