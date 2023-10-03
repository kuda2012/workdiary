import "./App.css";
import Navbar from "./components/Navbar";

import AllBelowNavbar from "./components/AllBelowNavbar";
import Router from "./Router";

function App() {
  return (
    <div>
      <Navbar />
      <Router />
      <AllBelowNavbar />
    </div>
  );
}

export default App;
