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
  metadataBase: new URL("https://md-rehman.dev"),
  title: {
    default: "MD Rehman (md-rehman) — Senior React & React Native Developer",
    template: "%s | MD Rehman",
  },
  description:
    "Official website & portfolio of MD Rehman (Mohd. Rehman Baig), Senior React & React Native Developer. Specializing in cross-platform engineering, design systems, and mobile architecture.",
  keywords: [
    "MD Rehman",
    "Md Rehman",
    "md-rehman",
    "rehman dev",
    "md rehman dev",
    "developer rehman",
    "rehman react native",
    "Mohd. Rehman Baig",
    "Senior React Native Developer",
    "Senior React Developer",
  ],
  authors: [{ name: "MD Rehman", url: "https://md-rehman.dev" }],
  creator: "MD Rehman",
  publisher: "MD Rehman",
  alternates: {
    canonical: "https://md-rehman.dev",
  },
  openGraph: {
    title: "MD Rehman (md-rehman) — Senior React & React Native Developer",
    description:
      "Official portfolio and personal hub of MD Rehman (rehman dev). Senior React & React Native Engineer with 7+ years of experience.",
    url: "https://md-rehman.dev",
    siteName: "MD Rehman Dev",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MD Rehman (md-rehman) — Senior React & React Native Developer",
    description:
      "Official portfolio of MD Rehman (rehman dev). Senior React & React Native Engineer.",
    creator: "@_mdrehman",
  },
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    google: "sxOiWLRDa1j3ofGcM8vq9IpuIWLBlJTv47gffUDjcIE",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://md-rehman.dev/#person",
      "name": "MD Rehman",
      "alternateName": [
        "Md Rehman",
        "md-rehman",
        "Rehman Dev",
        "MD Rehman Dev",
        "Developer Rehman",
        "Rehman React Native",
        "Mohd. Rehman Baig",
      ],
      "url": "https://md-rehman.dev",
      "image": "https://md-rehman.dev/favicon.ico",
      "jobTitle": "Senior React & React Native Developer",
      "worksFor": {
        "@type": "Organization",
        "name": "NativeBase Contributor & Senior Frontend Architect",
      },
      "sameAs": [
        "https://github.com/md-rehman",
        "https://linkedin.com/in/md-rehman",
        "https://x.com/_mdrehman",
        "https://www.instagram.com/_mdrehman",
      ],
      "knowsAbout": [
        "React",
        "React Native",
        "Next.js",
        "TypeScript",
        "Design Systems",
        "Cross-Platform Mobile Infrastructure",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://md-rehman.dev/#website",
      "url": "https://md-rehman.dev",
      "name": "MD Rehman Dev",
      "description":
        "Official Portfolio & Projects Hub of MD Rehman (md-rehman)",
      "publisher": {
        "@id": "https://md-rehman.dev/#person",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://md-rehman.dev/tv-set/#application",
      "name": "TV Set — Interactive Retro TV Emulator",
      "operatingSystem": "Web, iOS, Android",
      "applicationCategory": "MultimediaApplication",
      "url": "https://md-rehman.dev/tv-set/0",
      "description":
        "Interactive TV emulator featuring custom WebGL shaders, generative canvas visualizers, and creative coding channels.",
      "author": {
        "@id": "https://md-rehman.dev/#person",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://md-rehman.dev/companion/#application",
      "name": "Companion — Daily Prayer & Growth Tracker",
      "operatingSystem": "Web, iOS, Android",
      "applicationCategory": "LifestyleApplication",
      "url": "https://md-rehman.dev/companion",
      "description":
        "Personal daily Islamic companion app for prayer timing calculation and spiritual goal tracking.",
      "author": {
        "@id": "https://md-rehman.dev/#person",
      },
    },
    {
      "@type": "ItemList",
      "@id": "https://md-rehman.dev/#sitelinks",
      "name": "Featured Applications",
      "itemListElement": [
        {
          "@type": "SiteNavigationElement",
          "position": 1,
          "name": "TV Set Channel 0",
          "description": "Interactive Retro TV Channel & Shader Visualizer",
          "url": "https://md-rehman.dev/tv-set/0",
        },
        {
          "@type": "SiteNavigationElement",
          "position": 2,
          "name": "Companion App",
          "description": "Daily Prayer Tracker & Spiritual Growth Partner",
          "url": "https://md-rehman.dev/companion",
        },
        {
          "@type": "SiteNavigationElement",
          "position": 3,
          "name": "Planner App",
          "description": "Interactive Kanban Task Management Board",
          "url": "https://md-rehman.dev/planner",
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeInitializer />
        <AnalyticsWrapper>{children}</AnalyticsWrapper>
      </body>
    </html>
  );
}
