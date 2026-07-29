import type { Metadata } from "next";
import path from "path";
import "./globals.css";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { getSidebarCategories } from "@repo/docs-core";

export const metadata: Metadata = {
  title: "Documentation — md-rehman.dev",
  description: "Developer Documentation Hub for Apps, Packages, and AI Agent Transcripts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contentDir = path.join(process.cwd(), "content");
  const categories = getSidebarCategories(contentDir);

  return (
    <html lang="en">
      <body>
        <div className="docs-layout">
          <Header />
          <div className="docs-main-container">
            <Sidebar categories={categories} />
            <div className="docs-content-wrapper">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
