import { useEffect, useState } from "react";

const ChooseMicrophone = () => {
  const [microphones, setMicrophones] = useState([]);
  const [selectedMicrophone, setSelectedMicrophone] = useState(null);

  function findDevicesWithSameGroupIdAsDefault(deviceArray) {
    // Find the device with "default" deviceId
    const defaultDevice = deviceArray.find(
      (device) => device.deviceId === "default"
    );
    if (!defaultDevice) {
      return null; // Return null if default device is not found
    }

    // Find devices with the same groupId as the default device, excluding the default device itself
    const devicesWithSameGroupId = deviceArray.filter(
      (device) =>
        device.groupId === defaultDevice.groupId &&
        device.deviceId !== "default"
    );
    return devicesWithSameGroupId;
  }

  useEffect(() => {
    // Fetch available media devices
    const fetchMicrophones = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(
          (device) => device.kind === "audioinput"
        );
        setMicrophones(
          audioDevices.filter((device) => device.deviceId.length >= 64)
        );
        const { current_microphone_device_id } = await chrome.storage.local.get(
          ["current_microphone_device_id"]
        );
        for (let i = 0; i < audioDevices.length; i++) {
          if (
            audioDevices[i].deviceId === "default" &&
            !current_microphone_device_id
          ) {
            const devicesWithSameGroupIdAsDefault =
              findDevicesWithSameGroupIdAsDefault(audioDevices);
            setSelectedMicrophone(devicesWithSameGroupIdAsDefault[0].deviceId);
            chrome.storage.local.set({
              current_microphone_device_id:
                devicesWithSameGroupIdAsDefault[0].deviceId,
            });
            break;
          } else if (
            audioDevices[i].deviceId === current_microphone_device_id
          ) {
            setSelectedMicrophone(current_microphone_device_id);
            break;
          }
        }
      } catch (error) {
        console.error("Error fetching microphones:", error);
      }
    };

    fetchMicrophones();
  }, []);

  const handleMicrophoneChange = (deviceId) => {
    // Update selected microphone in state
    setSelectedMicrophone(deviceId);
    // Update chrome storage
    chrome.storage.local.set({ current_microphone_device_id: deviceId });
  };

  return (
    <>
      {microphones.map((microphone) => (
        <div className="col" key={microphone.deviceId}>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="microphone"
              id={microphone.deviceId}
              value={microphone.deviceId}
              checked={selectedMicrophone === microphone.deviceId}
              onChange={() => handleMicrophoneChange(microphone.deviceId)}
            />
            <label className="form-check-label" htmlFor={microphone.deviceId}>
              {microphone.label || `Microphone ${microphone.deviceId}`}
            </label>
          </div>
        </div>
      ))}
    </>
  );
};

export default ChooseMicrophone;
