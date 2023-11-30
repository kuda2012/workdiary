import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";

const Router = ({ isAuthModalOpen, openAuthModal, closeAuthModal }) => {
  return (
    <Routes>
      <Route
        path={"/index.html"}
        // path={location.pathname === "/index.html" ? "/index.html" : "/"}
        element={
          <Home
            isAuthModalOpen={isAuthModalOpen}
            openAuthModal={openAuthModal}
            closeAuthModal={closeAuthModal}
          />
        }
      />
    </Routes>
  );
};

export default Router;
