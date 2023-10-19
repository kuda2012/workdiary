const Tab = ({ tab, onTabDelete }) => {
  return (
    <span>
      {tab.icon && (
        <img
          src={tab.icon}
          alt="Tab Icon"
          style={{ maxWidth: "16px", maxHeight: "16px" }}
        />
      )}
      <b>
        <a href={tab.url} target="_blank" rel="noopener noreferrer">
          {tab.title}
        </a>
      </b>
      <button
        onClick={() => onTabDelete(tab.tab_id)}
        style={{
          fontSize: "12px",
          padding: "4px 8px",
          margin: "0",
          backgroundColor: "lightgray",
          border: "1px solid gray",
        }}
      >
        X
      </button>
    </span>
  );
};

export default Tab;
