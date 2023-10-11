import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { Button } from "reactstrap";

const SummaryTextArea = ({ initialContent, dispatchUpdatePost }) => {
  const [summaryText, setSummaryText] = useState(initialContent || "");
  const [buttonText, setButtonText] = useState("Save");

  const handleChange = (value) => {
    setSummaryText(value);
    setButtonText("Save");
  };

  return (
    <div>
      <ReactQuill value={summaryText} onChange={handleChange} />
      <button
        onClick={() => {
          dispatchUpdatePost(summaryText);
          setButtonText("Saved");
        }}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default SummaryTextArea;
