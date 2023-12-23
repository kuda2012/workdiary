import React from "react";
import ReactDOM from "react-dom";
import "../styles/TagsModal.css"; // You can create your own CSS for styling
import { useDispatch, useSelector } from "react-redux";
import { clearScrollTo } from "../helpers/actionCreators";

const TagsModal = ({ isTagsModalOpen, closeTagsModal, children }) => {
  if (!isTagsModalOpen) return null;
  const dispatch = useDispatch();
  const clickedSearchResult = useSelector(
    (state) => state.clicked_search_result
  );
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeTagsModal();
      if (clickedSearchResult) {
        dispatch(clearScrollTo());
      }
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
