import type { Metadata } from "next";
import { DM_Serif_Display, JetBrains_Mono, Lora } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  variable: "--font-dm-serif",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DesignPilot AI",
  description: "Your idea. A few smart questions. A perfect UI prompt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSerif.variable} ${jetbrainsMono.variable} ${lora.variable} antialiased`}>
        <div className="grain-overlay" />
        {children}
      </body>
    </html>
  );
}
