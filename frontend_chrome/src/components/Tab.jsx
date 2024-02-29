import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../styles/Tab.css";
const Tab = ({
  tab,
  onTabDelete,
  setTabsSelected,
  isSelected,
  setAllBoxesSelected,
  scrollToTab,
}) => {
  const [scrollToThisTab, setScrollToThisTab] = useState();
  const [runOnce, setRunOnce] = useState(true);
  const clickedSearchResult = useSelector(
    (state) => state.clicked_search_result
  );
  useEffect(() => {
    if (
      (clickedSearchResult?.original_string === tab.url &&
        clickedSearchResult?.match_source === "tab") ||
      (clickedSearchResult?.tab_title === tab.title &&
        clickedSearchResult?.match_source === "tab_title")
    ) {
      setScrollToThisTab("scrollToThisTab");
    }
    if (runOnce && scrollToThisTab) {
      scrollToTab(scrollToThisTab);
      setRunOnce(false);
    }
  }, [clickedSearchResult, runOnce, scrollToThisTab]);
  return (
    <>
      <div className="col-md-2" id={scrollToThisTab ? scrollToThisTab : null}>
        <input
          className="tab-checkbox form-check-input"
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
      <div
        className={`col-md-6 tab-link-column ${
          clickedSearchResult && scrollToThisTab && "highlight-tab"
        }`}
      >
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
          className="delete-tab"
          onClick={() => {
            setScrollToThisTab(null);
            onTabDelete(tab.tab_id);
          }}
        >
          X
        </button>
      </div>
    </>
  );
};

export default Tab;
