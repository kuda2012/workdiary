import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { isWorkdiaryTokenCurrent } from "./helpers/actionCreators";
import Navbar from "./components/Navbar";
import Router from "./Router";
import "./App.css";

function App() {
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const dispatch = useDispatch();
  if (!workdiaryToken && localStorage.getItem("workdiary_token")) {
    dispatch(isWorkdiaryTokenCurrent(localStorage.getItem("workdiary_token")));
  }

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(
    !workdiaryToken ? true : false
  );

  const [firstLoad, setFirstLoad] = useState(true);
  useEffect(() => {
    if (firstLoad) {
      setTimeout(() => {
        setFirstLoad(false);
      }, 600);
    }
  });
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  return (
    <>
      {firstLoad ? (
        <>
          <Navbar openAuthModal={openAuthModal} />
          <div
            id="three-dots-container"
            className="container d-flex justify-content-center align-items-center"
          >
            <div className="row">
              <div className="col">
                <ThreeDots
                  height="120px"
                  width="120px"
                  radius="6"
                  color="gray"
                  ariaLabel="loading"
                  wrapperStyle
                  wrapperClass
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <Navbar openAuthModal={openAuthModal} />
          <Router
            isAuthModalOpen={isAuthModalOpen}
            openAuthModal={openAuthModal}
            closeAuthModal={closeAuthModal}
          />
        </>
      )}
    </>
  );
}

export default App;
