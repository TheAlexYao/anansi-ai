import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], display: "swap", variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], display: "swap", variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://anansi-mauve.vercel.app"),
  title: "Anansi — the visual storytelling agent for Runway",
  description: "A creative producer for AI video. Five agents weave a 30-second film stakeholders take seriously. One install. Built for the Runway API hackathon.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-256.png", sizes: "256x256", type: "image/png" }
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
  },
  openGraph: {
    title: "Anansi — the visual storytelling agent for Runway",
    description: "Bring the brief. Anansi weaves the film. Five agents, one cut.",
    images: [{ url: "/og.jpg", width: 1408, height: 768, alt: "Anansi aperture brand mark" }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Anansi — the visual storytelling agent for Runway",
    description: "Bring the brief. Anansi weaves the film. Five agents, one cut.",
    images: ["/og.jpg"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
