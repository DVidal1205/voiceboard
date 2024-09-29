"use client";
import { useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "regenerator-runtime/runtime";

export default function VoicePush() {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const lastTranscriptLength = useRef(transcript.length);

  useEffect(() => {
    void SpeechRecognition.startListening({ continuous: true });
  }, []);

  useEffect(() => {
    if (!listening) return;

    if (transcript) {
      // Convert the transcript to an array of words (lowercase and without punctuation)
      const words = transcript
        .split(" ")
        .map((word) => word.toLowerCase().replace(/[^a-zA-Z ]/g, ""));
      console.log(words);

      // Check if "lets draw" appears in sequence in the words array
      for (let i = 0; i < words.length - 1; i++) {
        if (words[i] === "lets" && words[i + 1] === "draw") {
          // Filter the transcript from the point of "lets" (inclusive) and store it
          break; // Stop once the first occurrence is found
        }
      }
    }

    const timeoutId = setTimeout(() => {
      // If no new transcript is received for 1 second, process the filteredTranscript
      if (transcript.length === lastTranscriptLength.current) {
        if (transcript !== "") {
          resetTranscript();
        }
      }
    }, 1000); // 1 second of inactivity

    // Update the length to keep track of changes
    lastTranscriptLength.current = transcript.length;

    // Cleanup timeout on every update
    return () => clearTimeout(timeoutId);
  }, [transcript, listening, resetTranscript]);

  return (
    <p className="mt-6 animate-fade-right text-2xl delay-1000">
      Say <span className="text-purple-500">&quot;Let&apos;s Draw&quot;</span>{" "}
      to get started.
    </p>
  );
}
