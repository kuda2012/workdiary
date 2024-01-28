import { useEffect, useState } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
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
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const tabs = useSelector((state) => state.post?.tabs);
  const clickedSearchResult = useSelector(
    (state) => state.clicked_search_result
  );

  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const openTagsModal = () => setIsTagsModalOpen(true);
  const closeTagsModal = () => setIsTagsModalOpen(false);

  const [isTabsModalOpen, setIsTabsModalOpen] = useState(false);
  const openTabsModal = () => setIsTabsModalOpen(true);
  const closeTabsModal = () => setIsTabsModalOpen(false);

  const dispatch = useDispatch();
  function dispatchCreateOrUpdatePost(
    summary_text,
    summary_voice,
    audioDuration
  ) {
    if (post) {
      dispatch(
        updatePost(
          workdiaryToken,
          date,
          summary_text,
          summary_voice,
          audioDuration
        )
      );
    } else {
      dispatch(
        createPost(
          workdiaryToken,
          date,
          summary_text,
          summary_voice,
          audioDuration
        )
      );
    }
  }

  useEffect(() => {
    if (
      clickedSearchResult &&
      !isTabsModalOpen &&
      clickedSearchResult?.match_source.includes("tab")
    ) {
      setTimeout(() => {
        openTabsModal();
      }, [400]);
    }
    if (
      clickedSearchResult &&
      !isTagsModalOpen &&
      clickedSearchResult?.match_source.includes("tag")
    ) {
      setTimeout(() => {
        openTagsModal();
      }, [400]);
    }
  }, [clickedSearchResult, isTabsModalOpen]);
  const popoverContent = (
    <Popover id="popover-content-tabs-modal">
      Pull in your browser tabs. Delete the ones that aren't relative to
      narrative of today's work. Come back in the future and you can use these
      tabs to restart an old problem.
    </Popover>
  );
  return (
    <div className="row justify-content-around">
      <div className="col-1"></div>
      <div className="col-10 d-flex flex-column align-items-center">
        <>
          <SummaryVoice
            summaryText={post?.summary_text}
            dispatchCreateOrUpdatePost={dispatchCreateOrUpdatePost}
          />
          <SummaryTextArea
            initialContent={post?.summary_text}
            dispatchCreateOrUpdatePost={dispatchCreateOrUpdatePost}
            openTagsModal={openTagsModal}
          />
        </>
      </div>
      <div className="col-1 d-flex align-items-center justify-content-end px-0">
        <button id="tabs-home" onClick={() => openTabsModal()}>
          <span>Tab Vault</span>
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
              <div className="col d-flex justify-content-end mb-2">
                <OverlayTrigger
                  rootClose={true}
                  trigger="click"
                  placement={tabs?.length < 3 || !tabs ? "top" : "bottom"}
                  overlay={popoverContent}
                >
                  <button id="info-button-tabs-modal" className="px-3">
                    <img src="/info_1.png" alt="info-icon" className="" />
                  </button>
                </OverlayTrigger>
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
