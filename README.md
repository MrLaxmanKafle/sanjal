# Sanjal (सञ्जाल)

A fresh start, begun 2026-11-11. We build one step at a time.

The previous code and plans are kept on the `archive/old-plan-2026-11`
branch (and the older `archive/diaspora-v1` branch) if anything is needed
from them later.

## Website

`site/` is the coming soon page at https://sanjal.com. It runs as one
Cloudflare Worker named `sanjal-site`, with a KV namespace `sanjal-waitlist`
bound as `WAITLIST` for waitlist emails.

- Edit `site/public/index.html` (the page) or
  `site/functions/api/waitlist.js` (saving emails).
- Run `python3 site/build-worker.py` to rebuild `site/worker.js`.
- Deploy `site/worker.js` to the `sanjal-site` Worker. This is manual for
  now; merging to `main` does not publish.
