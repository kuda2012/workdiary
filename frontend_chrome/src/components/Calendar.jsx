import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { getPost } from "../helpers/actionCreators";

const Calendar = () => {
  const date = useSelector((state) => state.date);
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const dispatch = useDispatch();
  return (
    <>
      <DatePicker
        selected={date ? moment(date, "MM/DD/YYYY").toDate() : new Date()}
        onChange={(datePickerDate) => {
          dispatch(
            getPost(worksnapToken, moment(datePickerDate).format("MM/DD/YYYY"))
          );
        }}
      />
    </>
  );
};

export default Calendar;
