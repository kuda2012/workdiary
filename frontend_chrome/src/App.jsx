import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Joyride from "react-joyride";
import { ThreeDots } from "react-loader-spinner";
import {
  isWorkdiaryTokenCurrent,
  resetApp,
  setStartTour,
} from "./helpers/actionCreators";
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
        `Error: ${message}. Please email contact@workdiary.me to report this issue.`
      );

      setTimeout(() => {
        window.location.reload();
      }, 2500);

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
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const first_time_login = useSelector((state) => state.first_time_login);
  const startTour = useSelector((state) => state.start_tour);
  const [firstLoad, setFirstLoad] = useState(true);
  const dispatch = useDispatch();
  if (!workdiaryToken && localStorage.getItem("workdiary_token")) {
    dispatch(isWorkdiaryTokenCurrent(localStorage.getItem("workdiary_token")));
  }

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(
    !workdiaryToken ? true : false
  );

  const [isAllPostsModalOpen, setIsAllPostsModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openAllPostsModal = () => setIsAllPostsModalOpen(true);
  const closeAllPostsModal = () => setIsAllPostsModalOpen(false);

  useEffect(() => {
    if (firstLoad) {
      setTimeout(() => {
        setFirstLoad(false);
      }, 600);
    }
  });

  const steps = [
    {
      target: ".first-step",
      content:
        "This is the calendar. Click the dropdown 🔽 to open it and navigate to different entries. Or just type in a date in the textbox. The reset 🔁 takes you back to today's date.",
      placement: "bottom",
      disableBeacon: true,
    },
    {
      disableBeacon: true,
      target: ".second-step",
      content:
        "This is where you will record your voice note and send it to off to be transcribed into an entry.",
      placement: "bottom",
    },
    {
      disableBeacon: true,
      target: ".third-step",
      content:
        "This is where you will pull your browser tabs in. Come back in the future and you can use these tabs to restart an old problem.",
      placement: "left",
    },
    {
      disableBeacon: true,
      target: ".fourth-step",
      content:
        "This is where you can search for anything in your diary. Alright, tour's over. Welcome to Workdiary!",
      placement: "left",
    },
    // Add more steps as needed
  ];

  useEffect(() => {
    if (first_time_login) {
      dispatch(setStartTour(true));
    }
  }, [first_time_login]);

  const handleStepChange = (step) => {
    if (step.index === 0 && step.lifecycle === "tooltip") {
      const getSpotlight = document.querySelector(".react-joyride__spotlight");
      getSpotlight.classList.add("__spotlight_0");
      const getFloater = document.querySelector(".__floater");
      getFloater.classList.add("__floater_0");
    }
    if (step.index === 1 && step.lifecycle === "tooltip") {
      const getSpotlight = document.querySelector(".react-joyride__spotlight");
      getSpotlight.classList.add("__spotlight_1");
      const getFloater = document.querySelector(".__floater");
      getFloater.classList.add("__floater_1");
    }
    if (step.index === 2 && step.lifecycle === "tooltip") {
      const getSpotlight = document.querySelector(".react-joyride__spotlight");
      getSpotlight.classList.add("__spotlight_2");
      const getFloater = document.querySelector(".__floater");
      getFloater.classList.add("__floater_2");
    }
    if (step.index === 3 && step.lifecycle === "tooltip") {
      const getSpotlight = document.querySelector(".react-joyride__spotlight");
      getSpotlight.classList.add("__spotlight_3");
      const getFloater = document.querySelector(".__floater");
      getFloater.classList.add("__floater_3");
    }
    if (step.action === "close") {
      // X button was clicked, skip the tour
      dispatch(setStartTour(false));
    }
    if (step.action === "reset") {
      dispatch(setStartTour(false));
    }
  };

  return (
    <div id="app">
      {firstLoad ? (
        <>
          <Navbar openAuthModal={openAuthModal} />
          <div
            id="three-dots-container"
            className="container d-flex justify-content-center align-items-center"
          >
            <div className="row">
              <div className="col">
                <ThreeDots
                  height="120px"
                  width="120px"
                  radius="6"
                  color="gray"
                  ariaLabel="loading"
                  wrapperStyle
                  wrapperClass
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="container-fluid">
            <div className="row justify-content-between">
              <div className="col-1">
                <span
                  id="refresh-page"
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </span>
              </div>
              {workdiaryToken && (
                <div className="col-1">
                  <span
                    id="logout"
                    onClick={(e) => {
                      e.preventDefault();
                      chrome.identity.clearAllCachedAuthTokens(function () {
                        dispatch(resetApp());
                      });
                    }}
                  >
                    Logout
                  </span>
                </div>
              )}
            </div>
          </div>
          <Navbar
            openAuthModal={openAuthModal}
            openAllPostsModal={openAllPostsModal}
          />

          <Router
            isAuthModalOpen={isAuthModalOpen}
            openAuthModal={openAuthModal}
            closeAuthModal={closeAuthModal}
            isAllPostsModalOpen={isAllPostsModalOpen}
            closeAllPostsModal={closeAllPostsModal}
          />
          {startTour && (
            <Joyride
              steps={steps}
              showSkipButton={true}
              continuous={true}
              showProgress={true}
              locale={{ skip: "Skip tour" }}
              callback={handleStepChange}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
