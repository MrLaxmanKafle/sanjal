import type { MetadataRoute } from "next";
import { cities } from "@/lib/cities";
import { guides } from "@/lib/guides";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/deadlines", "/guides", "/cities", "/about", "/privacy"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route}`,
      lastModified: new Date(),
    })),
    ...guides.map((guide) => ({
      url: `${site.url}/guides/${guide.slug}`,
      lastModified: new Date(),
    })),
    ...cities.map((city) => ({
      url: `${site.url}/cities/${city.slug}`,
      lastModified: new Date(),
    })),
  ];
}
