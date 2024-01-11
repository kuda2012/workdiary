import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Router from "./Router";
import "./App.css";

function useGlobalErrorHandler() {
  useEffect(() => {
    const originalOnError = window.onerror;

    window.onerror = (message, source, lineno, colno, error) => {
      // Optionally log the error to an error reporting service
      console.error(message, source, lineno, colno, error);
      alert(
        `Error: ${message}. Please email contact@workdiary.me to report this issue`
      );

      // Trigger a refresh if desired

      if (originalOnError) {
        originalOnError(message, source, lineno, colno, error);
      }
    };

    return () => {
      window.onerror = originalOnError;
    };
  }, []);
}
function App() {
  useGlobalErrorHandler();
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
