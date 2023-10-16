import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Home from "./components/Home";
import UserAccountInfo from "./components/UserAccountInfo";

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
        path="/account-info"
        element={worksnapToken ? <UserAccountInfo /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

export default Router;
