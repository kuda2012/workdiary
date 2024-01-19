import React, { useEffect, useState } from "react";
import moment from "moment";
import { Autosave } from "react-autosave";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import CustomToolBar from "./CustomToolbar";
import "react-quill/dist/quill.snow.css";
import "../styles/SummaryTextArea.css";
import { clearSearchResults } from "../helpers/actionCreators";

const modules = {
  toolbar: {
    container: "#toolbar",
  },
};
const formats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "align",
  "header",
  "font",
  "color",
  "list",
  "bullet",
  "ordered",
  "list[unchecked]",
  "list[checked]",
  "indent",
  "blockquote",
  "link",
  "image",
  "background",
  "direction",
];

function countWords(htmlString) {
  // Remove HTML tags and normalize spaces from the string
  if (!htmlString) return 0;
  const cleanText = htmlString
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Split the text into words and count them
  const words = cleanText.split(/\s+/);
  return words.length;
}
const SummaryTextArea = ({ dispatchCreateOrUpdatePost, openTagsModal }) => {
  const summaryText = useSelector((state) => state?.post?.summary_text || "");
  const lastUpdated = useSelector((state) => state?.post?.last_updated);
  const interpreting = useSelector((state) => state.interpreting);
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const date = useSelector((state) => state.date);
  const [hasSavedOnce, setHasSavedOnce] = useState(false);
  const [earlyTyping, setEarlyTyping] = useState(false);
  const [localSummaryText, setLocalSummaryText] = useState(summaryText || "");
  const [buttonText, setButtonText] = useState("Save");
  const dispatch = useDispatch();

  const handleChange = (value) => {
    if (value?.replace(/<[^>]+>/g, "")?.length > 20000) {
      alert(
        "Entry is too long (20000 characters). Any extra characters will not be saved"
      );
    } else {
      if (!hasSavedOnce) {
        setEarlyTyping(true);
      }
      setLocalSummaryText(value !== "<p><br></p>" ? value : "");
    }
  };

  useEffect(() => {
    setButtonText("Save");
  }, [date]);

  useEffect(() => {
    setLocalSummaryText(summaryText);
    setHasSavedOnce(false);
    setEarlyTyping(false);
  }, [date]);
  useEffect(() => {
    setLocalSummaryText(summaryText);
  }, [interpreting]);

  useEffect(() => {
    if (localSummaryText !== summaryText) {
      setButtonText("Save");
    }
  }, [localSummaryText]);

  const now = moment();
  return (
    <div id="summary-text-container">
      <span id="last-updated" className="p-0 mb-5">
        {now.isSame(lastUpdated, "day")
          ? lastUpdated &&
            `Last updated: Today at ${moment(lastUpdated).format("h:mm A")} | `
          : lastUpdated &&
            `Last updated: ${moment(lastUpdated).format("MM/DD/YY")} | `}
        Word count: {countWords(localSummaryText)}
      </span>
      <CustomToolBar openTagsModal={openTagsModal} />
      <ReactQuill
        value={localSummaryText}
        preserveWhitespace
        onChange={handleChange}
        modules={modules}
        formats={formats}
      />
      <Autosave
        data={localSummaryText}
        interval={1500}
        onSave={(data) => {
          if (
            workdiaryToken &&
            localSummaryText !== summaryText &&
            hasSavedOnce
          ) {
            dispatchCreateOrUpdatePost(data);
            setButtonText("Saved ✔");
            dispatch(clearSearchResults());
          }
        }}
      />
      <Autosave
        data={earlyTyping}
        interval={500}
        onSave={(data) => {
          if (workdiaryToken && !hasSavedOnce) {
            if (earlyTyping) {
              dispatchCreateOrUpdatePost(localSummaryText);
              // setButtonText("Saved ✔");
              dispatch(clearSearchResults());
            }
            if (!hasSavedOnce) {
              setHasSavedOnce(true);
              setEarlyTyping(false);
            }
          }
        }}
      />
      <button
        onClick={() => {
          if (workdiaryToken && localSummaryText !== summaryText) {
            dispatchCreateOrUpdatePost(localSummaryText);
            setButtonText("Saved ✔");
            dispatch(clearSearchResults());
            if (!hasSavedOnce) {
              setHasSavedOnce(true);
              setEarlyTyping(false);
            }
          }
        }}
      >
        {buttonText === "Saved ✔" && <b>{buttonText}</b>}
        {buttonText === "Save" && <>{buttonText}</>}
      </button>
    </div>
  );
};

export default SummaryTextArea;
