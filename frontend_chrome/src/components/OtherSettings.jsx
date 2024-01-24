import { ButtonGroup, Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { changeOtherSettings } from "../helpers/actionCreators";

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
        <div>Settings</div>
      </button>
      <div
        id="other-settings-dropdown-menu"
        className="dropdown-menu"
        aria-labelledby="other-settings-dropdown-button"
      >
        {user && (
          <div class="accordion" id="accordionExample">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  Sound effects
                </button>
              </h2>
              <div
                id="collapseOne"
                class="accordion-collapse collapse show"
                aria-labelledby="headingOne"
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
