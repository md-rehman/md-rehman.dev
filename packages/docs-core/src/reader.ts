import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { DocItem, DocFrontmatter, SidebarCategory, SearchDocResult } from "./types";
import { extractHeadings } from "./toc";

export interface ReadDocsOptions {
  contentDir: string;
  includeLocalOnly?: boolean;
}

export function isProductionEnvironment(): boolean {
  if (process.env.DOCS_ENV === "local") return false;
  if (process.env.DOCS_ENV === "production" || process.env.DOCS_ENV === "prod") return true;
  return process.env.NODE_ENV === "production";
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

export function getDocBySlug(
  contentDir: string,
  category: string,
  slug: string,
  options?: { includeLocalOnly?: boolean }
): DocItem | null {
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
    localOnly: Boolean(data.localOnly),
    author: data.author,
    updatedAt: data.updatedAt,
  };

  const includeLocalOnly = options?.includeLocalOnly ?? !isProductionEnvironment();
  if (frontmatter.localOnly && !includeLocalOnly) {
    return null;
  }

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

export function getAllDocs(
  contentDir: string,
  options?: { includeLocalOnly?: boolean }
): DocItem[] {
  const allFiles = getAllDocFiles(contentDir);
  const docs: DocItem[] = [];
  const includeLocalOnly = options?.includeLocalOnly ?? !isProductionEnvironment();

  for (const filePath of allFiles) {
    const relativePath = path.relative(contentDir, filePath);
    const parts = relativePath.split(path.sep);
    const category = parts[0];
    if (!category) continue;
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
      localOnly: Boolean(data.localOnly),
      author: data.author,
      updatedAt: data.updatedAt,
    };

    if (frontmatter.localOnly && !includeLocalOnly) {
      continue;
    }

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

export function getSidebarCategories(
  contentDir: string,
  options?: { includeLocalOnly?: boolean }
): SidebarCategory[] {
  const docs = getAllDocs(contentDir, options);
  const categoriesMap = new Map<string, SidebarCategory>();

  const categoryLabels: Record<string, string> = {
    apps: "Apps & Projects",
    packages: "Packages & Libraries",
    agents: "AI Agents & Transcripts",
    "wip-tasks": "WIP Tasks",
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
      localOnly: doc.frontmatter.localOnly,
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

  return Array.from(categoriesMap.values()).filter((cat) => cat.items.length > 0);
}

export function searchDocs(
  contentDir: string,
  query: string,
  options?: { includeLocalOnly?: boolean }
): SearchDocResult[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();
  const docs = getAllDocs(contentDir, options);
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
