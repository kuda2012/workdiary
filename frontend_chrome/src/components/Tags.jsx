import { useDispatch, useSelector } from "react-redux";
import Tag from "./Tag";
import { createTag, deleteTag } from "../helpers/actionCreators";

const Tags = () => {
  const date = useSelector((state) => state.date);
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const tags = useSelector((state) => state.post?.tags);
  const dispatch = useDispatch();
  function onTagAdd(tag) {
    dispatch(createTag(worksnapToken, date, tag));
  }
  function onTagDelete(tag_id) {
    dispatch(deleteTag(worksnapToken, date, tag_id));
  }
  const handleInsertTag = (onUpdate) => {
    const createdTag = prompt("Enter a tag:");
    if (createdTag) {
      onUpdate(createdTag); // Call the callback to add the new tag
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
          <div className="col-md-12">
            <button onClick={() => handleInsertTag(onTagAdd)}>Add Tag</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tags;
