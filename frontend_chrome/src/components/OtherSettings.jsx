import { ButtonGroup, Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { changeOtherSettings } from "../helpers/actionCreators";
import ChooseMicrophone from "./ChooseMicrophone";

const OtherSettings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const workdiaryToken = useSelector((state) => state.workdiary_token);

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
          <div class="accordion" id="accordionExample">
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
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingTwo">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  Sound effects
                </button>
              </h2>
              <div
                id="collapseTwo"
                class="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                  <div
                    class="btn-group"
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
