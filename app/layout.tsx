import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DesignPilot AI — AI-Powered UX Design Prompt Generator",
  description:
    "Transform your app ideas into production-ready UI/UX design prompts. Copy-paste into v0, Bolt, Cursor, and more. Free AI-powered design consultant.",
  keywords: ["UI design", "UX design", "AI design", "v0 prompt", "Bolt prompt", "Cursor prompt", "vibe coding", "web design AI"],
  openGraph: {
    title: "DesignPilot AI — Your Idea to a Production-Ready UI Prompt",
    description: "Describe your app, answer smart questions, get a copy-paste-ready design prompt for v0, Bolt, and Cursor.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
