import Calendar from "./Calendar";
import "../styles/HomeLoggedIn.css";
import "react-quill/dist/quill.snow.css";
import SummaryTextArea from "./SummaryTextArea";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getPost,
  updatePost,
  createPost,
  deletePost,
} from "../helpers/actionCreators";
import moment from "moment";
import Tabs from "./Tabs";
import Tags from "./Tags";
import SummaryVoice from "./SummaryVoice";

const HomeLoggedIn = () => {
  const post = useSelector((state) => state.post);
  const date = useSelector((state) => state.date);
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!date && !post) {
      // intial load of journal data
      dispatch(getPost(worksnapToken, moment().format("MM/DD/YYYY")));
    }
  }, [post, date]);

  function dispatchUpdatePost(summary_text, summary_voice) {
    if (post) {
      dispatch(updatePost(worksnapToken, date, summary_text, summary_voice));
    } else {
      dispatch(createPost(worksnapToken, date, summary_text, summary_voice));
    }
  }
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col">
          <Calendar />
          <button
            onClick={() => {
              dispatch(deletePost(worksnapToken, date));
            }}
          >
            Delete Post
          </button>
        </div>
      </div>
      <div className="row justify-content-around">
        <div className="col-md-4">
          <Tabs />
        </div>
        <div className="col-md-8">
          {date && (
            <>
              <Tags />
              <SummaryVoice
                summaryText={post?.summary_text}
                dispatchUpdatePost={dispatchUpdatePost}
              />
              <SummaryTextArea
                initialContent={post?.summary_text}
                dispatchUpdatePost={dispatchUpdatePost}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeLoggedIn;
