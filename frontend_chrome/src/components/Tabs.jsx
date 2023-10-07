import { useSelector } from "react-redux";
import Tab from "./Tab";

const Tabs = () => {
  const tabs = useSelector((state) => state.post?.tabs);
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            {tabs && tabs.map((tab) => <Tab tab={tab} />)}
          </div>
        </div>
      </div>
    </>
  );
};

export default Tabs;
