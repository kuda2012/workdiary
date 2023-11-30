import React from "react";
import ReactDOM from "react-dom";
import "../styles/TagsModal.css"; // You can create your own CSS for styling

const TagsModal = ({ isTagsModalOpen, closeTagsModal, children }) => {
  if (!isTagsModalOpen) return null;
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeTagsModal();
    }
  };
  return isTagsModalOpen
    ? ReactDOM.createPortal(
        <div className="tags-modal-overlay" onClick={handleOverlayClick}>
          <div className="tags-modal">{children}</div>
        </div>,
        document.body
      )
    : null;
};

export default TagsModal;
