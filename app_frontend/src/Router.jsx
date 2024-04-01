import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";

const Router = ({
  isAuthModalOpen,
  openAuthModal,
  closeAuthModal,
  isAllPostsModalOpen,
  closeAllPostsModal,
}) => {
  return (
    <Routes>
      <Route
        path={"/index.html"}
        element={
          <Home
            isAuthModalOpen={isAuthModalOpen}
            openAuthModal={openAuthModal}
            closeAuthModal={closeAuthModal}
            isAllPostsModalOpen={isAllPostsModalOpen}
            closeAllPostsModal={closeAllPostsModal}
          />
        }
      />
    </Routes>
  );
};

export default Router;
