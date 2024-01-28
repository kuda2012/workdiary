import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";

const Router = ({ isHowToModalOpen, openHowToModal, closeHowToModal }) => {
  return (
    <Routes>
      <Route
        path="/reset-password"
        element={
          <Home
            isHowToModalOpen={isHowToModalOpen}
            closeHowToModal={closeHowToModal}
          />
        }
      />
      <Route
        path="/verify-account"
        element={
          <Home
            isHowToModalOpen={isHowToModalOpen}
            closeHowToModal={closeHowToModal}
          />
        }
      />
      <Route
        path="/"
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
