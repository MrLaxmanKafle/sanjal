/**
 * Web-host configuration. Core stays unaware of Next.js and of environment
 * variables, so the origin is resolved here and passed down where needed.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sanjal.com";
