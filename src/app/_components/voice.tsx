"use client";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Voice = () => {
  const [isClient, setIsClient] = useState(false);
  const [filteredTranscript, setFilteredTranscript] = useState("");

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
        setFilteredTranscript("");
        resetTranscript();
      } else {
        lastTranscriptLength.current = transcript.length;
      }
    }, 1000); // 1 seconds

    return () => clearInterval(timer);
  }, [transcript, listening, resetTranscript]);

  useEffect(() => {
    if (transcript) {
      // Convert the transcript to an array of words instead of an array of letters
      // make all words lowercase and remove punctuation
      const words = transcript
        .split(" ")
        .map((word) => word.toLowerCase().replace(/[^a-zA-Z ]/g, ""));
      console.log(words);

      // Check if the words "lets draw" are in the words without punctuation, next to each other
      const wordsPresent = words.includes("lets") && words.includes("draw");
      if (!wordsPresent) return;
      // grab the index of the LAST occurrence of "lets" and the LAST occurrence of "draw"
      const letsIndex = words.lastIndexOf("lets");
      const drawIndex = words.lastIndexOf("draw");
      const letsDraw = letsIndex + 1 === drawIndex;

      // Only set the filtered transcript if the first two words are "lets draw"
      if (letsDraw) {
        // Add all of the words after "lets draw" to the filtered transcript
        const filteredTranscript = words
          .slice(words.lastIndexOf("lets"))
          .join(" ");
        setFilteredTranscript(filteredTranscript);
      }
    }
  }, [transcript]);

  if (!isClient) {
    return null; // Render nothing on the server
  }

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn&apos;t support speech recognition.</span>;
  }

  async function reset() {
    await SpeechRecognition.stopListening();
    setFilteredTranscript("");
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
        <button className="px-2" onClick={() => void reset()}>
          Stop
        </button>
        <button className="px-2" onClick={() => void reset()}>
          Reset
        </button>
      </div>
      <div className="flex flex-grow items-center justify-center px-12">
        {filteredTranscript && (
          <p className="rounded-xl border-2 border-slate-900 bg-slate-200 p-4 text-center text-xl text-slate-800">
            {filteredTranscript}
          </p>
        )}
      </div>
    </div>
  );
};

export default Voice;
