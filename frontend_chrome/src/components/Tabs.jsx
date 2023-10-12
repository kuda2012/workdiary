import { useDispatch, useSelector } from "react-redux";
import Tab from "./Tab";
import { deleteTab } from "../helpers/actionCreators";

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
            {tabs &&
              tabs.map((tab) => <Tab tab={tab} onTabDelete={onTabDelete} />)}
          </div>
        </div>
      </div>
    </>
  );
};

export default Tabs;
