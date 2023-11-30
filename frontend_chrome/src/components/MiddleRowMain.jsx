import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../helpers/actionCreators";
import Tabs from "./Tabs";
import Tags from "./Tags";
import SummaryVoice from "./SummaryVoice";
import TagsModal from "./TagsModal";
import TabsModal from "./TabsModal";
import SummaryTextArea from "./SummaryTextArea";
const MiddleRowMain = () => {
  const post = useSelector((state) => state.post);
  const date = useSelector((state) => state.date);
  const worksnapToken = useSelector((state) => state.worksnap_token);

  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const openTagsModal = () => setIsTagsModalOpen(true);
  const closeTagsModal = () => setIsTagsModalOpen(false);

  const [isTabsModalOpen, setIsTabsModalOpen] = useState(false);
  const openTabsModal = () => setIsTabsModalOpen(true);
  const closeTabsModal = () => setIsTabsModalOpen(false);

  const dispatch = useDispatch();
  function dispatchUpdatePost(summary_text, summary_voice, audioDuration) {
    if (post) {
      dispatch(
        updatePost(
          worksnapToken,
          date,
          summary_text,
          summary_voice,
          audioDuration
        )
      );
    } else {
      dispatch(
        createPost(
          worksnapToken,
          date,
          summary_text,
          summary_voice,
          audioDuration
        )
      );
    }
  }
  return (
    <div className="row justify-content-around">
      <div className="col-2"></div>
      <div className="col-8 d-flex flex-column align-items-center">
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
      </div>
      <div className="col-2 d-flex align-items-center justify-content-end px-0">
        <button
          id="tabsHome"
          style={{
            transform: "rotate(-90deg)",
            border: ".5px solid gray",
            position: "relative",
            // left: "10px",
            top: "25px",
            // top: "34px",
            // right: "0",
          }}
          onClick={() => openTabsModal()}
        >
          <span
            style={{
              fontSize: "1.25rem", // Set font size to resemble h5 size
              textTransform: "uppercase", // Convert text to uppercase
            }}
          >
            Your tabs
          </span>
        </button>
        {isTabsModalOpen && (
          <TabsModal
            isTabsModalOpen={isTabsModalOpen}
            closeTabsModal={closeTabsModal}
          >
            <div className="row justify-content-between">
              <div className="col">
                <h2>Tabs</h2>
              </div>
            </div>
            <Tabs />
          </TabsModal>
        )}
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
          </div>
          <Tags />
        </TagsModal>
      )}
    </div>
  );
};

export default MiddleRowMain;
