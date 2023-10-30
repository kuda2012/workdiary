import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/SummaryTextArea.css";
import { Autosave } from "react-autosave";
import CustomToolBar from "./CustomToolbar";
import { useSelector } from "react-redux";

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
  const [localSummaryText, setLocalSummaryText] = useState(summaryText || "");
  const [buttonText, setButtonText] = useState("Save");

  const handleChange = (value) => {
    setLocalSummaryText(value);
    setButtonText("Save");
  };

  useEffect(() => {
    setLocalSummaryText(summaryText);
  }, [summaryText]);

  return (
    <div id="summaryTextContainer">
      <CustomToolBar openTagsModal={openTagsModal} />
      <ReactQuill
        value={localSummaryText}
        onChange={handleChange}
        modules={modules}
        formats={formats}
      />

      <Autosave
        data={localSummaryText}
        interval={1500}
        onSave={(data) => {
          if (localSummaryText !== summaryText) {
            dispatchUpdatePost(data);
            setButtonText("Saved");
          }
        }}
      />
      <button
        onClick={() => {
          dispatchUpdatePost(localSummaryText);
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
