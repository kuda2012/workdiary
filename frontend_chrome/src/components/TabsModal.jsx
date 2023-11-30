import React from "react";
import ReactDOM from "react-dom";
import "../styles/TabsModal.css"; // You can create your own CSS for styling

const TabsModal = ({ isTabsModalOpen, closeTabsModal, children }) => {
  if (!isTabsModalOpen) return null;
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeTabsModal();
    }
  };
  return isTabsModalOpen
    ? ReactDOM.createPortal(
        <div className="tabs-modal-overlay" onClick={handleOverlayClick}>
          <div className="tabs-modal">{children}</div>
        </div>,
        document.body
      )
    : null;
};

export default TabsModal;
