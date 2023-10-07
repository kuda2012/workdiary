import { useSelector } from "react-redux";
import Tag from "./Tag";
import AddTagsButton from "./AddTagsButton";

const Tags = () => {
  const tags = useSelector((state) => state.post?.tags);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <AddTagsButton />
            {tags && tags.map((tag) => <Tag tag={tag} />)}
          </div>
        </div>
      </div>
    </>
  );
};

export default Tags;
