"use client";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { api } from "~/trpc/react";

import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import { type ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import { Eraser, Mic, MicOff, Pencil } from "lucide-react";
import dynamic from "next/dynamic";
import { toast } from "~/hooks/use-toast";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
  },
);

const VoiceDraw = () => {
  const [isClient, setIsClient] = useState(false);
  const [filteredTranscript, setFilteredTranscript] = useState("");
  const [mermaid, setMermaid] = useState("");
  const [exAPI, setExAPI] = useState<ExcalidrawImperativeAPI | null>(null);

  const [gemInput, setGemInput] = useState<string>(
    "Please generate a rectangle with text that says Hello World",
  );
  const { refetch: getMermaid, data } = api.mermaid.toMer.useQuery(
    { str: gemInput, current: mermaid },
    { enabled: false },
  );

  const regen = (in2: string) => {
    setGemInput(in2);
  };
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    void getMermaid().then((res) => {
      let sp = res.data.split("\n");
      sp.splice(0, 1);
      sp.splice(sp.length - 1, sp.length);
      sp = sp.join("\n");
      console.log(sp);
      setMermaid(sp);
    });
  }, [gemInput]);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const lastTranscriptLength = useRef(transcript.length);

  useEffect(() => {
    void SpeechRecognition.startListening({ continuous: true });
  }, []);

  useEffect(() => {
    if (!listening) return;

    if (transcript) {
      // Check if "clear the board" is mentioned
      if (transcript.includes("clear the board")) {
        setMermaid("graph TD");
      }

      // Convert the transcript to an array of words (lowercase and without punctuation)
      const words = transcript
        .split(" ")
        .map((word) => word.toLowerCase().replace(/[^a-zA-Z ]/g, ""));
      console.log(words);

      // Check if "lets draw" appears in sequence in the words array
      for (let i = 0; i < words.length - 1; i++) {
        if (words[i] === "lets" && words[i + 1] === "draw") {
          // Filter the transcript from the point of "lets" (inclusive) and store it
          const filteredTranscript = words.slice(i).join(" ");
          setFilteredTranscript(filteredTranscript);
          break; // Stop once the first occurrence is found
        }
      }
    }

    const timeoutId = setTimeout(() => {
      // If no new transcript is received for 1 second, process the filteredTranscript
      if (transcript.length === lastTranscriptLength.current) {
        console.log("FILTERED: ", filteredTranscript);
        if (filteredTranscript !== "") {
          regen(filteredTranscript);
          setFilteredTranscript("");
          resetTranscript();
        }
      }
    }, 1000); // 1 second of inactivity

    // Update the length to keep track of changes
    lastTranscriptLength.current = transcript.length;

    // Cleanup timeout on every update
    return () => clearTimeout(timeoutId);
  }, [transcript, listening, resetTranscript, filteredTranscript]);

  useEffect(() => {
    void convert();
  }, [mermaid]);

  async function convert() {
    if (exAPI) {
      try {
        const { elements } = await parseMermaidToExcalidraw(mermaid);

        if (!elements) {
          return;
        }

        // currently the elements returned from the parser are in a "skeleton" format
        // which we need to convert to fully qualified excalidraw elements first
        const excalidrawElements = convertToExcalidrawElements(elements);
        exAPI.updateScene({ elements: excalidrawElements });
        exAPI.scrollToContent(excalidrawElements, { fitToViewport: true });
      } catch (err) {
        toast({
          title: "Error",
          description: "Please try again later",
        });
      }
    }
  }

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

  function test() {
    if (mermaid === "graph TD\n  A-->B") {
      setMermaid("graph TD\n  B-->A");
    } else {
      setMermaid(
        "graph LR\n  subgraph Full Adder\n    A[A] -->|A| Sum[Sum]\n    B[B] -->|B| Sum\n    Cin[Cin] -->|Cin| Sum\n    Sum --> Cout[Cout]\n    A -->|A| Carry[Carry]\n    B -->|B| Carry\n    Cin -->|Cin| Carry\n  end",
      );
    }
  }

  return (
    <div className="items between h-full w-full flex-col items-center">
      <div className="flex w-full flex-row px-12 py-8 text-center">
        <div
          className="cursor-pointer px-2 text-3xl font-bold"
          onClick={() =>
            listening
              ? reset()
              : SpeechRecognition.startListening({ continuous: true })
          }
        >
          <div
            className={`p-2 ${listening ? "rounded-full bg-red-800" : "rounded bg-violet-800"}`}
            onClick={() => setMermaid("graph TD")}
          >
            {listening ? <Mic /> : <MicOff />}
          </div>
        </div>
        <div className="flex cursor-pointer flex-row px-2 italic">
          <div
            className="rounded bg-violet-800 p-2"
            onClick={() => setMermaid("graph TD")}
          >
            <Eraser />
          </div>
          <div className="ml-4 mt-2">&quot;clear the board&quot;</div>
        </div>
        <div
          className="flex cursor-pointer flex-row px-2 italic"
          onClick={() => test()}
        >
          <div className="p-2" onClick={() => setMermaid("graph TD")}>
            <Pencil />
          </div>
          <div className="ml-4 mt-2">&quot;let&apos;s draw&quot;</div>
        </div>
      </div>
      <div className="px-12">
        <div className="h-[70vh] w-full rounded-xl border-4">
          <Excalidraw excalidrawAPI={(api) => setExAPI(api)} />
        </div>
      </div>
      <div className="flex flex-grow items-center justify-center px-12 pt-8">
        {filteredTranscript ? (
          <p className="animate-grow rounded-xl border-2 border-slate-900 bg-slate-200 p-4 text-center text-xl text-slate-800">
            {filteredTranscript}
          </p>
        ) : !listening ? (
          <div>Listening is currently disabled.</div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default VoiceDraw;
