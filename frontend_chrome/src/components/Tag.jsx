const Tag = ({ tag, onTagDelete }) => {
  return (
    <>
      <span>
        <b>{tag.text}</b>
      </span>
      <button onClick={() => onTagDelete(tag.tag_id)}>X</button>
    </>
  );
};

export default Tag;
