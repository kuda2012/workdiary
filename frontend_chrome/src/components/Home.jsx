import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getPost, getUserAccountInfo } from "../helpers/actionCreators";
import moment from "moment";
import Auth from "./Auth";
import AuthModal from "./AuthModal";
import AuthModalHeader from "./AuthModalHeader";
import MainContainer from "./MainContainer";
import "../styles/Home.css";
import "react-quill/dist/quill.snow.css";

const Home = ({ isAuthModalOpen, openAuthModal, closeAuthModal }) => {
  const user = useSelector((state) => state?.user);
  const post = useSelector((state) => state.post);
  const date = useSelector((state) => state.date);
  const worksnapToken = useSelector((state) => state.worksnap_token);

  const [isHowToModalOpen, setIsHowToModalOpen] = useState(false);
  const openHowToModal = () => setIsHowToModalOpen(true);
  const closeHowToModal = () => setIsHowToModalOpen(false);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!date && !post && worksnapToken) {
      // intial load of journal data
      dispatch(getPost(worksnapToken, moment().format("MM/DD/YYYY")));
    }
    if (!user && worksnapToken) {
      dispatch(getUserAccountInfo(worksnapToken));
    }
  }, [post, date, user, worksnapToken]);

  return (
    <div
      className="outerDiv"
      onClick={(e) => {
        !worksnapToken &&
        !isAuthModalOpen &&
        !isHowToModalOpen &&
        e.target.className !== "unclickable-exception-elements"
          ? openAuthModal()
          : null;
      }}
    >
      {isAuthModalOpen && !worksnapToken && (
        <AuthModal
          isAuthModalOpen={isAuthModalOpen}
          closeAuthModal={closeAuthModal}
        >
          <AuthModalHeader openHowToModal={openHowToModal} />
          <Auth />
        </AuthModal>
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
