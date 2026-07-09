import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeInitializer } from "@repo/atomic-ui/atoms";
import { AnalyticsWrapper } from "@repo/shell";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Mohd. Rehman Baig — Senior React & React Native Engineer",
  description:
    "Personal portfolio and monorepo hub of Mohd. Rehman Baig. Senior React & React Native Engineer with 7+ years of experience in design systems, cross-platform architecture, and developer tooling.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeInitializer />
        <AnalyticsWrapper>{children}</AnalyticsWrapper>
      </body>
    </html>
  );
}
