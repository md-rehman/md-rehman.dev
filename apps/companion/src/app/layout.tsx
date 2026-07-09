import type { Metadata } from "next";
import { ThemeInitializer } from "@repo/atomic-ui/atoms";
import { AnalyticsWrapper } from "@repo/shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Companion — Your Daily Partner",
  description: "Companion app — prayer tracking, daily planning, and personal growth tools.",
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
      <body>
        <ThemeInitializer />
        <AnalyticsWrapper>{children}</AnalyticsWrapper>
      </body>
    </html>
  );
}
