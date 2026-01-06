import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"], // Enable soft and wonky axes for personality
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Maya Rodriguez | Product Designer",
  description: "Crafting intuitive interfaces and design systems at scale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${spaceGrotesk.variable} antialiased bg-[#0a1f1c] text-[#f2f0e4] selection:bg-[#ccff00] selection:text-[#0a1f1c]`}
      >
        {children}
      </body>
    </html>
  );
}