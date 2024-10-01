"use client";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { api } from "~/trpc/react";

import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import { type ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import { Eraser, Loader2Icon, Mic, MicOff, Pencil } from "lucide-react";
import dynamic from "next/dynamic";
import { toast } from "~/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./../../components/ui/dialog";

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
  const [dialogOpen, setDialogOpen] = useState<boolean>(true);

  const [gemInput, setGemInput] = useState<string>(
    "Please generate a rectangle with text that says Voiceboard",
  );
  const {
    refetch: getMermaid,
    data,
    isLoading,
  } = api.mermaid.toMer.useQuery(
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
      if (!res.data) {
        return;
      }
      let sp = res.data.split("\n");
      sp.splice(0, 1);
      sp.splice(sp.length - 1, sp.length);
      sp = [sp.join("\n")];
      console.log(sp);
      setMermaid(sp.join("\n"));
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

    if (isLoading) return;

    if (transcript) {
      // Check if "clear the board" is mentioned
      if (transcript.includes("clear the board")) {
        setMermaid("graph TD");
      }

      // Convert the transcript to an array of words (lowercase and without punctuation)
      const words = transcript
        .split(" ")
        .map((word) => word.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, ""));
      console.log(words);

      // Check if "lets draw" appears in sequence in the words array
      for (let i = 0; i < words.length - 1; i++) {
        if (words[i] === "lets" && words[i + 1] === "draw") {
          // Filter the transcript from the point of "lets" (inclusive) and store it
          setDialogOpen(false);
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
    }, 2000); // 1 second of inactivity

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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              welcome to voiceboard
            </DialogTitle>
            <DialogDescription className="text-xl font-semibold">
              making whiteboarding and communicating ideas easier and accessible
              to all
            </DialogDescription>
          </DialogHeader>
          <div className="text-2xl">
            say{" "}
            <span className="font-bold text-lime-800">{'"let\'s draw"  '}</span>
            to get started...
          </div>
        </DialogContent>
      </Dialog>
      <div className="mr-4 mt-2 w-full flex-row justify-end py-2 text-center font-bold text-black lg:hidden">
        voiceboard
      </div>
      <div className="grid justify-center text-black lg:grid-cols-2">
        <div className="flex w-full flex-row px-4 py-2 text-center md:px-12 md:py-4">
          <div
            className="cursor-pointer text-3xl font-bold md:px-2"
            onClick={() =>
              listening
                ? reset()
                : SpeechRecognition.startListening({ continuous: true })
            }
          >
            <div
              className={`relative mr-2 p-2 transition duration-200 ease-in-out ${listening ? "rounded-full bg-red-800 text-white" : "rounded bg-yellow-200"}`}
            >
              {listening ? (
                <div>
                  <Mic />
                  <span className="absolute left-0 top-0 inline-flex h-full w-full animate-ping rounded-full bg-red-700 opacity-75"></span>
                </div>
              ) : (
                <MicOff />
              )}
            </div>
          </div>
          <div className="flex cursor-pointer flex-row px-1 italic md:px-2">
            <div
              className="rounded bg-yellow-200 p-2"
              onClick={() => setMermaid("graph TD")}
            >
              <Eraser />
            </div>
            <div className="ml-4 mt-2 text-sm md:text-base">
              &quot;clear the board&quot;
            </div>
          </div>
          <div className="flex flex-row px-1 italic md:px-2">
            <div className="p-2">
              <Pencil />
            </div>
            <div className="ml-4 mt-2 text-sm md:text-base">
              &quot;let&apos;s draw&quot;
            </div>
          </div>
        </div>
        <div className="mr-4 mt-2 hidden w-full flex-row justify-end px-12 py-4 text-center font-bold lg:flex">
          voiceboard
        </div>
      </div>
      <div className="px-4 md:px-12">
        <div className="relative h-[88vh] w-full rounded-xl border-4 border-white bg-white shadow-lg">
          <Excalidraw excalidrawAPI={(api) => setExAPI(api)} />
          <div className="flex flex-grow items-center justify-center px-12 pt-8 text-black">
            {filteredTranscript || !listening ? (
              <p className="animate-grow absolute bottom-20 z-20 rounded-xl bg-zinc-900 p-4 text-center text-xl text-white opacity-40 md:bottom-4">
                <div className="opacity-100">
                  {filteredTranscript ? (
                    filteredTranscript
                  ) : !listening ? (
                    <MicOff />
                  ) : (
                    ""
                  )}
                </div>
              </p>
            ) : (
              <div />
            )}
            {isLoading && (
              <div className="absolute bottom-1/2 z-20 flex flex-row rounded-xl bg-zinc-900 px-2 italic opacity-40">
                <div className="p-2">
                  <Loader2Icon className="animate-spin stroke-white opacity-100" />
                </div>
                <div className="ml-2 mt-2 text-white opacity-100">
                  loading...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceDraw;
