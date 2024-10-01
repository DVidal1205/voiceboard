"use client";

import dynamic from "next/dynamic";
import "regenerator-runtime/runtime";

const VoiceDraw = dynamic(() => import("../_components/voice"), { ssr: false });

export default function Home() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#ceedab] text-white">
      <VoiceDraw />
    </main>
  );
}
