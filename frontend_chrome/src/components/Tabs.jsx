import { useDispatch, useSelector } from "react-redux";
import Tab from "./Tab";
import {
  bulkDeleteTabs,
  createTabs,
  deleteTab,
  openTabs,
} from "../helpers/actionCreators";
import { useEffect, useState } from "react";

const Tabs = () => {
  const tabs = useSelector((state) => state.post?.tabs);
  const date = useSelector((state) => state.date);
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const dispatch = useDispatch();
  const [allBoxesSelected, setAllBoxesSelected] = useState(false);
  const [tabsSelected, setTabsSelected] = useState(new Map());
  function onTabDelete(tab_id) {
    setTabsSelected((selectingTabs) => {
      selectingTabs.delete(tab_id);
      return new Map(selectingTabs);
    });
    dispatch(deleteTab(worksnapToken, date, tab_id));
  }

  useEffect(() => {
    if (!tabs) {
      setTabsSelected(new Map());
    }
  }, [tabs]);
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <button onClick={() => dispatch(createTabs(worksnapToken, date))}>
              Pull Current tabs
            </button>
            <button
              onClick={() => {
                setTabsSelected(new Map());
                dispatch(bulkDeleteTabs(worksnapToken, date, tabs));
              }}
            >
              Delete All Tabs
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <label for="selectAllInput">Select all: </label>
            <input
              type="checkbox"
              id="selectAllInput"
              checked={allBoxesSelected}
              onChange={() => {
                setAllBoxesSelected(!allBoxesSelected);
                if (allBoxesSelected) {
                  setTabsSelected(new Map());
                } else if (tabs.length !== tabsSelected.size) {
                  setTabsSelected((selectingAllTabs) => {
                    tabs.map((addTab) =>
                      selectingAllTabs.set(addTab.tab_id, addTab.url)
                    );
                    return new Map(selectingAllTabs);
                  });
                }
              }}
            />
            <button
              onClick={() =>
                dispatch(openTabs(Array.from(tabsSelected.values())))
              }
            >
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
                  setTabsSelected={setTabsSelected}
                  setAllBoxesSelected={setAllBoxesSelected}
                  isSelected={tabsSelected.has(tab.tab_id)}
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
