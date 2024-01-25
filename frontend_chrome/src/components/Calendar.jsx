import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Autosave } from "react-autosave";
import { getPost } from "../helpers/actionCreators";
import { ThreeDots } from "react-loader-spinner";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/Home.css";

const Calendar = () => {
  const date = useSelector((state) => state.date);
  const allPostDates = useSelector((state) => state?.all_post_dates);
  const summaryText = useSelector((state) => state?.post?.summary_text);
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const [inputValue, setInputValue] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const datePickerRef = useRef();
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event && event.preventDefault();
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

  const handleToggleCalendar = (status) => {
    if (status) {
      datePickerRef.current.setOpen(true);
      setIsCalendarOpen(true);
    } else {
      datePickerRef.current.setOpen(false);
      setIsCalendarOpen(false);
    }
  };

  useEffect(() => {
    handleToggleCalendar(false);
  }, [date]);

  useEffect(() => {
    handleToggleCalendar(false);
  }, [allPostDates, summaryText]);
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
        <form name="date-picker-form" onSubmit={handleSubmit}>
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
            onCalendarClose={() => {
              setTimeout(() => {
                if (isCalendarOpen) handleToggleCalendar(false);
              }, 150);
            }}
            highlightDates={allPostDates?.map((date) =>
              moment(date, "YYYY-MM-DD").toDate()
            )}
            customInput={
              <CustomDatePickerInput
                value={inputValue}
                onChange={handleInputChange}
                isCalendarOpen={isCalendarOpen}
                handleToggleCalendar={handleToggleCalendar}
                inputRef={inputRef}
              />
            }
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
          <div id="three-dots">
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
        onClick={() => {
          isCalendarOpen
            ? handleToggleCalendar(false)
            : handleToggleCalendar(true);
        }}
      >
        {isCalendarOpen ? "🔼" : "🔽"}
      </span>
      <Autosave
        data={inputValue}
        interval={1500}
        onSave={(data) => {
          if (date !== moment(data, "MM/DD/YYYY").format("MM/DD/YYYY")) {
            handleSubmit();
          }
        }}
      />
    </>
  );
};

const CustomDatePickerInput = ({
  value,
  onChange,
  inputRef,
  isCalendarOpen,
  handleToggleCalendar,
}) => {
  return (
    <input
      id="custom-date-picker-input"
      type="text"
      value={value}
      onClick={() => {
        isCalendarOpen
          ? handleToggleCalendar(false)
          : handleToggleCalendar(true);
      }}
      onChange={onChange}
      ref={inputRef}
    />
  );
};

export default Calendar;
