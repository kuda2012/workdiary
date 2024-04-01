import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";

const Router = ({ isHowToModalOpen, openHowToModal, closeHowToModal }) => {
  return (
    <Routes>
      <Route
        path="/reset-password"
        element={
          <Home
            isValidUrl={true}
            isHowToModalOpen={isHowToModalOpen}
            closeHowToModal={closeHowToModal}
          />
        }
      />
      <Route
        path="/verify-account"
        element={
          <Home
            isValidUrl={true}
            isHowToModalOpen={isHowToModalOpen}
            closeHowToModal={closeHowToModal}
          />
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <Home
            isValidUrl={true}
            openHowToModal={openHowToModal}
            isHowToModalOpen={isHowToModalOpen}
            closeHowToModal={closeHowToModal}
          />
        }
      />
      <Route
        path="/"
        element={
          <Home
            isValidUrl={true}
            isHowToModalOpen={isHowToModalOpen}
            openHowToModal={openHowToModal}
            closeHowToModal={closeHowToModal}
          />
        }
      />
      <Route
        path="*"
        element={
          <Home
            isValidUrl={false}
            isHowToModalOpen={isHowToModalOpen}
            openHowToModal={openHowToModal}
            closeHowToModal={closeHowToModal}
          />
        }
      />
    </Routes>
  );
};

export default Router;
