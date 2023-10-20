const Tab = ({ tab, setTabsSelected, isSelected, setAllBoxesSelected }) => {
  return (
    <span>
      <input
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
