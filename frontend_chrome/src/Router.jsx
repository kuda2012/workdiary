import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Home from "./components/Home";
import UserAccountInfo from "./components/UserAccountInfo";

const Router = () => {
  const worksnapToken = useSelector((state) => state.worksnap_token);

  // const dispatch = useDispatch();
  const location = useLocation();
  // !worksnapToken &&
  //   dispatch(
  //     setWorksnapToken(
  //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExNDAyMDIzMjAzMzMxNTE0MTc5MyIsImVtYWlsIjoia3VkYS5td2FrdXR1eWFAZ21haWwuY29tIiwibmFtZSI6Ikt1ZGEgTXdha3V0dXlhIiwiaWF0IjoxNjk2MzcwOTg0LCJleHAiOjE3Mjc5Mjg1ODR9.8Nk_pnXXZk8kqOPPrPujajqEbjl-Y-TFbLQum4Y53Hc"
  //     )
  //   );
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
