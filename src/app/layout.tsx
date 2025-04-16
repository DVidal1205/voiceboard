import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import Script from "next/script";
import "regenerator-runtime/runtime";
import { Toaster } from "~/components/ui/toaster";
import { TRPCReactProvider } from "~/trpc/react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head>
        <title>VoiceBoard - Accessible Diagramming for All</title>
        <meta
          name="description"
          content="Voice your ideas into diagrams in an interactive and intuitive way."
        />
        <meta
          name="keywords"
          content="Voiceboard, Voice, Accessibility, Ideas, Collaboration"
        />
        <meta name="theme-color" content="#ceedab" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="VoiceBoard - Accessible Diagramming for All"
        />
        <meta
          property="og:description"
          content="Voice your ideas into diagrams in an interactive and intuitive way."
        />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-domain.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="VoiceBoard - Accessible Diagramming for All"
        />
        <meta
          name="twitter:description"
          content="Voice your ideas into diagrams in an interactive and intuitive way."
        />
        <meta name="twitter:image" content="/logo.png" />
        <link rel="icon" href="/favicon.ico" />
      </head>
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
