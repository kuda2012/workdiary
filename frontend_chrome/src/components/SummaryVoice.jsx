import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPostsList, toggleInterpreting } from "../helpers/actionCreators";
import "../styles/SummaryVoice.css";
import { Blocks } from "react-loader-spinner";

const SummaryVoice = ({ summaryText, dispatchUpdatePost }) => {
  const userAccountInfo = useSelector((state) => state?.user);
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const interpreting = useSelector((state) => state.interpreting);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioChunks = useRef([]);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaRecorderRefForPlayback = useRef(null);
  const audioStreamRefForPlayback = useRef(null);
  const audioStreamRef = useRef(null);
  const timerRef = useRef(null);
  const audioUrlRef = useRef(null);
  const dispatch = useDispatch();

  const startRecording = async () => {
    try {
      audioStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      audioStreamRefForPlayback.current =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      const audioStream = audioStreamRef.current;
      const audioStreamForPlayback = audioStreamRefForPlayback.current;

      mediaRecorderRef.current = new MediaRecorder(audioStream);
      mediaRecorderRefForPlayback.current = new MediaRecorder(
        audioStreamForPlayback
      );
      const mediaRecorder = mediaRecorderRef.current;
      const mediaRecorderForPlayback = mediaRecorderRefForPlayback.current;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        audioUrlRef.current = URL.createObjectURL(audioBlob);
        audioRef.current.src = audioUrlRef.current;
      };

      mediaRecorderForPlayback.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorderForPlayback.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, {
          type: "audio/wav",
        });
        audioUrlRef.current = URL.createObjectURL(audioBlob);
        audioRef.current.src = audioUrlRef.current;
      };
      const audio = new Audio(chrome.runtime.getURL("start_sound.mp3"));
      audio.volume = 1; // Get the URL to your sound fil
      audio.play();
      mediaRecorder.start();
      mediaRecorderForPlayback.start();
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
      const audio = new Audio(chrome.runtime.getURL("stop_sound.mp3"));
      audio.volume = 1; // Get the URL to your sound fil
      audio.play();
      mediaRecorderRef.current.pause();
      mediaRecorderRefForPlayback.current.stop();
      clearInterval(timerRef.current);
      setIsRecording(false);
      setIsPaused(true);
      // const audioBlob = new Blob(audioChunks.current, {
      //   type: "audio/wav",
      // });
      // audioUrlRef.current = URL.createObjectURL(audioBlob);
      // audioRef.current.src = audioUrlRef.current;
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      const audio = new Audio(chrome.runtime.getURL("start_sound.mp3"));
      audio.volume = 1; // Get the URL to your sound fil
      audio.play();
      mediaRecorderRef.current.resume();
      mediaRecorderRefForPlayback.current.start();
      audioRef.current.pause();
      audioRef.current.currentTie = 0;
      timerRef.current = setInterval(() => {
        setAudioDuration((duration) => duration + 1);
      }, 1000);
      setIsRecording(true);
      setIsPaused(false);
    }
  };

  const playRecording = () => {
    if (audioUrlRef.current) {
      audioRef.current.src = audioUrlRef.current;
      audioRef.current.play();
    }
    setIsRecording(false);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && (isRecording || isPaused)) {
      mediaRecorderRef.current.stop();
      mediaRecorderRefForPlayback.current.stop();
      clearInterval(timerRef.current);
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const resetRecording = (clickedToReset) => {
    // Reset all the state variables and audio playback
    if (clickedToReset) {
      const audio = new Audio(chrome.runtime.getURL("trash.mp3"));
      audio.volume = 1;
      audio.play();
    }

    audioRef.current.src = "";
    clearTimeout(timerRef.current);
    setAudioDuration(0);
    audioChunks.current = [];
    mediaRecorderRef.current = [];
    setIsRecording(false);
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
      dispatchUpdatePost(summaryText, audioBase64, audioDuration);
      dispatch(getPostsList(workdiaryToken, 1));
      resetRecording();
    };

    // Read the Blob as a data URL (Base64)
    reader.readAsDataURL(audioBlob, "audio/wav");
  };

  useEffect(() => {
    if (audioDuration === 180) {
      stopRecording();
    }
  }, [audioDuration]);
  return (
    <div className="mt-5" id="summary-voice">
      <h4 className="mb-4">
        {userAccountInfo
          ? `Hey, ${
              userAccountInfo.name.match(/(\w+)/)[0]
            }. Tell us. How was work today?`
          : "Hey, first_name. Tell us. How was work today?"}
      </h4>
      <div>
        <button
          className={`${isRecording && "is-recording"}`}
          onClick={
            !isRecording && !isPaused && !audioDuration
              ? startRecording
              : isRecording && !isPaused
              ? pauseRecording
              : resumeRecording
          }
          disabled={audioDuration && !isPaused && !isRecording}
          id="record-button"
        >
          <span
            id="record-red-dot"
            className={`${isRecording && "pulsating-red-dot"}`}
          />
          <span>
            {!isRecording && !isPaused && !audioDuration
              ? "RECORD"
              : isRecording && !isPaused
              ? "RECORDING"
              : "RESUME"}
          </span>
        </button>
        <button onClick={pauseRecording} disabled={!isRecording}>
          <img src="/pause.png" title="Pause"></img>
        </button>
        <button
          onClick={playRecording}
          disabled={!audioDuration || isRecording}
        >
          <img src="/play_1.png" title="Play"></img>
        </button>
        <button onClick={() => resetRecording(true)} disabled={!audioDuration}>
          <img src="/trash_1.png" title="Reset"></img>
        </button>
        <button
          className={`${
            audioDuration && !isRecording && !interpreting && "send"
          }`}
          onClick={() => {
            if (audioDuration) {
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
      </div>
      <div
        id={audioDuration >= 5 && `recording-duration-too-long`}
        className="m-3 recording-duration"
      >
        <b>{audioDuration >= 5 && "(180s max) : "}</b>
        <b
          id={
            isRecording &&
            `recording-duration-green` &&
            isRecording &&
            audioDuration < 5 &&
            `recording-duration-green`
          }
        >
          {audioDuration}s
        </b>
      </div>
      <div className="mb-5">
        <audio controls ref={audioRef} />
      </div>
    </div>
  );
};

export default SummaryVoice;
