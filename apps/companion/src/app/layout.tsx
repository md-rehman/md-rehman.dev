import type { Metadata } from "next";
import { ThemeInitializer } from "@repo/atomic-ui/atoms";
import { AnalyticsWrapper } from "@repo/shell";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://md-rehman.dev"),
  title: {
    default: "Companion — Daily Islamic Companion & Prayer Tracker | MD Rehman",
    template: "%s | Companion — MD Rehman",
  },
  description:
    "Companion by MD Rehman — Personal daily Islamic companion app featuring accurate prayer timing calculations, habit tracking, daily goals, and spiritual productivity tools.",
  keywords: [
    "companion",
    "companion app",
    "companion web",
    "islamic companion app",
    "prayer tracker",
    "daily islamic planner",
    "prayer timings",
    "MD Rehman",
    "md-rehman companion",
  ],
  authors: [{ name: "MD Rehman", url: "https://md-rehman.dev" }],
  creator: "MD Rehman",
  alternates: {
    canonical: "https://md-rehman.dev/companion",
  },
  openGraph: {
    title: "Companion — Daily Islamic Companion & Prayer Tracker by MD Rehman",
    description:
      "Companion app — prayer tracking, daily habit logging, and personal growth tools built by MD Rehman.",
    url: "https://md-rehman.dev/companion",
    siteName: "MD Rehman Dev — Companion",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Companion — Daily Islamic Companion & Prayer Tracker by MD Rehman",
    description:
      "Companion app — prayer tracking, daily habit logging, and spiritual productivity tools.",
    creator: "@_mdrehman",
  },
  icons: {
    icon: "/companion/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeInitializer defaultTheme="dark-glitch" />
        <AnalyticsWrapper>{children}</AnalyticsWrapper>
      </body>
    </html>
  );
}
