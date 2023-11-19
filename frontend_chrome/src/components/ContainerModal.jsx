import React, { useState } from "react";
import ReactDOM from "react-dom";
import "../styles/ContainerModal.css"; // You can create your own CSS for styling

const ContainerModal = ({
  isContainerModalOpen,
  closeContainerModal,
  children,
}) => {
  if (!isContainerModalOpen) return null;
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeContainerModal();
    }
  };
  return isContainerModalOpen
    ? ReactDOM.createPortal(
        <div className="container-modal-overlay" onClick={handleOverlayClick}>
          <div
            className="container-modal"
            style={{ position: "relative", width: "500px" }}
          >
            {children}
          </div>
        </div>,
        document.body
      )
    : null;
};

export default ContainerModal;
