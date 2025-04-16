export const metadata = {
    title: "VoiceBoard - Accessible Diagramming for All",
    description: "Voice your ideas into diagrams in an interactive and intuitive way.",
    keywords: ["Voiceboard", "Voice", "Accessibility", "Ideas", "Collaboration"],
    openGraph: {
      title: "VoiceBoard - Accessible Diagramming for All",
      description: "Voice your ideas into diagrams in an interactive and intuitive way.",
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
      description: "Voice your ideas into diagrams in an interactive and intuitive way.",
      images: ["https://voiceboard.app/logo.png"],
    },
    viewport: "width=device-width, initial-scale=1",
    icons: {
      icon: "https://voiceboard.app/favicon.ico",
    },
  };
  
  export default function DrawLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }