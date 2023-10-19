const Tab = ({
  tab,
  onTabDelete,
  setTabsSelected,
  isSelected,
  setAllBoxesSelected,
}) => {
  return (
    <span>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => {
          setAllBoxesSelected(false);
          if (isSelected) {
            setTabsSelected((tabsSelected) =>
              tabsSelected.filter(
                (tabSelected) => tabSelected.tab_id !== tab.tab_id
              )
            );
          } else {
            setTabsSelected((tabsSelected) => [...tabsSelected, tab]);
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
