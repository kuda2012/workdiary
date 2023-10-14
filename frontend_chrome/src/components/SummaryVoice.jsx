import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";

const SummaryVoice = ({ summaryText, dispatchUpdatePost }) => {
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

    // Combine the audio chunks into a single Blob
    const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });

    // Convert the audio Blob to a Base64 string
    const reader = new FileReader();
    reader.onload = () => {
      const audioBase64 = reader.result;
      dispatchUpdatePost(summaryText, audioBase64);
    };

    // Read the Blob as a data URL (Base64)
    reader.readAsDataURL(audioBlob);
  };

  return (
    <div>
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
      <button onClick={sendAudioToBackend} disabled={!audioDuration}>
        Interpret
      </button>
      <div>Recording Duration: {audioDuration} seconds</div>
      <audio controls ref={audioRef} onEnded={handleAudioEnded}></audio>
    </div>
  );
};

export default SummaryVoice;
