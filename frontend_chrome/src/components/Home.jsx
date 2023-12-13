import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getPost,
  getPostsList,
  getUserAccountInfo,
} from "../helpers/actionCreators";
import moment from "moment";
import Auth from "./Auth";
import AuthModal from "./AuthModal";
import AuthModalHeader from "./AuthModalHeader";
import MainContainer from "./MainContainer";
import "react-quill/dist/quill.snow.css";
import "../styles/Home.css";
import AllPostsModal from "./AllPostsModal";
import AllPosts from "./AllPosts";

const Home = ({
  isAuthModalOpen,
  openAuthModal,
  closeAuthModal,
  isAllPostsModalOpen,
  closeAllPostsModal,
}) => {
  const user = useSelector((state) => state?.user);
  const post = useSelector((state) => state.post);
  const date = useSelector((state) => state.date);
  const workdiaryToken = useSelector((state) => state.workdiary_token);

  const [isHowToModalOpen, setIsHowToModalOpen] = useState(false);
  const openHowToModal = () => setIsHowToModalOpen(true);
  const closeHowToModal = () => setIsHowToModalOpen(false);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!date && !post && workdiaryToken) {
      // intial load of journal data
      dispatch(getPost(workdiaryToken, moment().format("MM/DD/YYYY")));
    }
    if (!user && workdiaryToken) {
      dispatch(getUserAccountInfo(workdiaryToken));
      dispatch(getPostsList(workdiaryToken, 1));
    }
  }, [post, date, user, workdiaryToken]);

  return (
    <div
      id="outer-div"
      onClick={(e) => {
        !workdiaryToken &&
        !isAuthModalOpen &&
        !isHowToModalOpen &&
        e.target.className !== "unclickable-exception-elements"
          ? openAuthModal()
          : null;
      }}
    >
      {isAuthModalOpen && !workdiaryToken && (
        <AuthModal
          isAuthModalOpen={isAuthModalOpen}
          closeAuthModal={closeAuthModal}
        >
          <AuthModalHeader openHowToModal={openHowToModal} />
          <Auth />
        </AuthModal>
      )}
      {isAllPostsModalOpen && workdiaryToken && (
        <AllPostsModal
          isAllPostsModalOpen={isAllPostsModalOpen}
          closeAllPostsModal={closeAllPostsModal}
        >
          <AllPosts closeAllPostsModal={closeAllPostsModal} />
        </AllPostsModal>
      )}
      <MainContainer
        isHowToModalOpen={isHowToModalOpen}
        openHowToModal={openHowToModal}
        closeHowToModal={closeHowToModal}
      />
    </div>
  );
};

export default Home;
