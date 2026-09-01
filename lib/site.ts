export const site = {
  name: "Sanjal",
  nameNepali: "सञ्जाल",
  tagline: "The paperwork side of living abroad, handled.",
  description:
    "Sanjal helps Nepalis abroad track document deadlines, follow embassy procedures, and find their city's Nepali community — in English and Nepali.",
  /**
   * Set to the real domain once it is connected. Everything that builds an
   * absolute URL (metadata, sitemap, OG images) reads from here.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sanjal.com",
  contactEmail: "hello@sanjal.com",
  locales: ["en", "ne"] as const,
} as const;

export type Locale = (typeof site.locales)[number];

export const nav = [
  { href: "/deadlines", label: "Deadlines", labelNepali: "म्याद" },
  { href: "/guides", label: "Guides", labelNepali: "निर्देशिका" },
  { href: "/cities", label: "Cities", labelNepali: "सहर" },
  { href: "/about", label: "About", labelNepali: "बारेमा" },
];
