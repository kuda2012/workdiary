import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Home from "./components/Home";
import Settings from "./components/Settings";

const Router = () => {
  const worksnapToken = useSelector((state) => state.worksnap_token);

  const location = useLocation();
  return (
    <Routes>
      <Route
        path={location.pathname === "/index.html" ? "/index.html" : "/"}
        element={<Home />}
      />
      <Route
        path="/settings"
        element={worksnapToken ? <Settings /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

export default Router;
