import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPostsList, toggleInterpreting } from "../helpers/actionCreators";
import { Blocks } from "react-loader-spinner";
import "../styles/SummaryVoice.css";

const SummaryVoice = ({ summaryText, dispatchCreateOrUpdatePost }) => {
  const user = useSelector((state) => state?.user);
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const interpreting = useSelector((state) => state.interpreting);
  const [isRecording, setIsRecording] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackPaused, setPlaybackPaused] = useState(true);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioChunks = useRef([]);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const timerRef = useRef(null);
  const audioUrlRef = useRef(null);
  const dispatch = useDispatch();

  const startRecording = async () => {
    try {
      audioStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const audioStream = audioStreamRef.current;

      mediaRecorderRef.current = new MediaRecorder(audioStream);

      const mediaRecorder = mediaRecorderRef.current;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        audioUrlRef.current = URL.createObjectURL(audioBlob);
        audioRef.current.src = audioUrlRef.current;

        audioRef.current.addEventListener("ended", () => {
          setPlaybackPaused(true);
        });
      };

      if (user.sound_effects) {
        const audio = new Audio(chrome.runtime.getURL("start_sound.mp3"));
        audio.volume = 0.25; // Get the URL to your sound fil
        audio.play();
      }

      mediaRecorder.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setAudioDuration((duration) => duration + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      if (error.message === "Requested device not found") {
        alert(
          "Please check your System Sound Settings to set a microphone input"
        );
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && !isPaused) {
      if (user.sound_effects) {
        const audio = new Audio(chrome.runtime.getURL("stop_sound.mp3"));
        audio.volume = 0.25; // Get the URL to your sound fil
        audio.play();
      }
      mediaRecorderRef.current.pause();
      clearInterval(timerRef.current);
      setIsRecording(false);
      setIsPaused(true);
    }
  };

  const pausePlayback = () => {
    if (audioUrlRef.current) {
      audioRef.current.pause();
      setPlaybackPaused(true);
    }
  };
  const playPlayback = () => {
    if (audioUrlRef.current) {
      audioRef.current.play();
      setPlaybackPaused(false);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      if (user.sound_effects) {
        const audio = new Audio(chrome.runtime.getURL("start_sound.mp3"));
        audio.volume = 1; // Get the URL to your sound fil
        audio.play();
      }
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => {
        setAudioDuration((duration) => duration + 1);
      }, 1000);
      setIsRecording(true);
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && (isRecording || isPaused)) {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
      setIsRecording(false);
      setIsFinalized(true);
      setIsPaused(false);
    }
  };

  const resetRecording = (clickedToReset) => {
    // Reset all the state variables and audio playback
    if (clickedToReset && user.sound_effects) {
      const audio = new Audio(chrome.runtime.getURL("trash.mp3"));
      audio.volume = 0.25;
      audio.play();
    }

    audioRef.current.src = "";
    clearTimeout(timerRef.current);
    setAudioDuration(0);
    audioChunks.current = [];
    mediaRecorderRef.current = null;
    setIsRecording(false);
    setIsFinalized(false);
    setIsPaused(false);
  };

  const sendAudioToBackend = () => {
    if (audioChunks.current.length === 0) {
      console.log("No audio data to send.");
      return;
    }
    if (mediaRecorderRef.current && (isRecording || isPaused)) {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
      setIsRecording(false);
      setIsPaused(false);
    }

    // Combine the audio chunks into a single Blob
    const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });

    // Convert the audio Blob to a Base64 string
    const reader = new FileReader();
    reader.onload = () => {
      const audioBase64 = reader.result;
      dispatchCreateOrUpdatePost(summaryText, audioBase64, audioDuration);
      dispatch(getPostsList(workdiaryToken, 1));
    };

    // Read the Blob as a data URL (Base64)
    reader.readAsDataURL(audioBlob, "audio/wav");
  };

  useEffect(() => {
    if (audioDuration === 180) {
      stopRecording();
    }
  }, [audioDuration]);

  useEffect(() => {
    if (!interpreting) {
      resetRecording();
    }
  }, [interpreting]);
  useEffect(() => {
    if (!user) {
      resetRecording();
    }
  }, [user]);
  return (
    <div className="mt-4" id="summary-voice">
      <h4 className="mb-4" id="summary-voice-header">
        {user
          ? `Hey, ${user.name}. Tell us. How was work today?`
          : "Hey, first_name. Tell us. How was work today?"}
      </h4>
      <div id="summary-voice-media-button">
        {!isFinalized && (
          <button
            className={`${isRecording && "is-recording"}`}
            onClick={
              !isRecording && !isPaused && !audioDuration
                ? startRecording
                : stopRecording
            }
            id="record-button"
          >
            <span
              id="record-red-dot"
              className={`${isRecording && "pulsating-red-dot"}`}
            />
            <span>
              {!isRecording && !isPaused && !audioDuration
                ? "RECORD"
                : !isPaused
                ? "RECORDING"
                : "END TO LISTEN"}
            </span>
          </button>
        )}
        {isFinalized && (
          <div className="m-3 recording-duration">
            <b>Duration: {audioDuration}s</b>
          </div>
        )}
        {!isFinalized && (
          <button onClick={!isPaused ? pauseRecording : resumeRecording}>
            {isPaused ? (
              <span className={`${isPaused && "resume-pulse"}`}>RESUME</span>
            ) : (
              <img src="/pause.png" title="Pause"></img>
            )}
          </button>
        )}
        {isFinalized && (
          <button onClick={playbackPaused ? playPlayback : pausePlayback}>
            {playbackPaused ? (
              <img src="/play.png" title="Play"></img>
            ) : (
              <img src="/pause.png" title="Pause"></img>
            )}
          </button>
        )}
        <button
          className={`${
            mediaRecorderRef.current && !isRecording && !interpreting && "send"
          }`}
          onClick={() => {
            if (mediaRecorderRef.current) {
              dispatch(toggleInterpreting());
              stopRecording();
              setTimeout(() => {
                sendAudioToBackend();
              }, 1000);
            }
          }}
          disabled={interpreting}
        >
          {!interpreting ? (
            "SEND"
          ) : (
            <Blocks
              visible={true}
              height="15"
              width="15"
              ariaLabel="blocks-loading"
              wrapperClass="blocks-wrapper"
            />
          )}
        </button>

        <button
          onClick={() => resetRecording(true)}
          disabled={!mediaRecorderRef.current || interpreting}
        >
          <img src="/trash.png" title="Reset"></img>
        </button>

        {!isFinalized && (
          <div
            id={audioDuration >= 160 && `recording-duration-too-long`}
            className="m-3 recording-duration"
          >
            <b>{audioDuration >= 160 && "(180s max) : "}</b>
            <b
              id={
                isRecording && audioDuration < 160 && `recording-duration-green`
              }
            >
              Duration: {audioDuration}s
            </b>
          </div>
        )}
        <div className="mt-3 mb-3">
          <audio controls ref={audioRef} />
        </div>
      </div>
    </div>
  );
};

export default SummaryVoice;
