import type { MetadataRoute } from "next";
import { cities, guides } from "@sanjal/core";
import { siteUrl } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/deadlines", "/guides", "/cities", "/about", "/privacy"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
    })),
    ...guides.map((guide) => ({
      url: `${siteUrl}/guides/${guide.slug}`,
      lastModified: new Date(),
    })),
    ...cities.map((city) => ({
      url: `${siteUrl}/cities/${city.slug}`,
      lastModified: new Date(),
    })),
  ];
}
