# Sanjal (सञ्जाल)

A fresh start, begun 2026-11-11. We build one step at a time.

The previous code and plans are kept on the `archive/old-plan-2026-11`
branch (and the older `archive/diaspora-v1` branch) if anything is needed
from them later.

## Website

`site/` is the coming soon page at https://sanjal.com, hosted on Cloudflare
Pages (root directory `site`, no build command, output directory `public`).
`site/functions/api/waitlist.js` saves waitlist emails to a KV namespace
bound as `WAITLIST`. Merging to `main` publishes the site.
