import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import Script from "next/script";
import "regenerator-runtime/runtime";
import { Toaster } from "~/components/ui/toaster";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Voiceboard",
  description: "Voice your ideas into existence, accessibly.",
  keywords: ["Voiceboard", "Voice", "Accessibility", "Ideas", "Collaboration"],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <Script
        async
        src="https://dormdevs-analytics.vercel.app/script.js"
        data-website-id="a5f1f915-2079-490a-a28a-1064fbd57b88"
      />
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
