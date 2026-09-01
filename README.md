# Sanjal — सञ्जाल

A social network and super app for the Nepali diaspora, built wedge-first, with
web and mobile running on one shared engine.

Read [`docs/BLUEPRINT.md`](docs/BLUEPRINT.md) before adding features. Most of the
discipline in this project is about what we are deliberately *not* building yet.
[`docs/ROADMAP.md`](docs/ROADMAP.md) is the step-by-step build order.

## Layout

```
packages/core     @sanjal/core — the engine. No React, no DOM, no React Native.
apps/web          Next.js 16 site and PWA
apps/mobile       Expo / React Native app
```

`packages/core` holds the product's actual rules: what a document deadline
means, when it becomes urgent, how the list is ordered, how a reminder is
written, the guide content and its provenance model. It typechecks with **no
DOM and no Node types available at all**, which is enforced by its `tsconfig`
and is what guarantees it runs unchanged in a browser, on a phone, in a server
route, or in a test.

Anything needing a platform API is expressed as a port the host fills in. The
deadline vault is the worked example: `createVault(storage)` in core owns every
rule, while `apps/web/lib/vault.ts` (localStorage) and
`apps/mobile/src/storage.ts` (device storage) are about thirty lines each. Two
clients, one set of rules, no drift.

## Running it

```bash
npm install            # once, at the root — this is an npm workspace

npm run dev            # web at http://localhost:3000
npm run test           # the core engine's tests
npm run typecheck      # every workspace
npm run build          # production web build

cd apps/mobile && npx expo start     # mobile
```

Node 20+.

## Configuration

Copy `apps/web/.env.example` to `apps/web/.env.local`:

- `NEXT_PUBLIC_SITE_URL` — canonical origin; metadata, sitemap and robots read it.
- `WAITLIST_WEBHOOK_URL` — where signups are POSTed as JSON. **Until it is set
  the form returns an honest error and points people at email** rather than
  silently dropping addresses.

## Four rules this codebase is built around

**1. Core stays platform-free.** No framework import ever enters
`packages/core`. The moment it does, web and mobile start to drift and the
shared engine becomes two engines wearing one name.

**2. Document data never reaches our servers.** The vault stores everything on
the device. Passport and visa details are exactly what someone targeting
migrants wants, and the safest database is the one that does not exist. When
sync arrives it stays opt-in and encrypted, never the default.

**3. Nothing is presented as verified when it is not.** Every guide carries a
`review` block. While `status` is `"unverified"` the page says so. Do not flip
one to `"verified"` from memory — only after a named person has opened the
official sources on the stated date. People plan around this.

**4. Empty beats fake.** City hubs ship with no events and no businesses. A
listing for a restaurant that closed destroys the trust the guides exist to
build. See [`docs/SEEDING.md`](docs/SEEDING.md).

## Before shipping mobile

`apps/mobile/src/storage.ts` currently keeps documents in memory. Swap it for
real device storage — the file says exactly how, in three lines. It was left
unpinned rather than guessed, because `npx expo install` picks the version
matching the SDK.
