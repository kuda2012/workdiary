import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";

const SummaryTextArea = ({ initialContent }) => {
  const [value, setValue] = useState(initialContent || "");

  return <ReactQuill theme="snow" value={value} onChange={setValue} />;
};

export default SummaryTextArea;
