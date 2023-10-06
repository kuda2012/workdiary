import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Function to remove HTML tags from a string
function stripHtmlTags(htmlString) {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = htmlString;
  return tempElement.textContent || tempElement.innerText || "";
}

const SummaryTextArea = ({ initialContent = "" }) => {
  // Use initialContent if available, otherwise an empty string
  const [value, setValue] = useState(initialContent);

  // Handle changes in the text editor
  const handleTextChange = (newValue) => {
    // Remove HTML tags from the newValue before setting it
    setValue(stripHtmlTags(newValue));
  };

  return <ReactQuill theme="snow" value={value} onChange={handleTextChange} />;
};

export default SummaryTextArea;
