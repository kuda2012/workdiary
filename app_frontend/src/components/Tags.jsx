import { useDispatch, useSelector } from "react-redux";
import {
  clearScrollTo,
  clearSearchResults,
  createTag,
  deleteTag,
} from "../helpers/actionCreators";
import Tag from "./Tag";

const Tags = () => {
  const date = useSelector((state) => state.date);
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const tags = useSelector((state) => state.post?.tags);
  const dispatch = useDispatch();
  function onTagAdd(tag) {
    dispatch(createTag(workdiaryToken, date, tag));
    dispatch(clearSearchResults());
  }
  function onTagDelete(tag_id) {
    dispatch(deleteTag(workdiaryToken, date, tag_id));
    dispatch(clearSearchResults());
    dispatch(clearScrollTo());
  }
  const handleInsertTag = (onUpdate) => {
    while (true) {
      const createdTag = prompt("Enter a tag:");

      if (!createdTag) {
        // User canceled the prompt, break the loop
        break;
      }

      // Validate for non-alphanumeric characters
      if (/^[a-zA-Z0-9]+$/.test(createdTag)) {
        // Tag is valid, proceed to add it
        onUpdate(createdTag);
        break; // Exit the loop
      } else {
        // Tag is invalid, alert (but don't reprompt immediately)
        alert("Tag cannot be empty and can only contain letters and numbers.");
      }
    }
  };
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            {tags &&
              tags.map((tag) => <Tag tag={tag} onTagDelete={onTagDelete} />)}
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mt-1">
            <button onClick={() => handleInsertTag(onTagAdd)}>Add Tag</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tags;
