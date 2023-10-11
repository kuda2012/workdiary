import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Router from "./Router";
import { useDispatch, useSelector } from "react-redux";
import { isWorksnapTokenCurrent } from "./helpers/actionCreators";

function App() {
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const dispatch = useDispatch();
  if (!worksnapToken && localStorage.getItem("worksnap_token")) {
    dispatch(isWorksnapTokenCurrent(localStorage.getItem("worksnap_token")));
  }
  return (
    <div>
      <Navbar />
      <Router />
    </div>
  );
}

export default App;
