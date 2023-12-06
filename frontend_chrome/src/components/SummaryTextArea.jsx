import React, { useEffect, useState } from "react";
import { Autosave } from "react-autosave";
import { useSelector } from "react-redux";
import ReactQuill from "react-quill";
import CustomToolBar from "./CustomToolbar";
import "react-quill/dist/quill.snow.css";
import "../styles/SummaryTextArea.css";

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
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const [localSummaryText, setLocalSummaryText] = useState(summaryText || "");
  const [buttonText, setButtonText] = useState("Save");
  const [initialRender, setInitialRender] = useState(true);

  const handleChange = (value) => {
    setLocalSummaryText(value);
    setButtonText("Save");
  };

  useEffect(() => {
    setLocalSummaryText(summaryText);
    if (initialRender) {
      setInitialRender(false);
    }
  }, [summaryText]);

  const lastUpdated = useSelector((state) => state?.post?.last_updated);

  return (
    <div id="summary-text-container">
      <span id="last-updated" className="p-0 mb-5" style={{}}>
        Edited: {lastUpdated}
      </span>
      <CustomToolBar openTagsModal={openTagsModal} />
      <ReactQuill
        value={localSummaryText}
        onChange={handleChange}
        modules={modules}
        formats={formats}
      />
      {!initialRender && (
        <Autosave
          data={localSummaryText}
          interval={1500}
          onSave={(data) => {
            if (localSummaryText !== summaryText && workdiaryToken) {
              dispatchUpdatePost(data === "<p><br></p>" ? "" : data);
              setButtonText("Saved");
            }
          }}
        />
      )}
      <button
        onClick={() => {
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
