import React, { useEffect, useState } from "react";
import { Autosave } from "react-autosave";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import CustomToolBar from "./CustomToolbar";
import "react-quill/dist/quill.snow.css";
import "../styles/SummaryTextArea.css";
import { getPostsList } from "../helpers/actionCreators";

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

const SummaryTextArea = ({ dispatchUpdatePost, openTagsModal }) => {
  const summaryText = useSelector((state) => state?.post?.summary_text);
  const lastUpdated = useSelector((state) => state?.post?.last_updated);
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const date = useSelector((state) => state.date);
  const [localSummaryText, setLocalSummaryText] = useState(summaryText);
  const [buttonText, setButtonText] = useState("Save");
  const dispatch = useDispatch();

  const handleChange = (value) => {
    setLocalSummaryText(value);
  };

  useEffect(() => {
    setButtonText("Save");
  }, [date]);

  useEffect(() => {
    setLocalSummaryText(summaryText);
  }, [summaryText]);

  useEffect(() => {
    if (localSummaryText !== summaryText) {
      setButtonText("Save");
    }
  }, [localSummaryText]);

  return (
    <div id="summary-text-container">
      <span id="last-updated" className="p-0 mb-5">
        Edited: {lastUpdated}
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
            localSummaryText &&
            localSummaryText !== summaryText &&
            workdiaryToken
          ) {
            dispatchUpdatePost(data === "<p><br></p>" ? "" : data);
            dispatch(getPostsList(workdiaryToken, 1));
            setButtonText("Saved");
          }
        }}
      />
      <button
        onClick={() => {
          dispatch(getPostsList(workdiaryToken, 1));
          dispatchUpdatePost(
            localSummaryText === "<p><br></p>" ? "" : localSummaryText
          );
          setButtonText("Saved");
        }}
      >
        {buttonText === "Saved" && <b>{buttonText}</b>}
        {buttonText === "Save" && <>{buttonText}</>}
      </button>
    </div>
  );
};

export default SummaryTextArea;
