"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/draw");
  }, [router]);

  return (
    <main className="flex h-screen items-center justify-center bg-[#ceedab] text-black">
      <p>redirecting to the fun...</p>
    </main>
  );
}
