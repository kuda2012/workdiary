import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { isWorkdiaryTokenCurrent, resetApp } from "./helpers/actionCreators";
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
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchToken = async () => {
      // Retrieve the workdiary_token from Chrome local storage
      const storedToken = await new Promise((resolve) => {
        chrome.storage.local.get("workdiary_token", (result) => {
          resolve(result.workdiary_token);
        });
      });
      // Dispatch action to set workdiary_token if it exists
      if (storedToken) {
        dispatch(isWorkdiaryTokenCurrent(storedToken));
      }
    };

    fetchToken();
  }, []);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(
    !workdiaryToken ? true : false
  );

  const [isAllPostsModalOpen, setIsAllPostsModalOpen] = useState(false);

  const [firstLoad, setFirstLoad] = useState(true);
  useEffect(() => {
    if (firstLoad) {
      setTimeout(() => {
        setFirstLoad(false);
      }, 600);
    }
  });
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openAllPostsModal = () => setIsAllPostsModalOpen(true);
  const closeAllPostsModal = () => setIsAllPostsModalOpen(false);

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
                {workdiaryToken && (
                  <span
                    id="refresh-page"
                    onClick={() => window.location.reload()}
                  >
                    Refresh page
                  </span>
                )}
              </div>
              {workdiaryToken && (
                <div className="col-1">
                  <span
                    id="logout"
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(resetApp());
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
        </>
      )}
    </div>
  );
}

export default App;
