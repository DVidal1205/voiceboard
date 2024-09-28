"use client";

import { useEffect } from "react";
import Voice from "../_components/voice";

const options = {
  audioBitsPerSecond: 16000,
};

export default function Home() {
  useEffect(() => {
    async function getMedia() {
      const chunks = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorder.ondataavailable = async (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.start(250);
    }
    void getMedia();
  }, []);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <Voice audio={} />
      <div>Gorp Norp</div>
    </main>
  );
}
