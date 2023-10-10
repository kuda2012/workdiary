import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { Button } from "reactstrap";

const SummaryTextArea = ({ initialContent, dispatchUpdatePost }) => {
  const [summaryText, setSummaryText] = useState(initialContent || "");
  const worksnapToken = useSelector((state) => state.worksnap_token);

  const handleChange = (value) => {
    setSummaryText(value);
  };

  return (
    <div>
      <ReactQuill value={summaryText} onChange={handleChange} />
      <Button
        onClick={() => {
          dispatchUpdatePost(summaryText);
        }}
      >
        Save
      </Button>
    </div>
  );
};

export default SummaryTextArea;
