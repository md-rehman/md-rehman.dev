import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { DocItem, DocFrontmatter, SidebarCategory, SidebarTreeNode, SearchDocResult } from "./types";
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
      if (item.name === "AGENTS.md") continue;
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
    if (parts.length === 0) continue;
    const computedCategory = parts.length > 1 ? parts.slice(0, -1).join("/") : parts[0];
    const fileName = parts[parts.length - 1];
    if (!fileName) continue;
    const slug = fileName.replace(/\.mdx?$/, "");

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    const category = data.category || computedCategory;

    const frontmatter: DocFrontmatter = {
      title: data.title || slug,
      description: data.description || "",
      category,
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
    "info-hub/apps": "📱 Monorepo Apps",
    "info-hub/packages": "📦 Shared Packages",
    "planning/in-progress": "⏳ In Progress Tasks",
    "planning/todo": "📋 To-Do Tasks",
    "planning/done": "✅ Completed Tasks",
    "planning/archive": "🗄️ Archive",
    agents: "🤖 AI Agents & Transcripts",
  };

  const categoryOrderMap: Record<string, number> = {
    "info-hub/apps": 1,
    "info-hub/packages": 2,
    "planning/todo": 3,
    "planning/in-progress": 4,
    "planning/done": 5,
    "planning/archive": 6,
    agents: 7,
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

  const sortedCategories = Array.from(categoriesMap.values()).filter((cat) => cat.items.length > 0);
  sortedCategories.sort((a, b) => (categoryOrderMap[a.id] ?? 99) - (categoryOrderMap[b.id] ?? 99));

  return sortedCategories;
}

export function getSidebarTree(
  contentDir: string,
  options?: { includeLocalOnly?: boolean }
): SidebarTreeNode[] {
  const docs = getAllDocs(contentDir, options);

  const folderMetaMap: Record<string, { name: string; icon: string; order: number }> = {
    "info-hub": { name: "Info Hub", icon: "📁", order: 1 },
    "info-hub/apps": { name: "Apps & Projects", icon: "📱", order: 1 },
    "info-hub/packages": { name: "Packages & Libraries", icon: "📦", order: 2 },
    "planning": { name: "Task Planning", icon: "🎯", order: 2 },
    "planning/todo": { name: "To-Do", icon: "📋", order: 1 },
    "planning/in-progress": { name: "In Progress", icon: "⏳", order: 2 },
    "planning/done": { name: "Done", icon: "✅", order: 3 },
    "planning/archive": { name: "Archive", icon: "🗄️", order: 4 },
    "agents": { name: "AI Agents & Transcripts", icon: "🤖", order: 3 },
  };

  const rootNodesMap = new Map<string, SidebarTreeNode>();

  for (const doc of docs) {
    const parts = doc.category.split("/");
    let currentPath = "";
    let parentChildren: SidebarTreeNode[] = [];

    for (let i = 0; i < parts.length; i++) {
      const seg = parts[i];
      if (!seg) continue;
      currentPath = currentPath ? `${currentPath}/${seg}` : seg;

      const meta = folderMetaMap[currentPath] || {
        name: seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        icon: "📁",
        order: 99,
      };

      if (i === 0) {
        if (!rootNodesMap.has(currentPath)) {
          rootNodesMap.set(currentPath, {
            id: currentPath,
            name: meta.name,
            type: "folder",
            path: currentPath,
            icon: meta.icon,
            order: meta.order,
            children: [],
          });
        }
        parentChildren = rootNodesMap.get(currentPath)!.children!;
      } else {
        let folderNode = parentChildren.find((node) => node.path === currentPath);
        if (!folderNode) {
          folderNode = {
            id: currentPath,
            name: meta.name,
            type: "folder",
            path: currentPath,
            icon: meta.icon,
            order: meta.order,
            children: [],
          };
          parentChildren.push(folderNode);
        }
        parentChildren = folderNode.children!;
      }
    }

    // Add file node
    parentChildren.push({
      id: `${doc.category}/${doc.slug}`,
      name: doc.frontmatter.title,
      type: "file",
      path: `${doc.category}/${doc.slug}`,
      href: `/${doc.category}/${doc.slug}`,
      pinned: doc.frontmatter.pinned,
      order: doc.frontmatter.order ?? 99,
    });
  }

  const sortTreeNodes = (nodes: SidebarTreeNode[]): SidebarTreeNode[] => {
    nodes.sort((a, b) => {
      if ((a.order ?? 99) !== (b.order ?? 99)) {
        return (a.order ?? 99) - (b.order ?? 99);
      }
      return a.name.localeCompare(b.name);
    });

    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        sortTreeNodes(node.children);
      }
    }
    return nodes;
  };

  const tree = Array.from(rootNodesMap.values());
  return sortTreeNodes(tree);
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
