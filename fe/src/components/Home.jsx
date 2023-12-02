import ResetPassword from "./ResetPassword";
import HowTo from "./HowTo";
import HowToModal from "./HowToModal";

const Home = ({ isHowToModalOpen, closeHowToModal }) => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        {isHowToModalOpen && (
          <HowToModal
            isHowToModalOpen={isHowToModalOpen}
            closeHowToModal={closeHowToModal}
          >
            <HowTo />
          </HowToModal>
        )}
        <ResetPassword />
      </div>
    </div>
  );
};

export default Home;
