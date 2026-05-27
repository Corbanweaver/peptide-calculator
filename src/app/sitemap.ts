import type { MetadataRoute } from "next";
import { compoundSeoPages, toolSeoPages } from "@/lib/seo-pages";
import { absoluteUrl, sitemapLastModified } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: sitemapLastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/disclaimer"),
      lastModified: sitemapLastModified,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/privacy-policy"),
      lastModified: sitemapLastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/terms-of-service"),
      lastModified: sitemapLastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/peptides"),
      lastModified: sitemapLastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/tools"),
      lastModified: sitemapLastModified,
      changeFrequency: "monthly",
      priority: 0.74,
    },
    {
      url: absoluteUrl("/pro"),
      lastModified: sitemapLastModified,
      changeFrequency: "monthly",
      priority: 0.72,
    },
    {
      url: absoluteUrl("/syringe-measurement-calculator"),
      lastModified: sitemapLastModified,
      changeFrequency: "monthly",
      priority: 0.82,
    },
    ...compoundSeoPages.map((page) => ({
      url: absoluteUrl(`/peptides/${page.slug}`),
      lastModified: sitemapLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.82,
    })),
    ...toolSeoPages.map((page) => ({
      url: absoluteUrl(`/tools/${page.slug}`),
      lastModified: sitemapLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.84,
    })),
  ];
}
