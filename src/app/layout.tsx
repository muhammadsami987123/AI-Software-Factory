import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Software Factory — Turn Ideas Into Software With AI Agents",
  description:
    "A visual multi-agent software development workspace. Describe your product and watch specialized AI agents collaborate through the entire software development lifecycle.",
  keywords: ["AI agents", "software development", "multi-agent", "code generation", "AI engineering"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-zinc-950 text-zinc-50 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
