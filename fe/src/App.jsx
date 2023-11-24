import "./App.css";
import Navbar from "./components/Navbar";
import Router from "./Router";
import { useState } from "react";

function App() {
  const [isHowToModalOpen, setIsHowToModalOpen] = useState(false);
  const openHowToModal = () => setIsHowToModalOpen(true);
  const closeHowToModal = () => setIsHowToModalOpen(false);
  return (
    <>
      <Navbar openHowToModal={openHowToModal} />
      <Router
        isHowToModalOpen={isHowToModalOpen}
        closeHowToModal={closeHowToModal}
      />
    </>
  );
}

export default App;
