import type { NextConfig } from "next";

/**
 * Response security headers.
 *
 * Rationale for the CSP as written: this app currently renders no
 * user-generated content, so the realistic injection vector is a third-party
 * script rather than stored XSS. `script-src 'self'` closes that. Next injects
 * inline bootstrap scripts, so `'unsafe-inline'` is still required here —
 * removing it needs nonces, which force dynamic rendering and would give up the
 * static generation this site relies on.
 *
 * THAT TRADE FLIPS the moment users can post: when city hubs accept listings,
 * events or messages, move to a nonce-based CSP and drop 'unsafe-inline'.
 * Stored XSS in a directory read by people acting on immigration advice is not
 * a risk worth carrying for build-time convenience.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  // Tailwind and Next both emit inline styles.
  "style-src 'self' 'unsafe-inline'",
  // next/font self-hosts, so no font CDN is needed or allowed.
  "font-src 'self'",
  "img-src 'self' data: blob:",
  // Only our own API. No analytics, no third-party beacons.
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Two years, preloadable. Only meaningful over HTTPS, ignored on localhost.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  // Send the origin cross-site, the full path same-origin. Guide URLs reveal
  // what someone is dealing with, so they should not leak to other sites.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing here needs hardware. Deny it rather than leave it to defaults.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
