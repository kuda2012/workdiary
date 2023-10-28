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
import SearchBar from "./SearchBar";
import TagsModal from "./TagsModal";

const HomeLoggedIn = () => {
  const post = useSelector((state) => state.post);
  const date = useSelector((state) => state.date);
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const openTagsModal = () => setIsTagsModalOpen(true);
  const closeTagsModal = () => setIsTagsModalOpen(false);
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
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <SearchBar />
        </div>
      </div>
      <div
        className="row justify-content-center"
        style={{ marginTop: "20px", marginBottom: "100px" }}
      >
        <div className="col">
          <Calendar />
        </div>
      </div>
      <div className="row justify-content-around">
        <div className="col-md-4">
          <Tabs />
        </div>
        <div className="col-md-8 d-flex flex-column align-items-center">
          {date && (
            <>
              <SummaryVoice
                summaryText={post?.summary_text}
                dispatchUpdatePost={dispatchUpdatePost}
              />
              <SummaryTextArea
                initialContent={post?.summary_text}
                dispatchUpdatePost={dispatchUpdatePost}
                openTagsModal={openTagsModal}
              />
            </>
          )}
        </div>
      </div>
      {isTagsModalOpen && (
        <TagsModal
          isTagsModalOpen={isTagsModalOpen}
          closeTagsModal={closeTagsModal}
        >
          <div className="row justify-content-between">
            <div className="col">
              <h2>Tags</h2>
            </div>
            <div className="col">
              <button onClick={closeTagsModal}>Close</button>
            </div>
          </div>
          <Tags />
        </TagsModal>
      )}
      <div className="row">
        <div className="col">
          <button
            onClick={() => {
              dispatch(deletePost(worksnapToken, date));
            }}
          >
            Delete Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeLoggedIn;
