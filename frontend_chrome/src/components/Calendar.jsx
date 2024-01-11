import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPost } from "../helpers/actionCreators";
import { ThreeDots } from "react-loader-spinner";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/Home.css";

const Calendar = () => {
  const date = useSelector((state) => state.date);
  const allPostDates = useSelector((state) => state?.all_post_dates);
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const selectedDate = moment(inputValue, "MM/DD/YYYY", true);
    if (selectedDate.isValid()) {
      handleToggleCalendar(false);
      setInputValue("loading");
      dispatch(getPost(workdiaryToken, selectedDate.format("MM/DD/YYYY")));
      setTimeout(() => {
        setInputValue(selectedDate.format("MM/DD/YYYY"));
        inputRef.current.blur();
      }, 500);
    }
  };
  const handleInputChange = (value) => {
    setInputValue(value);
  };
  const datePickerRef = useRef();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleToggleCalendar = (status) => {
    if (status) {
      datePickerRef.current.setOpen(true);
      setIsCalendarOpen(true);
    } else {
      datePickerRef.current.setOpen(false);
      setIsCalendarOpen(false);
    }
  };

  return (
    <>
      <span
        id="reset-calendar"
        className="ms-0 me-1 mt-0 mb-0 p-0"
        onClick={() => {
          if (date !== moment(new Date()).format("MM/DD/YYYY")) {
            dispatch(
              getPost(workdiaryToken, moment(new Date()).format("MM/DD/YYYY"))
            );
          }
        }}
      >
        🔄
      </span>
      <div className="d-flex flex-column align-items-center">
        <form onSubmit={handleSubmit}>
          <DatePicker
            ref={datePickerRef}
            disabledKeyboardNavigation={true}
            selected={
              inputValue !== "loading"
                ? date
                  ? moment(date, "MM/DD/YYYY").toDate()
                  : new Date()
                : null
            }
            onChange={handleInputChange}
            highlightDates={allPostDates?.map((date) =>
              moment(date, "YYYY-MM-DD").toDate()
            )}
            customInput={
              <CustomDatePickerInput
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => handleToggleCalendar(true)}
                onBlur={() => handleToggleCalendar(false)}
                inputRef={inputRef}
              />
            }
            onFocus={() => handleToggleCalendar(true)}
            onBlur={() => handleToggleCalendar(false)}
            onSelect={(datePickerDate) => {
              dispatch(
                getPost(
                  workdiaryToken,
                  moment(datePickerDate).format("MM/DD/YYYY")
                )
              );
              handleToggleCalendar(false);
            }}
          />
        </form>
        {inputValue === "loading" && (
          <div style={{ position: "relative", right: "8px" }}>
            <ThreeDots
              height="10px"
              width="15px"
              radius="6"
              color="gray"
              ariaLabel="loading"
              wrapperStyle
              wrapperClass
            />
          </div>
        )}
      </div>
      <span
        id="calendar-arrow"
        className="ms-1 me-0 mt-0 mb-0 p-0"
        onClick={() => handleToggleCalendar(!isCalendarOpen)}
      >
        {isCalendarOpen ? "🔼" : "🔽"}
      </span>
    </>
  );
};

const CustomDatePickerInput = ({
  value,
  onChange,
  onFocus,
  onBlur,
  inputRef,
}) => {
  return (
    <input
      id="custom-date-picker-input"
      type="text"
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      ref={inputRef}
    />
  );
};

export default Calendar;
