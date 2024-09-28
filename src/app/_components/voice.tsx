"use client";

import { api } from "~/trpc/react";

export default function Voice({ audio }: { audio: Blob }) {
  const { data, error, isLoading } = api.audio.toText.useQuery({
    audio_file: audio,
  });

  return (
    <div>
      <h1>Voice to Text</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>{data}</p>}
    </div>
  );
}
