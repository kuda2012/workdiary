import "../styles/Tag.css";
const Tag = ({ tag, onTagDelete }) => {
  return (
    <span
      style={{ display: "inline-block" }}
      className="tag bg-info text-center m-1 ps-3 pe-1 py-1"
    >
      <b className="text-white">{tag.text}</b>
      <button
        className="btn btn-info delete-tag text-dark p-1 mx-1"
        onClick={() => onTagDelete(tag.tag_id)}
      >
        X
      </button>
    </span>
  );
};

export default Tag;
