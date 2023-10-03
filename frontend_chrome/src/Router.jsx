import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AllBelowNavbar from "./components/AllBelowNavbar";
import Oauth from "./components/Oauth";
import { setWorksnapToken } from "./helpers/actionCreators";

const Router = () => {
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const dispatch = useDispatch();
  // !worksnapToken &&
  //   dispatch(
  //     setWorksnapToken(
  //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExNDAyMDIzMjAzMzMxNTE0MTc5MyIsImVtYWlsIjoia3VkYS5td2FrdXR1eWFAZ21haWwuY29tIiwibmFtZSI6Ikt1ZGEgTXdha3V0dXlhIiwiaWF0IjoxNjk2MzcwOTg0LCJleHAiOjE3Mjc5Mjg1ODR9.8Nk_pnXXZk8kqOPPrPujajqEbjl-Y-TFbLQum4Y53Hc"
  //     )
  //   );
  return (
    <Routes>
      <Route path="/" element={<AllBelowNavbar />} />
      <Route
        path="/account-info"
        element={
          worksnapToken || localStorage.getItem("worksnap_token") ? (
            <Oauth />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/delete-worksnap-account"
        element={
          worksnapToken || localStorage.getItem("worksnap_token") ? (
            <Oauth />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
};

export default Router;
