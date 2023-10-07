const Tag = ({ tag }) => {
  return (
    <>
      <span>
        <b>{tag.text}</b>
      </span>
      <button>X</button>
    </>
  );
};

export default Tag;
