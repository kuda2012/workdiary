const Tag = ({ tag, onTagDelete }) => {
  return (
    <span>
      <b>{tag.text}</b>
      <button
        style={{ padding: "2px" }}
        onClick={() => onTagDelete(tag.tag_id)}
      >
        X
      </button>
    </span>
  );
};

export default Tag;
