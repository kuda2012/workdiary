const AuthModalHeader = ({ openHowToModal }) => {
  return (
    <div className="row justify-content-between">
      <div className="col">
        <h1 style={{ textTransform: "none" }}>Work Diary</h1>
      </div>
      <div className="col">
        <span
          style={{
            cursor: "pointer",
            position: "relative",
            left: "150px",
          }}
          onClick={() => {
            openHowToModal();
          }}
          className="unclickable-exception-elements"
        >
          <b style={{ textDecoration: "underline" }}>About</b>
        </span>
      </div>
    </div>
  );
};

export default AuthModalHeader;
