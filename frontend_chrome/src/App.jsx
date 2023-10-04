import "./App.css";
import Navbar from "./components/Navbar";

import Home from "./components/Home";
import Router from "./Router";

function App() {
  return (
    <div>
      <Navbar />
      <Router />
      <Home />
    </div>
  );
}

export default App;
