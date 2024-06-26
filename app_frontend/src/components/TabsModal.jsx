import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearScrollTo } from "../helpers/actionCreators";
import "../styles/TabsModal.css";

const TabsModal = ({ isTabsModalOpen, closeTabsModal, children }) => {
  if (!isTabsModalOpen) return null;
  const dispatch = useDispatch();
  const clickedSearchResult = useSelector(
    (state) => state.clicked_search_result
  );
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeTabsModal();
      if (clickedSearchResult) {
        dispatch(clearScrollTo());
      }
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
