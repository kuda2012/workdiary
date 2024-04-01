import "../styles/AuthModal.css";

const AuthModalHeader = ({ openHowToModal }) => {
  return (
    <div className="row justify-content-between">
      <div className="col">
        <h1 id="header-how-to-auth-modal-header">Workdiary</h1>
      </div>
      <div className="col">
        <span
          id="span-how-to-auth-modal-header"
          onClick={() => {
            openHowToModal();
          }}
          className="unclickable-exception-elements"
        >
          <b id="bold-how-to-auth-modal-header">About</b>
        </span>
      </div>
    </div>
  );
};

export default AuthModalHeader;
