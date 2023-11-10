import React, { useState } from "react";
import ReactDOM from "react-dom";
import "../styles/HowToModal.css"; // You can create your own CSS for styling

const HowToModal = ({ isHowToModalOpen, closeHowToModal, children }) => {
  if (!isHowToModalOpen) return null;
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeHowToModal();
    }
  };
  return isHowToModalOpen
    ? ReactDOM.createPortal(
        <div className="howTo-modal-overlay" onClick={handleOverlayClick}>
          <div className="howTo-modal">{children}</div>
        </div>,
        document.body
      )
    : null;
};

export default HowToModal;
