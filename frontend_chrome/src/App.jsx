import "./App.css";
import Navbar from "./components/Navbar";
import Router from "./Router";
import { useDispatch, useSelector } from "react-redux";
import { isWorksnapTokenCurrent } from "./helpers/actionCreators";

function App() {
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const dispatch = useDispatch();
  if (!worksnapToken && localStorage.getItem("worksnap_token")) {
    dispatch(isWorksnapTokenCurrent(localStorage.getItem("worksnap_token")));
  }
  // const initialLoad = useSelector((state) => state.initial_load);
  return (
    <>
      <Navbar />
      <Router />
    </>
  );
}

export default App;
