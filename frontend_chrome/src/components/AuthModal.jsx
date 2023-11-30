import React from "react";
import ReactDOM from "react-dom";
import "../styles/AuthModal.css";

const AuthModal = ({ isAuthModalOpen, closeAuthModal, children }) => {
  if (!isAuthModalOpen) return null;
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeAuthModal();
    }
  };
  return isAuthModalOpen
    ? ReactDOM.createPortal(
        <div className="auth-modal-overlay" onClick={handleOverlayClick}>
          <div
            className="auth-modal"
            style={{ position: "relative", width: "500px" }}
          >
            {children}
          </div>
        </div>,
        document.body
      )
    : null;
};

export default AuthModal;
