import { useDispatch, useSelector } from "react-redux";
import { getPost } from "../helpers/actionCreators";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

const Calendar = () => {
  const date = useSelector((state) => state.date);
  const allPostDates = useSelector((state) => state?.all_post_dates);
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
        disabledKeyboardNavigation={true}
        selected={date ? moment(date, "MM/DD/YYYY").toDate() : new Date()}
        onChange={(datePickerDate) => {
          dispatch(
            getPost(worksnapToken, moment(datePickerDate).format("MM/DD/YYYY"))
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
