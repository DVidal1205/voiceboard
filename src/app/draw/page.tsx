"use client";

import "regenerator-runtime/runtime";
import VoiceDraw from "../_components/voice";

export default function Home() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-[#ceedab] text-white">
      <VoiceDraw />
    </main>
  );
}
