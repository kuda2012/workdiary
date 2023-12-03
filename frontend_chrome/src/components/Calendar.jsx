import { useDispatch, useSelector } from "react-redux";
import { getPost } from "../helpers/actionCreators";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/Home.css";

const Calendar = () => {
  const date = useSelector((state) => state.date);
  const allPostDates = useSelector((state) => state?.all_post_dates);
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const dispatch = useDispatch();

  const handleDateInputChange = (event) => {
    const selectedDate = moment(event.target.value, "MM/DD/YYYY", true);
    if (selectedDate.isValid()) {
      dispatch(getPost(workdiaryToken, selectedDate.format("MM/DD/YYYY")));
    }
  };

  return (
    <>
      <DatePicker
        disabledKeyboardNavigation={true}
        selected={date ? moment(date, "MM/DD/YYYY").toDate() : new Date()}
        onChange={(datePickerDate) => {
          dispatch(
            getPost(workdiaryToken, moment(datePickerDate).format("MM/DD/YYYY"))
          );
        }}
        highlightDates={allPostDates?.map((date) =>
          moment(date, "YYYY-MM-DD").toDate()
        )}
        customInput={
          <CustomDatePickerInput onDateChange={handleDateInputChange} />
        }
      />
    </>
  );
};

const CustomDatePickerInput = ({ value, onClick, onDateChange }) => (
  <input
    id="custom-date-picker-input"
    type="text"
    value={value}
    onClick={onClick}
    onChange={onDateChange}
  />
);

export default Calendar;
