"use client";

import "regenerator-runtime/runtime";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const VoiceDraw = dynamic(() => import('../_components/voice'), { ssr: false });

export default function Home() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-[#ceedab] text-white">
      <VoiceDraw />
    </main>
  );
}
