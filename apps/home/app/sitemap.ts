import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://md-rehman.dev";
  const now = new Date();

  // Primary routes
  const mainRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tv-set`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tv-set/0`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/companion`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/planner`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];

  // TV Set channel routes (0 through 9)
  const tvChannels: MetadataRoute.Sitemap = Array.from({ length: 10 }, (_, i) => ({
    url: `${baseUrl}/tv-set/${i}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: i === 0 ? 0.95 : 0.8,
  }));

  // Combine and deduplicate
  const routesMap = new Map<string, MetadataRoute.Sitemap[number]>();
  [...mainRoutes, ...tvChannels].forEach((route) => {
    routesMap.set(route.url, route);
  });

  return Array.from(routesMap.values());
}

