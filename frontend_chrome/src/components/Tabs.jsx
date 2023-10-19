import { useDispatch, useSelector } from "react-redux";
import Tab from "./Tab";
import {
  bulkDeleteTabs,
  createTabs,
  deleteTab,
  openTabs,
} from "../helpers/actionCreators";
import { useState } from "react";

const Tabs = () => {
  const tabs = useSelector((state) => state.post?.tabs);
  const date = useSelector((state) => state.date);
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const dispatch = useDispatch();
  function onTabDelete(tab_id) {
    dispatch(deleteTab(worksnapToken, date, tab_id));
  }

  // agregate selected, setSelected - contains all urls and tab_ids of those checked
  // if selected locally, add to aggregate and update your checkbox based off if you're in aggregate
  // same if unselected locally

  // if select all button checked, add all tabs to aggregate
  // if select all unchecked, empty aggregate

  const [allBoxesSelected, setAllBoxesSelected] = useState(false);
  const [tabsSelected, setTabsSelected] = useState([]);
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <button onClick={() => dispatch(createTabs(worksnapToken, date))}>
              Pull Current tabs
            </button>
            <button
              onClick={() =>
                dispatch(bulkDeleteTabs(worksnapToken, date, tabs))
              }
            >
              Delete All Tabs
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <input
              type="checkbox"
              checked={allBoxesSelected}
              onChange={() => {
                setAllBoxesSelected(!allBoxesSelected);
                if (allBoxesSelected) {
                  setTabsSelected([]);
                } else {
                  setTabsSelected(tabs);
                }
              }}
            ></input>
            <button onClick={() => dispatch(openTabs(tabsSelected))}>
              Open Tabs in a new window
            </button>
          </div>
        </div>
        {tabs &&
          tabs.map((tab, index) => (
            <div key={index} className="row">
              <div className="col-md-10">
                <Tab
                  tab={tab}
                  onTabDelete={onTabDelete}
                  setTabsSelected={setTabsSelected}
                  setAllBoxesSelected={setAllBoxesSelected}
                  isSelected={
                    tabsSelected.find(
                      (selectedTab) => selectedTab.tab_id === tab.tab_id
                    )
                      ? true
                      : false
                  }
                />
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
            </div>
          ))}
      </div>
    </>
  );
};

export default Tabs;
