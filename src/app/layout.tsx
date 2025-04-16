import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Viewport } from "next";
import Script from "next/script";
import "regenerator-runtime/runtime";
import { Toaster } from "~/components/ui/toaster";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata = {
  title: "VoiceBoard - Accessible Diagramming for All",
  description:
    "Voice your ideas into diagrams in an interactive and intuitive way.",
  keywords: ["Voiceboard", "Voice", "Accessibility", "Ideas", "Collaboration"],
  openGraph: {
    title: "VoiceBoard - Accessible Diagramming for All",
    description:
      "Voice your ideas into diagrams in an interactive and intuitive way.",
    url: "https://voiceboard.app",
    type: "website",
    images: [
      {
        url: "https://voiceboard.app/logo.png",
        alt: "VoiceBoard Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceBoard - Accessible Diagramming for All",
    description:
      "Voice your ideas into diagrams in an interactive and intuitive way.",
    images: ["https://voiceboard.app/logo.png"],
  },
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "https://voiceboard.app/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#ceedab",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Script
          async
          src="https://dormdevs-analytics.vercel.app/script.js"
          data-website-id="a5f1f915-2079-490a-a28a-1064fbd57b88"
        />
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
