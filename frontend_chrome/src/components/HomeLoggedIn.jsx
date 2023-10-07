import Calendar from "./Calendar";
import "../styles/HomeLoggedIn.css";
import "react-quill/dist/quill.snow.css";
import SummaryTextArea from "./SummaryTextArea";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getPost } from "../helpers/actionCreators";
import moment from "moment";
import Tabs from "./Tabs";
import Tags from "./Tags";

const HomeLoggedIn = () => {
  const post = useSelector((state) => state.post);
  const date = useSelector((state) => state.date);
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const [formerDate, setFormerDate] = useState(date);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!post && !date) {
      dispatch(getPost(worksnapToken, moment().format("MM/DD/YYYY")));
    }
    if (formerDate !== date) {
      setFormerDate(date);
    }
  }, [date, post]);

  return (
    <div className="container center-row">
      <div className="row justify-content-between">
        <div className="col-md-6">
          <Calendar />
        </div>
        <div className="col-md-6">
          {date && formerDate === date && (
            <>
              <Tags />
              <SummaryTextArea
                initialContent={post?.summary_text}
                // onUpdate={onUpdate}
              />
              <Tabs onUpdate />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeLoggedIn;
