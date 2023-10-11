import { useSelector } from "react-redux";
const AddTagsButton = ({ onTagAdd }) => {
  const tags = useSelector((state) => state?.post?.tags || []);

  const handleInsertTag = (onUpdate) => {
    const createdTag = prompt("Enter a tag:");
    if (createdTag) {
      onUpdate(createdTag); // Call the callback to add the new tag
    }
  };
  return (
    <>
      <button onClick={() => handleInsertTag(onTagAdd)}>Add Tag</button>
    </>
  );
};

export default AddTagsButton;
