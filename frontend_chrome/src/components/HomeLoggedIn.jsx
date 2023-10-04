import Calendar from "./Calendar";
import "../styles/HomeLoggedIn.css";
import "react-quill/dist/quill.snow.css";
import SummaryTextArea from "./SummaryTextArea";

const HomeLoggedIn = () => {
  return (
    <div className="container center-row">
      <div className="row justify-content-between">
        <div className="col-md-6">
          <Calendar />
        </div>
        <div className="col-md-6">
          <SummaryTextArea />
        </div>
      </div>
    </div>
  );
};

export default HomeLoggedIn;
