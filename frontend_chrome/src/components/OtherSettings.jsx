import { useDispatch, useSelector } from "react-redux";
import { ButtonGroup, Button } from "reactstrap";
import ChooseMicrophone from "./ChooseMicrophone";
import { changeOtherSettings } from "../helpers/actionCreators";

const OtherSettings = () => {
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSwitchToggle = () => {
    dispatch(
      changeOtherSettings(workdiaryToken, {
        sound_effects: !user.sound_effects,
      })
    );
  };
  return (
    <div className="dropdown">
      <button
        className="dropdown-toggle dropdown-toggle-settings-modal-buttons"
        id="other-settings-dropdown-button"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        data-target="#other-settings-dropdown-button"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <img src="/settings-dark-1.png"></img>
        <div>Sound settings</div>
      </button>
      <div
        id="other-settings-dropdown-menu"
        className="dropdown-menu"
        aria-labelledby="other-settings-dropdown-button"
      >
        {user && (
          <div className="accordion" id="accordionExample">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="false"
                  aria-controls="collapseOne"
                >
                  Choose Microphone
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <div className="row">
                    <ChooseMicrophone />
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  Media buttons: <br></br> Sound effects
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Toggle Switch"
                  >
                    <ButtonGroup>
                      <Button
                        color={user.sound_effects ? "success" : "secondary"}
                        onClick={() => handleSwitchToggle(user.sound_effects)}
                      >
                        On
                      </Button>
                      <Button
                        color={user.sound_effects ? "secondary" : "danger"}
                        onClick={() => handleSwitchToggle(user.sound_effects)}
                      >
                        Off
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtherSettings;
