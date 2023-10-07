import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const SummaryTextArea = ({ initialContent }) => {
  const [text, setText] = useState(initialContent || "");

  const handleChange = (value) => {
    setText(value);
  };

  return (
    <div>
      <ReactQuill value={text} onChange={handleChange} />
    </div>
  );
};

export default SummaryTextArea;
