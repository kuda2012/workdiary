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
          className="tab-checkbox"
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
        <img className="tab-icon" src={tab.icon} alt="Tab Icon" />
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
        <button className="delete-tab" onClick={() => onTabDelete(tab.tab_id)}>
          X
        </button>
      </div>
    </>
  );
};

export default Tab;
