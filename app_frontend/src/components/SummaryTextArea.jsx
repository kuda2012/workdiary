import React, { useEffect, useState } from "react";
import { Autosave } from "react-autosave";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import moment from "moment";
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
  const post = useSelector((state) => state?.post);
  const interpreting = useSelector((state) => state.interpreting);
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const date = useSelector((state) => state.date);
  const [localSummaryText, setLocalSummaryText] = useState(summaryText || "");
  const [buttonText, setButtonText] = useState("Save");
  const dispatch = useDispatch();

  const handleChange = (value) => {
    if (value?.replace(/<[^>]+>/g, "")?.length > 20000) {
      alert(
        "Entry is too long (20000 characters). Any extra characters will not be saved"
      );
      return;
    }
    setLocalSummaryText(
      value !== "<p><br></p>" &&
        value !== "<h1><br></h1>" &&
        value !== "<h2><br></h2>"
        ? value
        : ""
    );
  };

  useEffect(() => {
    setButtonText("Save");
  }, [date]);

  useEffect(() => {
    if (!post) {
      setButtonText("Save");
      setLocalSummaryText(summaryText);
    }
  }, [post]);

  useEffect(() => {
    setLocalSummaryText(summaryText);
  }, [date]);
  useEffect(() => {
    setLocalSummaryText(summaryText);
  }, [interpreting]);

  useEffect(() => {
    if (localSummaryText !== summaryText) {
      setButtonText("Save");
    }
  }, [localSummaryText]);

  useEffect(() => {
    const currentTime = moment();
    const lastUpdatedTime = moment(lastUpdated);
    const differenceInSeconds = currentTime.diff(lastUpdatedTime, "seconds");

    if (differenceInSeconds < 5 && lastUpdated) {
      setButtonText("Saved ✔");
    }
  }, [lastUpdated]);

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
          if (workdiaryToken && localSummaryText !== summaryText) {
            dispatchCreateOrUpdatePost(data);
            setButtonText("Saved ✔");
            dispatch(clearSearchResults());
          }
        }}
      />
      <Autosave
        data={date}
        interval={3000}
        onSave={() => {
          if (workdiaryToken && localSummaryText !== summaryText) {
            dispatchCreateOrUpdatePost(localSummaryText);
            setButtonText("Saved ✔");
            dispatch(clearSearchResults());
          }
        }}
      />
      <button
        onClick={() => {
          if (workdiaryToken && localSummaryText !== summaryText) {
            dispatchCreateOrUpdatePost(localSummaryText);
            setButtonText("Saved ✔");
            dispatch(clearSearchResults());
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
