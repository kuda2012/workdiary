import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { getPost } from "../helpers/actionCreators";

const Calendar = ({ setFormerDate }) => {
  const date = useSelector((state) => state.date);
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const dispatch = useDispatch();
  return (
    <>
      <DatePicker
        selected={date ? moment(date, "MM/DD/YYYY").toDate() : new Date()}
        onChange={(date) => {
          dispatch(getPost(worksnapToken, moment(date).format("MM/DD/YYYY")));
          setFormerDate(moment(date).format("MM/DD/YYYY"));
        }}
      />
    </>
  );
};

export default Calendar;
