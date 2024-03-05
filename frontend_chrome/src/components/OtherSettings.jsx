import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ButtonGroup, Button } from "reactstrap";
import ChooseMicrophone from "./ChooseMicrophone";

const OtherSettings = () => {
  const user = useSelector((state) => state.user);
  const [soundEffects, setSoundEffects] = useState(false);

  useEffect(() => {
    // Fetch initial state from Chrome storage when component mounts
    const fetchData = async () => {
      const { sound_effects } = await chrome.storage.local.get("sound_effects");
      setSoundEffects(sound_effects);
    };
    fetchData();
  }, []);
  const handleSwitchToggle = async () => {
    // Toggle sound effects
    const newSoundEffects = !soundEffects;
    setSoundEffects(newSoundEffects);
    // Update Chrome storage
    await chrome.storage.local.set({ sound_effects: newSoundEffects });
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
                  Sound effects
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
                        color={soundEffects ? "success" : "secondary"}
                        onClick={() => handleSwitchToggle(soundEffects)}
                      >
                        On
                      </Button>
                      <Button
                        color={soundEffects ? "secondary" : "danger"}
                        onClick={() => handleSwitchToggle(soundEffects)}
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
