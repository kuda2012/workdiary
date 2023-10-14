import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { Button } from "reactstrap";

const SummaryTextArea = ({ dispatchUpdatePost }) => {
  const initialText = useSelector((state) => state?.post.summary_text);
  const [summaryText, setSummaryText] = useState(initialText || "");
  const [buttonText, setButtonText] = useState("Save");

  const handleChange = (value) => {
    setSummaryText(value);
    setButtonText("Save");
  };

  useEffect(() => {
    setSummaryText(initialText);
  }, [initialText]);
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
