import "./App.css";
import Navbar from "./components/Navbar";
import Router from "./Router";
import { useDispatch, useSelector } from "react-redux";
import { isWorksnapTokenCurrent } from "./helpers/actionCreators";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";

function App() {
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const dispatch = useDispatch();
  if (!worksnapToken && localStorage.getItem("worksnap_token")) {
    dispatch(isWorksnapTokenCurrent(localStorage.getItem("worksnap_token")));
  }

  const [isContainerModalOpen, setIsContainerModalOpen] = useState(
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
  const openContainerModal = () => setIsContainerModalOpen(true);
  const closeContainerModal = () => setIsContainerModalOpen(false);
  return (
    <>
      {firstLoad ? (
        <>
          <Navbar openContainerModal={openContainerModal} />
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
          <Navbar openContainerModal={openContainerModal} />
          <Router
            isContainerModalOpen={isContainerModalOpen}
            openContainerModal={openContainerModal}
            closeContainerModal={closeContainerModal}
          />
        </>
      )}
    </>
  );
}

export default App;
