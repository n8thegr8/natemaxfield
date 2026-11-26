import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nate Maxfield — Maxfield Labs",
  description:
    "AI engineer at Microsoft by day. After hours: family life in Wakefield, MA with my wife Katie and two kids on the spectrum, a golden-lookalike mutt, two cats, and a pile of side quests. Maxfield Labs, FetchOil, and Stairway to STEM.",
  authors: [{ name: "Nate Maxfield" }],
  openGraph: {
    title: "Nate Maxfield — Maxfield Labs",
    description:
      "AI engineering by day. Family life, tinkering, and side quests by night.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
