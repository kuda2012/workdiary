import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";

const Router = ({
  isContainerModalOpen,
  openContainerModal,
  closeContainerModal,
}) => {
  const location = useLocation();
  return (
    <Routes>
      <Route
        path={"/index.html"}
        // path={location.pathname === "/index.html" ? "/index.html" : "/"}
        element={
          <Home
            isContainerModalOpen={isContainerModalOpen}
            openContainerModal={openContainerModal}
            closeContainerModal={closeContainerModal}
          />
        }
      />
    </Routes>
  );
};

export default Router;
