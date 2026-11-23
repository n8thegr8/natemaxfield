import type { Metadata } from "next";
import { Inter_Tight, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nate Maxfield — Maxfield Labs",
  description:
    "AI engineer at Microsoft by day. After hours: family life in Wakefield, MA with my wife Katie and two kids on the spectrum, a Golden Retriever, two cats, and a pile of side quests. Maxfield Labs, FetchOil, and Stairway to STEM.",
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
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}
