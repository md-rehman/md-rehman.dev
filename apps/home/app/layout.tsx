import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeInitializer } from "@repo/ui";
import { AnalyticsWrapper } from "@repo/shell";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  display: "swap",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://md-rehman.dev"),
  title: {
    default: "Mohd. Rehman Baig (md-rehman) — Senior React & React Native Architect",
    template: "%s | md-rehman",
  },
  description:
    "Official website & portfolio of md-rehman (Mohd. Rehman Baig), Senior React & React Native Developer. Specializing in cross-platform engineering, design systems, and mobile architecture.",
  keywords: [
    "md-rehman",
    "md-rehman dev",
    "md rehman",
    "Mohd Rehman Baig",
    "MD Rehman",
    "rehman dev",
    "developer rehman",
    "Mohd. Rehman Baig",
    "rehman react native",
    "Senior React Native Developer",
    "Senior React Developer",
  ],
  authors: [{ name: "Mohd. Rehman Baig (md-rehman)", url: "https://md-rehman.dev" }],
  creator: "md-rehman",
  publisher: "md-rehman",
  alternates: {
    canonical: "https://md-rehman.dev",
  },
  openGraph: {
    title: "Mohd. Rehman Baig (md-rehman) — Senior React & React Native Architect",
    description:
      "Official website & portfolio of md-rehman (Mohd. Rehman Baig), Senior React & React Native Developer. Specializing in cross-platform engineering, design systems, and mobile architecture.",
    url: "https://md-rehman.dev",
    siteName: "md-rehman",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Mohd Rehman Baig — Senior React & React Native Developer",
      },
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mohd Rehman Baig — Senior React & React Native Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohd. Rehman Baig (md-rehman) — Senior React & React Native Architect",
    description:
      "Official website & portfolio of md-rehman (Mohd. Rehman Baig), Senior React & React Native Developer. Specializing in cross-platform engineering, design systems, and mobile architecture.",
    creator: "@_mdrehman",
    images: ["/api/og", "/og-image.jpg"],
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
      "name": "Mohd. Rehman Baig",
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
      "name": "Mohd. Rehman Dev",
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
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "ratingCount": "1",
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
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "ratingCount": "1",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <ThemeInitializer defaultTheme="shades-of-grey" />
        <AnalyticsWrapper>{children}</AnalyticsWrapper>
      </body>
    </html>
  );
}
