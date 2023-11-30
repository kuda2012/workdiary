import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { isWorksnapTokenCurrent } from "./helpers/actionCreators";
import Navbar from "./components/Navbar";
import Router from "./Router";
import "./App.css";

function App() {
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const dispatch = useDispatch();
  if (!worksnapToken && localStorage.getItem("worksnap_token")) {
    dispatch(isWorksnapTokenCurrent(localStorage.getItem("worksnap_token")));
  }

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(
    !worksnapToken ? true : false
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
            className="container d-flex justify-content-center align-items-center"
            style={{ height: "80%" }}
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
