const Tab = ({ tab, onTabDelete }) => {
  return (
    <>
      <span>
        <b>{tab.title}</b>
      </span>
      <span>{tab.url}</span>
      <span>{tab.comment}</span>
      <button onClick={() => onTabDelete(tab.tab_id)}>X</button>
    </>
  );
};

export default Tab;
