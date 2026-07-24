import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { DocItem, DocFrontmatter, SidebarCategory, SearchDocResult } from "./types";
import { extractHeadings } from "./toc";

export interface ReadDocsOptions {
  contentDir: string;
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function getAllDocFiles(dirPath: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dirPath)) return results;

  const list = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const item of list) {
    const fullPath = path.join(dirPath, item.name);
    if (item.isDirectory()) {
      results = results.concat(getAllDocFiles(fullPath));
    } else if (item.isFile() && (item.name.endsWith(".md") || item.name.endsWith(".mdx"))) {
      results.push(fullPath);
    }
  }
  return results;
}

export function getDocBySlug(contentDir: string, category: string, slug: string): DocItem | null {
  const fileNameCandidate = `${slug}.md`;
  const mdxFileNameCandidate = `${slug}.mdx`;
  
  let filePath = path.join(contentDir, category, fileNameCandidate);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(contentDir, category, mdxFileNameCandidate);
  }
  
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const frontmatter: DocFrontmatter = {
    title: data.title || slug,
    description: data.description || "",
    category: data.category || category,
    section: data.section || category,
    order: typeof data.order === "number" ? data.order : 99,
    tags: data.tags || [],
    pinned: Boolean(data.pinned),
    author: data.author,
    updatedAt: data.updatedAt,
  };

  const headings = extractHeadings(content);
  const readingTimeMinutes = calculateReadingTime(content);

  return {
    slug,
    category,
    path: filePath,
    frontmatter,
    content,
    headings,
    readingTimeMinutes,
  };
}

export function getAllDocs(contentDir: string): DocItem[] {
  const allFiles = getAllDocFiles(contentDir);
  const docs: DocItem[] = [];

  for (const filePath of allFiles) {
    const relativePath = path.relative(contentDir, filePath);
    const parts = relativePath.split(path.sep);
    if (parts.length < 2) continue;

    const category = parts[0];
    const fileName = parts.slice(1).join("/");
    const slug = fileName.replace(/\.mdx?$/, "");

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    const frontmatter: DocFrontmatter = {
      title: data.title || slug,
      description: data.description || "",
      category: data.category || category,
      section: data.section || category,
      order: typeof data.order === "number" ? data.order : 99,
      tags: data.tags || [],
      pinned: Boolean(data.pinned),
      author: data.author,
      updatedAt: data.updatedAt,
    };

    const headings = extractHeadings(content);
    const readingTimeMinutes = calculateReadingTime(content);

    docs.push({
      slug,
      category,
      path: filePath,
      frontmatter,
      content,
      headings,
      readingTimeMinutes,
    });
  }

  return docs.sort((a, b) => (a.frontmatter.order ?? 99) - (b.frontmatter.order ?? 99));
}

export function getSidebarCategories(contentDir: string): SidebarCategory[] {
  const docs = getAllDocs(contentDir);
  const categoriesMap = new Map<string, SidebarCategory>();

  const categoryLabels: Record<string, string> = {
    apps: "Apps & Projects",
    packages: "Packages & Libraries",
    agents: "AI Agents & Transcripts",
  };

  for (const doc of docs) {
    const catId = doc.category;
    if (!categoriesMap.has(catId)) {
      categoriesMap.set(catId, {
        id: catId,
        label: categoryLabels[catId] || catId.toUpperCase(),
        items: [],
      });
    }

    const catObj = categoriesMap.get(catId)!;
    catObj.items.push({
      slug: doc.slug,
      category: doc.category,
      title: doc.frontmatter.title,
      description: doc.frontmatter.description,
      pinned: doc.frontmatter.pinned,
      order: doc.frontmatter.order,
    });
  }

  // Sort items within categories by order, then title
  for (const cat of categoriesMap.values()) {
    cat.items.sort((a, b) => {
      if ((a.order ?? 99) !== (b.order ?? 99)) {
        return (a.order ?? 99) - (b.order ?? 99);
      }
      return a.title.localeCompare(b.title);
    });
  }

  return Array.from(categoriesMap.values());
}

export function searchDocs(contentDir: string, query: string): SearchDocResult[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();
  const docs = getAllDocs(contentDir);
  const results: SearchDocResult[] = [];

  for (const doc of docs) {
    const titleMatch = doc.frontmatter.title.toLowerCase().includes(q);
    const descMatch = (doc.frontmatter.description || "").toLowerCase().includes(q);
    const contentIndex = doc.content.toLowerCase().indexOf(q);

    if (titleMatch || descMatch || contentIndex !== -1) {
      let matchSnippet = doc.frontmatter.description;
      if (contentIndex !== -1 && !descMatch) {
        const start = Math.max(0, contentIndex - 30);
        const end = Math.min(doc.content.length, contentIndex + 70);
        matchSnippet = "..." + doc.content.slice(start, end).replace(/\n/g, " ") + "...";
      }

      results.push({
        slug: doc.slug,
        category: doc.category,
        title: doc.frontmatter.title,
        description: doc.frontmatter.description,
        matchSnippet,
      });
    }
  }

  return results;
}
