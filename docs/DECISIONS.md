# Decisions

Newest first. Each entry: what we decided, why, and what would change it.

## 2026-11-11 — sanjal.com is a static landing page on Cloudflare Pages

The domain's nameservers already point to Cloudflare, so the site is hosted on
Cloudflare Pages (free tier) from the `site/` folder: plain HTML, no build
step, no JavaScript. It says what Sanjal is and that the app is coming; it
does not run the Expo web build, because the app is mobile-first and its
Today and News data come from sites that block browser requests (CORS).
Revisit when the web version of the app is on the roadmap.

## 2026-10-30 — Supabase for backend, +977 phone login

Supabase (Postgres, Auth, Realtime, Edge Functions) runs accounts, chat and
communities. One managed service keeps a one-person team fast and stays
inside the $200/month budget. Row-level security is the access-control
layer, so every table ships with policies.

Sign-up is by Nepali mobile number (+977) with an SMS code. Codes go out
through a Nepali SMS gateway (Sparrow SMS) via Supabase's Send SMS hook,
which is far cheaper than Twilio for Nepali numbers. Email can be linked to
an account later as a second login. Foreign numbers open when the diaspora
launch comes.

## 2026-10-30 — Messaging is in scope (Phase 2)

Sanjal aims to be a WeChat-style super app, so 1:1 and group chat are core,
not deferred. Messages are protected by row-level security at first.
End-to-end encryption is required before chat is marketed as private.

## 2026-10-29 — Fresh codebase, Kathmandu first, mobile first

The earlier diaspora "life admin" monorepo is archived on
`archive/diaspora-v1`. The new app is a single Expo project. Launch city is
Kathmandu; desktop/web comes after there are users. The domain sanjal.com
is owned and will host the landing page.
