import Calendar from "./Calendar";
import "../styles/Home.css";
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
  getAllPostDates,
} from "../helpers/actionCreators";
import moment from "moment";
import Tabs from "./Tabs";
import Tags from "./Tags";
import SummaryVoice from "./SummaryVoice";
import TagsModal from "./TagsModal";
import TabsModal from "./TabsModal";
import Settings from "./Settings";
import SettingsModal from "./SettingsModal";
import HowToModal from "./HowToModal";
import HowTo from "./HowTo";
import DeletePostModal from "./DeletePostModal";
import DeletePost from "./DeletePost";
import Authentication from "./Authentication";
import ContainerModal from "./ContainerModal";

const HomeLoggedIn = ({
  isContainerModalOpen,
  openContainerModal,
  closeContainerModal,
}) => {
  const user = useSelector((state) => state?.user);
  const post = useSelector((state) => state.post);
  const date = useSelector((state) => state.date);
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const openTagsModal = () => setIsTagsModalOpen(true);
  const closeTagsModal = () => setIsTagsModalOpen(false);

  const [isTabsModalOpen, setIsTabsModalOpen] = useState(false);
  const openTabsModal = () => setIsTabsModalOpen(true);
  const closeTabsModal = () => setIsTabsModalOpen(false);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

  const [isHowToModalOpen, setIsHowToModalOpen] = useState(false);
  const openHowToModal = () => setIsHowToModalOpen(true);
  const closeHowToModal = () => setIsHowToModalOpen(false);

  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const openDeletePostModal = () => setIsDeletePostModalOpen(true);
  const closeDeletePostModal = () => setIsDeletePostModalOpen(false);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!date && !post && worksnapToken) {
      // intial load of journal data
      dispatch(getPost(worksnapToken, moment().format("MM/DD/YYYY")));
      dispatch(getAllPostDates(worksnapToken));
    }
    if (!user && worksnapToken) {
      dispatch(getUserAccountInfo(worksnapToken));
    }
  }, [post, date, user, worksnapToken]);

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
    <div
      className="outerDiv"
      onClick={() => {
        !worksnapToken && !isContainerModalOpen ? openContainerModal() : null;
      }}
    >
      {isContainerModalOpen && !worksnapToken && (
        <ContainerModal
          isContainerModalOpen={isContainerModalOpen}
          closeContainerModal={closeContainerModal}
        >
          <h5 style={{ textTransform: "none" }}>Work Diary</h5>
          <Authentication />
        </ContainerModal>
      )}
      {
        <div
          className={`container-fluid main-container${
            worksnapToken ? "clickable" : ""
          }`}
        >
          <div className="row justify-content-center align-items-center">
            <div
              className="col-1 mt-1"
              style={{ position: "relative", right: "163px" }}
            >
              <div>
                <button onClick={() => openHowToModal()}>
                  <img src="/question_mark.png"></img>
                </button>
                {isHowToModalOpen && (
                  <HowToModal
                    isHowToModalOpen={isHowToModalOpen}
                    closeHowToModal={closeHowToModal}
                  >
                    <HowTo />
                  </HowToModal>
                )}
              </div>
            </div>
            <div className="col-5 mt-2" style={{ position: "relative" }}>
              <div>
                <Calendar />
              </div>
            </div>
            <div
              className="col-1 mt-1"
              style={{ position: "relative", left: "132px" }}
            >
              <div>
                <button onClick={() => openSettingsModal()}>
                  <img src="/gear-settings.png"></img>
                </button>
                {isSettingsModalOpen && (
                  <SettingsModal
                    isSettingsModalOpen={isSettingsModalOpen}
                    closeSettingsModal={closeSettingsModal}
                  >
                    <h5>Settings</h5>
                    <Settings />
                  </SettingsModal>
                )}
              </div>
            </div>
          </div>
          <div className="row justify-content-around">
            <div className="col-2"></div>
            <div className="col-8 d-flex flex-column align-items-center">
              {/* {date && user && ( */}
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
              {/* )} */}
            </div>
            <div className="col-2 d-flex align-items-center justify-content-start pl-0">
              <button
                style={{ transform: "rotate(-90deg)" }}
                onClick={() => openTabsModal()}
              >
                <h4>Your tabs</h4>
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
          <div className="row">
            <div className="col">
              <button
                style={{ position: "relative", left: "300px" }}
                onClick={() => {
                  if (post) {
                    openDeletePostModal();
                  } else {
                    alert(
                      "You have not save anything to this date, there's nothing to delete."
                    );
                  }
                }}
              >
                Delete Post
              </button>
              {isDeletePostModalOpen && (
                <DeletePostModal
                  isDeletePostModalOpen={isDeletePostModalOpen}
                  closeDeletePostModal={closeDeletePostModal}
                >
                  <DeletePost closeDeletePostModal={closeDeletePostModal} />
                </DeletePostModal>
              )}
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default HomeLoggedIn;
