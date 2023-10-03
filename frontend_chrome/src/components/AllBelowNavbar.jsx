import Calendar from "./Calendar";
import "../styles/AllBelowNavbar.css";

import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AllBelowNavbar = () => {
  const [value, setValue] = useState("");

  return (
    <div className="container center-row">
      <div className="row justify-content-between">
        <div className="col-md-6">
          <Calendar />
        </div>
        <div className="col-md-6">
          <ReactQuill theme="snow" value={value} onChange={setValue} />
        </div>
      </div>
    </div>
  );
};

export default AllBelowNavbar;
