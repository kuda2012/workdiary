import { useSelector } from "react-redux";
const AddTagsButton = () => {
  const tags = useSelector((state) => state?.post?.tags || []);

  const handleInsertTag = ({ onUpdate }) => {
    const value = prompt("Enter a tag:");
    if (value) {
      // onUpdate({ text: value }); // Call the callback to add the new tag
    }
  };
  return (
    <button className="ql-customTagsButton" onClick={handleInsertTag}>
      Tags
    </button>
  );
};

export default AddTagsButton;
