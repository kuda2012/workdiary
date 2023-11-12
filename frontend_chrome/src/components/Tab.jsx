import "../styles/Tab.css";
const Tab = ({
  tab,
  onTabDelete,
  setTabsSelected,
  isSelected,
  setAllBoxesSelected,
}) => {
  return (
    <>
      <div className="col-md-2">
        <input
          style={{ position: "relative", top: "2px" }}
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            if (isSelected) {
              setAllBoxesSelected(false);
              setTabsSelected((tabsSelected) => {
                tabsSelected.delete(tab.tab_id);
                return new Map(tabsSelected);
              });
            } else {
              setTabsSelected((tabsSelected) => {
                tabsSelected.set(tab.tab_id, tab.url);
                return new Map(tabsSelected);
              });
            }
          }}
        />
      </div>
      <div className="col-md-2">
        <img
          src={tab.icon}
          alt="Tab Icon"
          style={{ maxWidth: "16px", maxHeight: "16px" }}
        />
      </div>
      <div className="col-md-6 tab-link-column">
        <b>
          <a
            href={tab.url}
            className="tab-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {tab.title}
          </a>
        </b>
      </div>

      <div className="col-md-2">
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
      </div>
    </>
  );
};

export default Tab;
