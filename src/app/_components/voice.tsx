"use client";
import { useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Voice = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const lastTranscriptLength = useRef(transcript.length);

  useEffect(() => {
    if (!listening) return;

    const timer = setInterval(() => {
      if (transcript.length === lastTranscriptLength.current) {
        resetTranscript();
      } else {
        lastTranscriptLength.current = transcript.length;
      }
    }, 1000); // 10 seconds

    return () => clearInterval(timer);
  }, [transcript, listening, resetTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn&apos;t support speech recognition.</span>;
  }

  return (
    <div className="p-4">
      <p className="px-2">Microphone: {listening ? "on" : "off"}</p>
      <button
        className="px-2"
        onClick={() => SpeechRecognition.startListening({ continuous: true })}
      >
        Start
      </button>
      <button
        className="px-2"
        onClick={() => SpeechRecognition.stopListening()}
      >
        Stop
      </button>
      <button className="px-2" onClick={resetTranscript}>
        Reset
      </button>
      <p>{transcript}</p>
    </div>
  );
};

export default Voice;
