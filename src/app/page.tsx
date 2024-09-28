import Image from "next/image";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="flex w-full items-center justify-between px-52">
          <div>
            <h1 className="animate-fade-right text-7xl font-bold delay-100">
              Voice<span className="text-purple-500">Draw</span>
            </h1>
            <p className="animate-fade-right mt-6 text-2xl delay-700">
              Making whiteboardng accessible to everyone.{" "}
            </p>
            <p className="animate-fade-right mt-6 text-2xl delay-1000">
              Say{" "}
              <span className="text-purple-500">
                &quot;Let&apos;s Draw&quot;
              </span>{" "}
              to get started.
            </p>
          </div>
          <div className="animate-fade-left relative aspect-video h-96 delay-100">
            <Image
              src="/hero.png"
              alt="Demo Diagram"
              layout="fill"
              objectFit="cover"
              className="rounded-xl"
            />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
