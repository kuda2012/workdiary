import { useDispatch, useSelector } from "react-redux";
import Tab from "./Tab";
import {
  bulkDeleteTabs,
  createTabs,
  deleteTab,
  openTabs,
} from "../helpers/actionCreators";
import { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import "../styles/Tabs.css";

const Tabs = () => {
  const tabs = useSelector((state) => state.post?.tabs);
  const date = useSelector((state) => state.date);
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const [windows, setWindows] = useState(null);
  const dispatch = useDispatch();
  const [allBoxesSelected, setAllBoxesSelected] = useState(false);
  const [tabsSelected, setTabsSelected] = useState(new Map());
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  function onTabDelete(tab_id) {
    setTabsSelected((selectingTabs) => {
      selectingTabs.delete(tab_id);
      return new Map(selectingTabs);
    });
    dispatch(deleteTab(worksnapToken, date, tab_id));
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
  }, []);

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
            {/* <Button
              // className="m-1"
              color="info"
              id="Popover1"
              onClick={() => {
                togglePopover();
                // dispatch(openTabs(Array.from(tabsSelected.values())));
              }}
            > */}
            {/* <div className="d-flex">
              <Dropdown
                isOpen={dropdownOpen}
                toggle={toggle}
                modifiers={{
                  preventOverflow: { boundariesElement: "viewport" },
                }}
              >
                <DropdownToggle color="info" caret size="md">
                  Open selected in...
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header>Header</DropdownItem>
                  <DropdownItem>Some Action</DropdownItem>
                  <DropdownItem text>Dropdown Item Text</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div> */}
            <div class="dropdown">
              <button
                class="btn btn-secondary dropdown-toggle dropdown-toggle-split btn-info py-4"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Open selected in...
              </button>
              <ul
                class="dropdown-menu dropdown-menu-dark"
                aria-labelledby="dropdownMenuButton1"
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
