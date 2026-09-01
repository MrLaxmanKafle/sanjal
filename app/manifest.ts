import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Installable from the browser. Deliberately a PWA rather than a store app in
 * Phase 0: no review queues, no 30% cut, and it reaches people on cheap Android
 * handsets and patchy data without a 40MB download.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    start_url: "/deadlines",
    display: "standalone",
    background_color: "#f6f5f1",
    theme_color: "#2f4fa2",
    lang: "en",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
