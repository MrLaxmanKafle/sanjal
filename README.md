# Sanjal — सञ्जाल

A social network and super app for the Nepali diaspora, built wedge-first.

This is Phase 0: the useful thing that works on day one for a person who is
alone on the site. The community layer comes after, city by city. The reasoning
behind that order is in [`docs/BLUEPRINT.md`](docs/BLUEPRINT.md) — read it
before adding features, because most of the discipline in this project is about
what we are deliberately *not* building yet.

## What is in here

| Route | What it does |
| --- | --- |
| `/` | The pitch, and the waitlist |
| `/deadlines` | Document deadline tracker — the retention hook. Entirely client-side |
| `/guides`, `/guides/[slug]` | Life-admin guides: passport renewal abroad, NOC, power of attorney, police clearance, NRN card, repatriation |
| `/cities`, `/cities/[slug]` | City hubs. Ship empty on purpose — see below |
| `/about` | What we are building and what we are not, including the forum post-mortem |
| `/privacy` | Plain-language privacy, because the audience is targeted by scammers |
| `/api/waitlist` | Signup intake, forwarded to a webhook. No database yet |

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npx eslint .
```

Node 20+. Next.js 16 (App Router) with Tailwind v4.

## Configuration

Copy `.env.example` to `.env.local`:

- `NEXT_PUBLIC_SITE_URL` — the canonical origin. Metadata, the sitemap and
  robots.txt all read from it. Set this when the domain is connected.
- `WAITLIST_WEBHOOK_URL` — where signups are POSTed as JSON
  (`{ email, city, source, at }`). Any endpoint works: a spreadsheet
  automation, an email service, a CRM. **Until it is set, the waitlist form
  returns an honest error and tells people to email instead** — it never
  pretends to have saved an address it dropped.

## Three rules this codebase is built around

**1. Document data never reaches our servers.** The deadline tracker stores
everything in the browser (`lib/documentStore.ts`). Passport and visa details
are exactly what someone targeting migrants wants, and the safest database is
the one that does not exist. Reminders leave as a calendar file the person
downloads, so no account and no push infrastructure is needed. When accounts
arrive, syncing this stays opt-in and encrypted — never the default.

**2. Nothing is presented as verified when it is not.** Every guide carries a
`review` block (`lib/guides.ts`). While `status` is `"unverified"` the page says
so in a banner. Do not flip a guide to `"verified"` from memory — only after a
named person has opened the official sources on the stated date. Someone books
flights around this.

**3. Empty beats fake.** City hubs ship with no events, no businesses and no
organisations. A directory listing a restaurant that closed, or an event that
never happened, destroys the trust the guides exist to build. See
[`docs/SEEDING.md`](docs/SEEDING.md) for how to fill them in properly.

## Architecture

Deliberately boring, so it can be replaced piece by piece as things change:
own the durable parts (the data, the content, the API contracts, identity),
rent the volatile parts (framework, models, hosting). Details and the Phase 1
plan are in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

Right now there is no database and no auth, and that is a feature — Phase 0
runs as a static site plus one route handler, for roughly the cost of a domain.

## Deploying

Any Node host works. Vercel, Cloudflare or a container all handle this without
changes; set the two environment variables above. The app is installable as a
PWA (`app/manifest.ts`), which is the intended mobile story until retention
justifies app-store builds.
