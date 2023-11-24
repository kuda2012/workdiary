import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";

const Router = ({ isHowToModalOpen, closeHowToModal }) => {
  return (
    <Routes>
      <Route
        path={"/reset-password"}
        element={
          <Home
            isHowToModalOpen={isHowToModalOpen}
            closeHowToModal={closeHowToModal}
          />
        }
      />
    </Routes>
  );
};

export default Router;
