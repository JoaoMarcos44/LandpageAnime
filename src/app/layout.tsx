import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "MangaForge - AI Manga & Anime Creation Platform",
  description: "Forge your manga dreams with AI Sketch Assist, vector ink brushes, panel layout templates, and one-click publishing. Start sketching today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} font-sans bg-brand-bg text-slate-100 antialiased selection:bg-brand-purple selection:text-white manga-paper`}
      >
        {children}
      </body>
    </html>
  );
}
