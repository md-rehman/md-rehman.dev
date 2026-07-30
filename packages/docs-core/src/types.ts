export interface DocFrontmatter {
  title: string;
  description?: string;
  category?: string;
  section?: 'apps' | 'packages' | 'agents' | string;
  order?: number;
  tags?: string[];
  pinned?: boolean;
  localOnly?: boolean;
  author?: string;
  updatedAt?: string;
}

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export interface DocItem {
  slug: string;
  category: string;
  path: string;
  frontmatter: DocFrontmatter;
  content: string;
  headings: TocHeading[];
  readingTimeMinutes: number;
}

export interface SidebarCategory {
  id: string;
  label: string;
  items: {
    slug: string;
    category: string;
    title: string;
    description?: string;
    pinned?: boolean;
    localOnly?: boolean;
    order?: number;
  }[];
}

export interface SidebarTreeNode {
  id: string;
  name: string;
  type: "folder" | "file";
  path: string;
  href?: string;
  icon?: string;
  pinned?: boolean;
  order?: number;
  children?: SidebarTreeNode[];
}

export interface SearchDocResult {
  slug: string;
  category: string;
  title: string;
  description?: string;
  matchSnippet?: string;
}
