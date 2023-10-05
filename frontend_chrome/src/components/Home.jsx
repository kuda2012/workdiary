import { useSelector } from "react-redux";
import "react-quill/dist/quill.snow.css";
import HomeLoggedIn from "./HomeLoggedIn";
import HomeLoggedOut from "./HomeLoggedOut";

const Home = () => {
  const worksnapToken = useSelector((state) => state.worksnap_token);

  return worksnapToken ? <HomeLoggedIn /> : <HomeLoggedOut />;
};

export default Home;
