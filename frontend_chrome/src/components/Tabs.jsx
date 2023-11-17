import { useDispatch, useSelector } from "react-redux";
import Tab from "./Tab";
import {
  bulkDeleteTabs,
  createTabs,
  deleteTab,
  openTabs,
} from "../helpers/actionCreators";
import { useEffect, useState } from "react";
import { Button } from "reactstrap";

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

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <Button
              color="primary"
              style={{ width: "100%" }}
              onClick={() => dispatch(createTabs(worksnapToken, date))}
            >
              Pull Current tabs
            </Button>
          </div>
        </div>
        <div className="row mt-2 justify-content-around align-items-center">
          <div className="col-6">
            <Button
              // className="m-1"
              color="info"
              onClick={() =>
                dispatch(openTabs(Array.from(tabsSelected.values())))
              }
            >
              Open selected
            </Button>
          </div>
          <div className="col-6">
            <Button
              // className="m-1"
              color="danger"
              onClick={() => {
                if (tabsSelected.size > 0) {
                  dispatch(
                    bulkDeleteTabs(
                      worksnapToken,
                      date,
                      Array.from(tabsSelected.keys())
                    )
                  );
                  setTabsSelected(new Map());
                  setAllBoxesSelected(false);
                }
              }}
            >
              Delete Selected
            </Button>
          </div>
        </div>
        <div className="row">
          <div
            style={{ position: "relative", right: "4px" }}
            className="col-6 m-3"
          >
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
            <label
              style={{ position: "relative", bottom: "1px" }}
              for="selectAllInput"
            >
              <span className="ms-2">Select all</span>
            </label>
          </div>
        </div>
        <div
          className="container"
          style={{ maxHeight: "600px", overflowY: "auto" }}
        >
          {tabs &&
            tabs.map((tab, index) => (
              <div key={index} className="row">
                <Tab
                  tab={tab}
                  setTabsSelected={setTabsSelected}
                  setAllBoxesSelected={setAllBoxesSelected}
                  isSelected={tabsSelected.has(tab.tab_id)}
                  onTabDelete={onTabDelete}
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Tabs;
