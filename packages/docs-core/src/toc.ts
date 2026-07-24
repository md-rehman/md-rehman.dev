import { TocHeading } from "./types";

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function extractHeadings(markdown: string): TocHeading[] {
  const headingLines = markdown.split("\n").filter((line) => line.match(/^#{1,4}\s+/));
  
  return headingLines.map((line) => {
    const match = line.match(/^(#{1,4})\s+(.+)$/);
    if (!match) return { id: "", text: "", level: 1 };
    
    const level = match[1].length;
    // Clean text by stripping bold/italic inline markdown and custom IDs if any
    const rawText = match[2].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`]/g, "").trim();
    const id = slugifyHeading(rawText);
    
    return { id, text: rawText, level };
  }).filter((h) => h.id.length > 0);
}
