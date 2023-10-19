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
    </span>
  );
};

export default Tab;
