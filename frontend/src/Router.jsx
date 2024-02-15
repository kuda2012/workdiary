import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";

const Router = ({ isHowToModalOpen, openHowToModal, closeHowToModal }) => {
  return (
    <Routes>
      <Route
        path="/reset-password"
        isValidUrl={true}
        element={
          <Home
            isHowToModalOpen={isHowToModalOpen}
            closeHowToModal={closeHowToModal}
          />
        }
      />
      <Route
        path="/verify-account"
        isValidUrl={true}
        element={
          <Home
            isHowToModalOpen={isHowToModalOpen}
            closeHowToModal={closeHowToModal}
          />
        }
      />
      <Route
        path="/privacy-policy"
        isValidUrl={true}
        element={
          <Home
            openHowToModal={openHowToModal}
            isHowToModalOpen={isHowToModalOpen}
            closeHowToModal={closeHowToModal}
          />
        }
      />
      <Route
        path="/"
        isValidUrl={true}
        element={
          <Home
            isHowToModalOpen={isHowToModalOpen}
            openHowToModal={openHowToModal}
            closeHowToModal={closeHowToModal}
          />
        }
      />
      <Route
        isValidUrl={true}
        element={
          <Home
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
