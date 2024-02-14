import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import {
  bulkDeleteTabs,
  clearScrollTo,
  clearSearchResults,
  createTabs,
  deleteTab,
  openTabs,
} from "../helpers/actionCreators";
import Tab from "./Tab";
import "../styles/Tabs.css";

const Tabs = () => {
  const tabs = useSelector((state) => state.post?.tabs);
  const date = useSelector((state) => state.date);
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const dispatch = useDispatch();
  const [windows, setWindows] = useState(null);
  const [allBoxesSelected, setAllBoxesSelected] = useState(false);
  const [tabsSelected, setTabsSelected] = useState(new Map());
  const [currentTabCount, setCurrentTabsCount] = useState(0);
  const containerRef = useRef(null);

  function onTabDelete(tab_id) {
    setTabsSelected((selectingTabs) => {
      selectingTabs.delete(tab_id);
      return new Map(selectingTabs);
    });
    dispatch(deleteTab(workdiaryToken, date, tab_id));
    dispatch(clearScrollTo());
    dispatch(clearSearchResults());
  }
  useEffect(() => {
    const fetchWindows = async () => {
      try {
        const allWindows = await chrome.windows.getAll();
        setWindows(() => {
          return allWindows
            .filter(
              (window) => window.type !== "popup" && window.type !== "panel"
            )
            .sort((a, b) => {
              if (a.left !== b.left) {
                return a.left - b.left; // Sort based on 'left' values
              } else if (a.focused !== b.focused) {
                // If 'left' values are equal, sort based on 'focused' property
                return a.focused ? -1 : 1; // Place focused:true before focused:false
              } else {
                return 0; // Maintain the same order for objects with the same 'left' and 'focused' values
              }
            });
        });
      } catch (error) {
        console.error("Error fetching windows:", error);
      }
    };
    fetchWindows();
    const getCurrentTabsCount = async () => {
      setCurrentTabsCount(Array.from(await chrome.tabs.query({})).length);
    };
    getCurrentTabsCount();
    chrome.windows.onFocusChanged.addListener(fetchWindows);
    chrome.windows.onBoundsChanged.addListener(fetchWindows);
    chrome.windows.onRemoved.addListener(fetchWindows);
    chrome.tabs.onCreated.addListener(getCurrentTabsCount);
    chrome.tabs.onRemoved.addListener(getCurrentTabsCount);
    return () => {
      chrome.windows.onRemoved.removeListener(fetchWindows);
      chrome.tabs.onCreated.removeListener(getCurrentTabsCount);
      chrome.tabs.onRemoved.removeListener(getCurrentTabsCount);
    };
  }, []);

  function scrollToTab(tabId) {
    const targetTab = document.getElementById(tabId);
    if (containerRef.current && targetTab) {
      const scrollPosition =
        targetTab.offsetTop - containerRef.current.offsetTop;
      containerRef.current.scrollTop = scrollPosition;
    }
  }

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <Button
              id="pull-current-tabs"
              color="primary"
              onClick={() => {
                dispatch(clearScrollTo());
                dispatch(clearSearchResults());
                dispatch(createTabs(workdiaryToken, date, tabs));
              }}
            >
              Pull Current tabs ({currentTabCount})
            </Button>
          </div>
        </div>
        <div className="row mt-2 justify-content-around align-items-center">
          <div className="col-6">
            <div class="dropdown">
              <button
                class="btn btn-secondary dropdown-toggle dropdown-toggle-split btn-info py-4 px-3"
                type="button"
                id="drop-down-menu-button1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Open selected in...
              </button>
              <ul
                class="dropdown-menu dropdown-menu-dark"
                aria-labelledby="drop-down-menu-button1"
              >
                <li>
                  <a
                    class="dropdown-item"
                    href="#"
                    onClick={() => {
                      dispatch(openTabs(Array.from(tabsSelected.values())));
                    }}
                  >
                    New Window
                  </a>
                </li>
                {windows &&
                  windows.map((window, i) => (
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        onClick={() => {
                          dispatch(
                            openTabs(
                              Array.from(tabsSelected.values()),
                              window.id
                            )
                          );
                        }}
                      >
                        Window {i + 1}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className="col-6">
            <Button
              color="danger"
              onClick={() => {
                if (tabsSelected.size > 0) {
                  dispatch(
                    bulkDeleteTabs(
                      workdiaryToken,
                      date,
                      Array.from(tabsSelected.keys())
                    )
                  );
                  dispatch(clearScrollTo());
                  dispatch(clearSearchResults());
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
          <div className="col-12 m-3">
            <span>
              Tab count: {tabs?.length} <small>(Duplicates unallowed)</small>
            </span>
          </div>
        </div>
        <div className="row">
          <div id="select-all-tabs-column" className="col-6 m-3">
            <input
              type="checkbox"
              id="select-all-tabs-input"
              className="form-check-input"
              checked={allBoxesSelected}
              onChange={async () => {
                if (!tabs || tabs?.length === 0) return;
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
            <label id="select-all-tabs-label" for="select-all-tabs-input">
              <span className="ms-2">Select all</span>
            </label>
          </div>
        </div>
        <div
          id="render-tabs-container"
          className="container"
          ref={containerRef}
        >
          {tabs &&
            tabs.map((tab, index) => {
              return (
                <div key={index} className="row">
                  <Tab
                    scrollToTab={scrollToTab}
                    tab={tab}
                    setTabsSelected={setTabsSelected}
                    setAllBoxesSelected={setAllBoxesSelected}
                    isSelected={tabsSelected.has(tab.tab_id)}
                    onTabDelete={onTabDelete}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Tabs;
