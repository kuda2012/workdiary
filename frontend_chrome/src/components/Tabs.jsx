import { useDispatch, useSelector } from "react-redux";
import Tab from "./Tab";
import {
  bulkDeleteTabs,
  createTabs,
  deleteTab,
} from "../helpers/actionCreators";

const Tabs = () => {
  const tabs = useSelector((state) => state.post?.tabs);
  const date = useSelector((state) => state.date);
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const dispatch = useDispatch();
  function onTabDelete(tab_id) {
    dispatch(deleteTab(worksnapToken, date, tab_id));
  }
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
        {tabs &&
          tabs.map((tab, index) => (
            <div key={index} className="row">
              <div className="col-md-10">
                <Tab tab={tab} onTabDelete={onTabDelete} />
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
