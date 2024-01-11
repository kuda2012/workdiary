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
import AllPostsModal from "./AllPostsModal";
import AllPosts from "./AllPosts";
import AllPostsHeader from "./AllPostsHeader";
import SearchPostsResults from "./SearchPostsResults";
import "react-quill/dist/quill.snow.css";
import "../styles/Home.css";

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
  const showAllPosts = useSelector((state) => state.show_all_posts);
  const postsList = useSelector((state) => state?.posts_list);
  const searchResults = useSelector((state) => state.search_results);

  const [isHowToModalOpen, setIsHowToModalOpen] = useState(false);
  const openHowToModal = () => setIsHowToModalOpen(true);
  const closeHowToModal = () => setIsHowToModalOpen(false);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!date && !post && !user && workdiaryToken) {
      // intial load of journal data
      dispatch(getPost(workdiaryToken, moment().format("MM/DD/YYYY")));
      dispatch(getUserAccountInfo(workdiaryToken));
      dispatch(getPostsList(workdiaryToken, 1));
    }
    if (user && !postsList) {
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
          <AllPostsHeader closeAllPostsModal={closeAllPostsModal} />
          {showAllPosts
            ? postsList && <AllPosts closeAllPostsModal={closeAllPostsModal} />
            : searchResults && (
                <SearchPostsResults closeAllPostsModal={closeAllPostsModal} />
              )}
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
