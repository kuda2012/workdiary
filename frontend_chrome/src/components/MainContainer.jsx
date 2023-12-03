import { useSelector } from "react-redux";
import TopRowMain from "./TopRowMain";
import MiddleRowMain from "./MiddleRowMain";
import BottomRowMain from "./BottomRowMain";
import "../styles/Home.css";

const MainContainer = ({
  isHowToModalOpen,
  closeHowToModal,
  openHowToModal,
}) => {
  const workdiaryToken = useSelector((state) => state.workdiary_token);

  return (
    <div
      className={`container main-container${workdiaryToken ? "clickable" : ""}`}
    >
      <TopRowMain
        isHowToModalOpen={isHowToModalOpen}
        openHowToModal={openHowToModal}
        closeHowToModal={closeHowToModal}
      />
      <MiddleRowMain />
      <BottomRowMain />
    </div>
  );
};

export default MainContainer;
