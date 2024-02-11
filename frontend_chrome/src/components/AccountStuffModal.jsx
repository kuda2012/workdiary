import ReactDOM from "react-dom";
import "../styles/AccountStuffModal.css";

const AccountStuffModal = ({
  isAccountStuffModalOpen,
  closeAccountStuffModal,
  children,
}) => {
  if (!isAccountStuffModalOpen) return null;
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeAccountStuffModal();
    }
  };
  return isAccountStuffModalOpen
    ? ReactDOM.createPortal(
        <div className="settings-modal-overlay" onClick={handleOverlayClick}>
          <div className="settings-modal">{children}</div>
        </div>,
        document.body
      )
    : null;
};

export default AccountStuffModal;
