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
  getUserAccountInfo,
  setAlarm,
} from "../helpers/actionCreators";
import moment from "moment";
import Tabs from "./Tabs";
import Tags from "./Tags";
import SummaryVoice from "./SummaryVoice";
import SearchBar from "./SearchBar";
import TagsModal from "./TagsModal";
import TabsModal from "./TabsModal";

const HomeLoggedIn = () => {
  const userAccountInfo = useSelector((state) => state?.user);
  const post = useSelector((state) => state.post);
  const date = useSelector((state) => state.date);
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const openTagsModal = () => setIsTagsModalOpen(true);
  const closeTagsModal = () => setIsTagsModalOpen(false);

  const [isTabsModalOpen, setIsTabsModalOpen] = useState(false);
  const openTabsModal = () => setIsTabsModalOpen(true);
  const closeTabsModal = () => setIsTabsModalOpen(false);
  const [setAlarmOnce, setSetAlarmOnce] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!date && !post) {
      // intial load of journal data
      dispatch(getPost(worksnapToken, moment().format("MM/DD/YYYY")));
    }
    if (!userAccountInfo) {
      dispatch(getUserAccountInfo(worksnapToken));
    }
    if (userAccountInfo && !setAlarmOnce) {
      setAlarm(userAccountInfo);
      setSetAlarmOnce(true);
    }
  }, [post, date, userAccountInfo, setAlarmOnce]);

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
          <div className="d-flex justify-content-start">
            <Calendar />
          </div>
        </div>
        <div className="col">
          <div className="d-flex justify-content-end">
            <SearchBar />
          </div>
        </div>

        {/* <div
          className="row"
          style={{ marginTop: "20px", marginBottom: "100px" }}
        >
          <div className="col">
            <Calendar />
          </div>
        </div> */}
      </div>
      <div className="row justify-content-around">
        <div className="col-10 d-flex flex-column align-items-center">
          {date && userAccountInfo && (
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
        <div className="col-2 d-flex align-items-center">
          <button
            style={{ transform: "rotate(-90deg)" }}
            onClick={() => openTabsModal()}
          >
            <h4>Your browser tabs</h4>
          </button>
          {isTabsModalOpen && (
            <TabsModal
              isTabsModalOpen={isTabsModalOpen}
              closeTabsModal={closeTabsModal}
            >
              <div className="row justify-content-between">
                <div className="col">
                  <h2>Tags</h2>
                </div>
              </div>
              <Tabs />
            </TabsModal>
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
              <h2>Tabs</h2>
            </div>
            {/* <div className="col">
              <button onClick={closeTagsModal}>Close</button>
            </div> */}
          </div>
          <Tags />
        </TagsModal>
      )}
      <div className="row">
        <div className="col">
          <button
            onClick={() => {
              if (post) {
                dispatch(deletePost(worksnapToken, date));
              } else {
                alert(
                  "You have not save anything to this date, there's nothing to delete."
                );
              }
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
