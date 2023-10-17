import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleInterpreting } from "../helpers/actionCreators";

const SummaryVoice = ({ summaryText, dispatchUpdatePost }) => {
  const interpreting = useSelector((state) => state.interpreting);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaybackFinished, setIsPlaybackFinished] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioChunks = useRef([]);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const timerRef = useRef(null);
  const audioUrlRef = useRef(null);
  const dispatch = useDispatch();
  const summaryVoice = useSelector((state) => state?.post?.summary_voice);

  const playSummaryVoice = () => {
    if (summaryVoice) {
      // Decode the Base64 audio data
      const decodedData = atob(summaryVoice);

      // Convert the decoded data to a Uint8Array
      const uint8Array = new Uint8Array(decodedData.length);
      for (let i = 0; i < decodedData.length; i++) {
        uint8Array[i] = decodedData.charCodeAt(i);
      }

      // Create a Blob from the Uint8Array with the appropriate MIME type
      const audioBlob = new Blob([uint8Array], { type: "audio/wav" });

      // Create an audio URL
      const audioUrl = URL.createObjectURL(audioBlob);

      // Set the audio element's source
      audioRef.current.src = audioUrl;

      // Play the audio
      audioRef.current
        .play()
        .then(() => {
          setIsPlaybackFinished(false);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
        });
    }
  };

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
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setAudioDuration((duration) => duration + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && !isPaused) {
      mediaRecorderRef.current.pause();
      clearInterval(timerRef.current);
      setIsRecording(false);
      setIsPaused(true);
      const audioBlob = new Blob(audioChunks.current, {
        type: "audio/wav",
      });
      audioUrlRef.current = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrlRef.current;
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => {
        setAudioDuration((duration) => duration + 1);
      }, 1000);
      setIsRecording(true);
    }
  };

  const playRecording = () => {
    if (audioUrlRef.current) {
      audioRef.current.src = audioUrlRef.current;
      audioRef.current.play();
      setIsPlaybackFinished(false);
    }
    setIsRecording(false);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && (isRecording || isPaused)) {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const resetRecording = () => {
    // Reset all the state variables and audio playback
    audioRef.current.src = "";
    clearTimeout(timerRef.current);
    setAudioDuration(0);
    audioChunks.current = [];
    mediaRecorderRef.current = [];
    setIsRecording(false);
    setIsPaused(false);
  };
  const handleAudioEnded = () => {
    setIsPlaybackFinished(true);
  };
  const sendAudioToBackend = () => {
    if (audioChunks.current.length === 0) {
      console.log("No audio data to send.");
      return;
    }
    dispatch(toggleInterpreting());
    // Combine the audio chunks into a single Blob
    const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });

    // Convert the audio Blob to a Base64 string
    const reader = new FileReader();
    reader.onload = () => {
      const audioBase64 = reader.result;
      dispatchUpdatePost(summaryText, audioBase64);
    };

    // Read the Blob as a data URL (Base64)
    reader.readAsDataURL(audioBlob, "audio/wav");
  };

  return (
    <div>
      <button
        onClick={playSummaryVoice} // Add this function to play the summaryVoice
        disabled={!summaryVoice || isRecording}
      >
        Play Summary Voice
      </button>
      <button
        onClick={
          !isRecording && !isPaused && !audioDuration
            ? startRecording
            : isPaused
            ? resumeRecording
            : isRecording
            ? pauseRecording
            : ""
        }
        disabled={!isPlaybackFinished}
      >
        {!isRecording && !isPaused && !audioDuration
          ? "Start Recording"
          : isPaused
          ? "Resume"
          : isRecording
          ? "Pause"
          : ""}
      </button>
      <button onClick={playRecording} disabled={!audioDuration || isRecording}>
        Play
      </button>
      <button onClick={stopRecording} disabled={!audioDuration}>
        Stop
      </button>
      <button onClick={resetRecording} disabled={!audioDuration}>
        Reset
      </button>
      <button
        onClick={sendAudioToBackend}
        disabled={!audioDuration || interpreting}
      >
        {!interpreting ? "Interpret" : "Interpreting..."}
      </button>
      <div>Recording Duration: {audioDuration} seconds</div>
      <audio controls ref={audioRef} onEnded={handleAudioEnded}></audio>
    </div>
  );
};

export default SummaryVoice;
