import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AnalyticsWrapper } from "@repo/shell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://md-rehman.dev"),
  title: {
    default: "Planner — Interactive Kanban Task Board | MD Rehman",
    template: "%s | Planner — MD Rehman",
  },
  description:
    "Planner by MD Rehman — A fast, modern Kanban workflow and task management tool for agile developer productivity.",
  keywords: [
    "planner",
    "planner app",
    "kanban board",
    "task management",
    "trello alternative",
    "MD Rehman",
    "md-rehman planner",
  ],
  authors: [{ name: "MD Rehman", url: "https://md-rehman.dev" }],
  creator: "MD Rehman",
  alternates: {
    canonical: "https://md-rehman.dev/planner",
  },
  openGraph: {
    title: "Planner — Interactive Kanban Task Board by MD Rehman",
    description:
      "Modern Kanban board application built by MD Rehman for task organization and productivity.",
    url: "https://md-rehman.dev/planner",
    siteName: "MD Rehman Dev — Planner",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Planner — Interactive Kanban Task Board by MD Rehman",
    description:
      "Modern Kanban task board built for seamless productivity and project organization.",
    creator: "@_mdrehman",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <AnalyticsWrapper>{children}</AnalyticsWrapper>
      </body>
    </html>
  );
}
