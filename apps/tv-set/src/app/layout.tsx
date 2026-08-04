import type { Metadata } from "next";
import localFont from "next/font/local";
import { AnalyticsWrapper } from "@repo/shell";
import "../styles/globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://md-rehman.dev"),
  title: {
    default: "TV Set — Interactive Canvas & Shader TV Emulator | MD Rehman",
    template: "%s | TV Set — MD Rehman",
  },
  description:
    "TV Set by MD Rehman — Interactive retro TV emulator featuring custom WebGL shaders, generative p5.js canvas visualizers, and creative coding channels.",
  keywords: [
    "tv-set",
    "tv set",
    "tv-set/0",
    "tv set channel 0",
    "retro tv emulator",
    "shader canvas visualizer",
    "generative art TV",
    "MD Rehman",
    "md-rehman tv-set",
    "rehman dev tv-set",
  ],
  authors: [{ name: "MD Rehman", url: "https://md-rehman.dev" }],
  creator: "MD Rehman",
  alternates: {
    canonical: "https://md-rehman.dev/tv-set",
  },
  openGraph: {
    title: "TV Set — Interactive Retro TV Emulator by MD Rehman",
    description:
      "Explore TV Set — interactive channel emulator with dynamic shaders, p5.js visualizers, and digital art channels.",
    url: "https://md-rehman.dev/tv-set",
    siteName: "MD Rehman Dev — TV Set",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TV Set — Interactive Retro TV Emulator by MD Rehman",
    description:
      "Experience TV Set — interactive canvas & WebGL shader channel visualizers.",
    creator: "@_mdrehman",
  },
  icons: "/tv-set/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AnalyticsWrapper>
          {children}
        </AnalyticsWrapper>
      </body>
    </html>
  );
}
