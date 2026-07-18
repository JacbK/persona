import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Persona — A portfolio starter kit for coding agents",
  description: "Build a personal portfolio that feels designed around you, not filled into a template.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} antialiased bg-neutral-950 text-neutral-100`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
