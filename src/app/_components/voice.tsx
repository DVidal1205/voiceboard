"use client";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Voice = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  if (!isClient) {
    return null; // Render nothing on the server
  }

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn&apos;t support speech recognition.</span>;
  }

  async function quit() {
    await SpeechRecognition.stopListening();
    resetTranscript();
  }

  return (
    <div className="items h-full w-full flex-col items-center justify-between">
      <div className="w-full p-12 text-center">
        <p className="px-2 text-3xl font-bold">
          Microphone: {listening ? "on" : "off"}
        </p>
        <button
          className="px-2"
          onClick={() => SpeechRecognition.startListening({ continuous: true })}
        >
          Start
        </button>
        <button className="px-2" onClick={() => void quit()}>
          Stop
        </button>
        <button className="px-2" onClick={() => void quit()}>
          Reset
        </button>
      </div>
      <div className="flex flex-grow items-center justify-center px-12">
        {transcript && (
          <p className="rounded-xl border-2 border-slate-900 bg-slate-200 p-4 text-center text-xl text-slate-800">
            {transcript}
          </p>
        )}
      </div>
    </div>
  );
};

export default Voice;
