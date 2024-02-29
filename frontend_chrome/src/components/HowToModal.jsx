import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { showHowToModal } from "../helpers/actionCreators";
import "../styles/HowToModal.css";

const HowToModal = ({ isHowToModalOpen, closeHowToModal, children }) => {
  const dispatch = useDispatch();
  const first_time_login = useSelector((state) => state.first_time_login);
  if (!isHowToModalOpen) return null;
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeHowToModal();
      if (first_time_login) {
        dispatch(showHowToModal(false));
      }
    }
  };
  return isHowToModalOpen
    ? ReactDOM.createPortal(
        <div className="how-to-modal-overlay" onClick={handleOverlayClick}>
          <div className="how-to-modal">{children}</div>
        </div>,
        document.body
      )
    : null;
};

export default HowToModal;
