import { useDispatch, useSelector } from "react-redux";
import Tag from "./Tag";
import AddTagsButton from "./AddTagsButton";
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
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            {tags &&
              tags.map((tag) => <Tag tag={tag} onTagDelete={onTagDelete} />)}
          </div>
        </div>
      </div>
    </>
  );
};

export default Tags;
