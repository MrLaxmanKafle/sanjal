# Features

What Sanjal does, what it will do, and what it will not. Status is honest:
**Built** means it works in the repo today, **Next** is the current stage,
**Later** is committed but unstarted, and **Never** means we have decided
against it.

The ordering rationale is in [ROADMAP.md](ROADMAP.md); the reasoning behind the
wedge is in [BLUEPRINT.md](BLUEPRINT.md).

---

## 1. Deadlines — the wedge

The reason someone opens the app alone on a Tuesday night.

| | Feature |
| --- | --- |
| **Built** | Track any document: passport, visa, work permit, ID card, licence, insurance |
| **Built** | Urgency measured against each document type's *own* renewal lead time — a passport with four months left is urgent, a licence with four months left is not |
| **Built** | A start-by date, not just an expiry date |
| **Built** | Calendar export (`.ics`) with a reminder a week before, so reminders work with no account and no push service |
| **Built** | Everything stored on-device; nothing transmitted |
| **Built** | Cross-tab sync on web |
| **Next** | Add/edit form on mobile (the list already renders) |
| **Next** | Real device storage on mobile, replacing the in-memory placeholder |
| **Later** | Link a deadline to its guide — "renew this" opens the right procedure |
| **Later** | Household view: track a spouse's and children's documents |
| **Later** | Opt-in, end-to-end encrypted sync across devices |
| **Later** | Push reminders (only after notification privacy is settled — see SECURITY.md) |

## 2. Guides — the reason to trust us

| | Feature |
| --- | --- |
| **Built** | Six guides: passport renewal abroad, NOC, power of attorney, police clearance, NRN card, repatriation of remains |
| **Built** | Provenance on every guide — reviewer, date checked, official sources; unverified guides say so in a banner |
| **Built** | Correction route on every page |
| **Next** | Verify all six against their official sources (highest-value human work available) |
| **Later** | Per-mission variants, since fees and forms differ by embassy |
| **Later** | Nepali translations of every guide |
| **Later** | Assistant answering in English, Nepali, or romanized Nepali — retrieval over *verified* guides only, citing what it used, declining what it does not cover |
| **Later** | Personal checklists generated from a guide |

## 3. City hubs — the community layer

| | Feature |
| --- | --- |
| **Built** | Five city frames: Sydney, Melbourne, London, Dallas–Fort Worth, Boston |
| **Built** | Honest empty states and a "help open this city" route |
| **Next** | Hand-seed the first hubs with real organisers ([SEEDING.md](SEEDING.md)) |
| **Later** | Events calendar, sourced from organisers, with festival dates that move correctly each year |
| **Later** | Business directory: restaurants, groceries, remittance agents, accountants, lawyers — each confirmed as trading |
| **Later** | Society, NRNA chapter and student association pages with verified-organiser badges |
| **Later** | Rooms and flatmates, structured and searchable |
| **Later** | Jobs, with hard anti-scam vetting |
| **Later** | Feeds — scoped to a city or group, never a global firehose |

## 4. Accounts and identity

| | Feature |
| --- | --- |
| **Built** | None. Phase 0 needs no account, which is why it has almost no attack surface |
| **Later** | Passkeys as the primary factor; social OAuth as convenience only, never the sole key |
| **Later** | Profiles: city, year of arrival, interests. No immigration status, ever |
| **Later** | Data export and deletion that genuinely work |
| **Never** | SMS one-time codes as a second factor or recovery path — SIM swap is a real risk for this audience |

## 5. Language

| | Feature |
| --- | --- |
| **Built** | Devanagari-first typography, so Nepali and English render as one system rather than English with Devanagari bolted on |
| **Built** | Bilingual labels across navigation and content |
| **Later** | Full Nepali UI |
| **Later** | Romanized-Nepali input and search — most of the audience types Nepali in Latin script, and no global product will build this. A real moat, and cheap |

## 6. Money

| | Feature |
| --- | --- |
| **Later** | Remittance rate comparison across licensed providers, earning affiliate revenue |
| **Later** | Directory placement, always visibly labelled as paid |
| **Later** | Event ticketing for societies already using the hubs |
| **Never** | Holding, moving or transmitting money ourselves. It is licensed work in every country our users live in |

## 7. Platform

| | Feature |
| --- | --- |
| **Built** | Web app, installable as a PWA — no store review, no store cut, works on cheap Android and patchy data |
| **Built** | Mobile app on the same shared core (`@sanjal/core`), bundling verified |
| **Later** | App Store and Play releases |
| **Later** | A typed public API, so partner services plug in rather than getting built in-house |

---

## What we are not building, and why

- **Messaging.** Messenger, Viber and WhatsApp already hold these
  relationships. Deep-link out; do not try to win a won battle.
- **A global feed.** Empty until communities exist, and a moderation liability
  afterwards. Feeds arrive scoped to a city or group, or not at all.
- **Short video.** Capital-intensive; TikTok owns it.
- **Our own payment rails.** See §6.
- **Contact-list upload.** The standard growth hack, and for this audience a
  ready-made target list for scammers.

## The test any new feature must pass

1. Does it help someone who is alone on the app, with no friends on it yet?
2. Would we still ship it if it produced no growth?
3. Can it be abused by someone targeting migrants — and if so, what stops them?

A feature that fails the third question does not ship, however much it grows.
