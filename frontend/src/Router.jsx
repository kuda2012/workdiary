import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import { useEffect } from "react";

const Router = ({ isHowToModalOpen, closeHowToModal }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== "/reset-password") {
      navigate("/reset-password", { replace: true });
    }
  }, [navigate]);

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
    </Routes>
  );
};

export default Router;
