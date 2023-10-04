import { useSelector } from "react-redux";
import "react-quill/dist/quill.snow.css";
import HomeLoggedIn from "./HomeLoggedIn";
import HomeLoggedOut from "./HomeLoggedOut";

const Home = () => {
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const isLoggedIn = worksnapToken ? true : false;

  return isLoggedIn ? <HomeLoggedIn /> : <HomeLoggedOut />;
};

export default Home;
