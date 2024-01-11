import ReactDOM from "react-dom";
import "../styles/DeletePostModal.css"; // You can create your own CSS for styling

const DeletePostModal = ({
  isDeletePostModalOpen,
  closeDeletePostModal,
  children,
}) => {
  if (!isDeletePostModalOpen) return null;
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeDeletePostModal();
    }
  };
  return isDeletePostModalOpen
    ? ReactDOM.createPortal(
        <div className="delete-post-modal-overlay" onClick={handleOverlayClick}>
          <div className="delete-post-modal">{children}</div>
        </div>,
        document.body
      )
    : null;
};

export default DeletePostModal;
