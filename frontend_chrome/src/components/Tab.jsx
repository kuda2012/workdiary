const Tab = ({ tab }) => {
  return (
    <>
      <span>
        <b>{tab.title}</b>
      </span>
      <span>{tab.url}</span>
      <span>{tab.comment}</span>
      <button>X</button>
    </>
  );
};

export default Tab;
