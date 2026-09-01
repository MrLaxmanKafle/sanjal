/**
 * Brand facts that every client shares.
 *
 * The canonical URL is deliberately NOT read from an environment variable here:
 * core must not know whether it is running under Next.js, Expo, or a test, and
 * each of those exposes configuration differently. Hosts pass their own origin
 * in when they need to build absolute links.
 */
export const site = {
  name: "Sanjal",
  nameNepali: "सञ्जाल",
  tagline: "The paperwork side of living abroad, handled.",
  description:
    "Sanjal helps Nepalis abroad track document deadlines, follow embassy procedures, and find their city's Nepali community — in English and Nepali.",
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
