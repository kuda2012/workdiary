import ReactDOM from "react-dom";
import "../styles/SettingsModal.css";

const SettingsModal = ({
  isSettingsModalOpen,
  closeSettingsModal,
  children,
}) => {
  if (!isSettingsModalOpen) return null;
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeSettingsModal();
    }
  };
  return isSettingsModalOpen
    ? ReactDOM.createPortal(
        <div className="settings-modal-overlay" onClick={handleOverlayClick}>
          <div className="settings-modal">{children}</div>
        </div>,
        document.body
      )
    : null;
};

export default SettingsModal;
