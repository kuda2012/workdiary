import "./App.css";
import Navbar from "./components/Navbar";
import Router from "./Router";
import { useDispatch, useSelector } from "react-redux";
import { isWorksnapTokenCurrent } from "./helpers/actionCreators";
import { useState } from "react";

function App() {
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const dispatch = useDispatch();
  if (!worksnapToken && localStorage.getItem("worksnap_token")) {
    dispatch(isWorksnapTokenCurrent(localStorage.getItem("worksnap_token")));
  }

  const [isContainerModalOpen, setIsContainerModalOpen] = useState(
    !worksnapToken ? true : false
  );
  const openContainerModal = () => setIsContainerModalOpen(true);
  const closeContainerModal = () => setIsContainerModalOpen(false);
  return (
    <>
      <Navbar openContainerModal={openContainerModal} />
      <Router
        isContainerModalOpen={isContainerModalOpen}
        openContainerModal={openContainerModal}
        closeContainerModal={closeContainerModal}
      />
    </>
  );
}

export default App;
