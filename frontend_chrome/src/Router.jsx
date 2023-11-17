import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Home from "./components/Home";

const Router = ({
  isContainerModalOpen,
  openContainerModal,
  closeContainerModal,
}) => {
  const worksnapToken = useSelector((state) => state.worksnap_token);

  const location = useLocation();
  return (
    <Routes>
      <Route
        path={location.pathname === "/index.html" ? "/index.html" : "/"}
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
