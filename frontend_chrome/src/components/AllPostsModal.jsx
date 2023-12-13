import React from "react";
import ReactDOM from "react-dom";
import "../styles/AllPostsModal.css";

const AllPostsModal = ({
  isAllPostsModalOpen,
  closeAllPostsModal,
  children,
}) => {
  if (!isAllPostsModalOpen) return null;
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeAllPostsModal();
    }
  };
  return isAllPostsModalOpen
    ? ReactDOM.createPortal(
        <div className="allposts-modal-overlay" onClick={handleOverlayClick}>
          <div className="allposts-modal">{children}</div>
        </div>,
        document.body
      )
    : null;
};

export default AllPostsModal;
