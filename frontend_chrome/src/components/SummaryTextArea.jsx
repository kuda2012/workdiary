import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { Autosave } from "react-autosave"; // Import the Autosave component

const SummaryTextArea = ({ dispatchUpdatePost }) => {
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
    <div>
      <ReactQuill value={localSummaryText} onChange={handleChange} />
      <Autosave
        data={localSummaryText}
        interval={1500}
        onSave={(data) => {
          if (localSummaryText != summaryText) {
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
