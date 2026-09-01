# Sanjal 2.0 — Blueprint for a Nepali Diaspora Social Super App

> Working title: **Sanjal** (सञ्जाल — "network"). This document is the product +
> technical strategy for the second attempt, written to be executed in phases by
> a small, bootstrapped team. It is deliberately opinionated.

---

## 1. Post-mortem: why sanjal.com (Discourse) failed

Before building again, name the failure honestly. A $100/mo Discourse forum
failed for predictable, structural reasons — not because of effort:

1. **A forum is a destination; diaspora life happens in streams.** Discourse
   assumes people visit a website to discuss topics. The Nepali diaspora
   already lives inside Facebook groups, Messenger, TikTok, Viber, and WhatsApp.
   A new destination with no unique utility loses to muscle memory every time.
2. **The cold-start problem was never answered.** A social network's value is
   the people already on it. "Come talk to each other" offers nothing on day
   one. Facebook groups had the people; Discourse had software.
3. **No wedge.** There was nothing you could *only* do on sanjal.com — no tool,
   no data, no service that made a single visit worth it independent of who
   else was there.
4. **Off-the-shelf software, off-the-shelf destiny.** Discourse is excellent at
   being a forum. It cannot become a super app, a mobile-first product, or a
   utility. Renting a category loser locked the ceiling in from day one.

**The lesson:** do not build "a social network" again. Build a **utility people
need weekly**, attach identity and community to it, and let the social layer
emerge on top. Every successful super app followed this order:

| Super app | Started as (the wedge) | Became |
| --- | --- | --- |
| WeChat | Messaging | Payments, mini-apps, everything |
| Grab | Ride hailing | Payments, food, finance |
| Careem | Ride hailing | Gulf super app |
| **Hamro Patro** | **Nepali calendar** | News, radio, rashifal, **remittance (Hamro Remit)** |

Hamro Patro is the proof that this works *for this exact audience*: a humble
Nepali calendar app compounded for 10+ years into the diaspora's default
utility, then added remittance. It is also the incumbent to respect — do not
attack the calendar; pick a wedge it doesn't own.

---

## 2. The market (know exactly who this is for)

Rough shape of the Nepali diaspora (verify current figures before pitching):

- **~3–4 million Nepalis abroad** (excluding the open-border flow to India,
  which is much larger and mostly informal).
- **Remittances ≈ a quarter of Nepal's GDP** (~$10–11B/yr) — the single
  largest economic fact about this audience. Money flows home constantly.
- **Segments differ enormously and need different products:**
  - **Gulf & Malaysia** (largest by count): labor migrants; Android, low-cost
    data, shared rooms; needs: remit rates, job/contract help, embassy &
    document problems, staying connected home.
  - **South Korea (EPS) & Japan (SSW/students):** structured visa programs;
    needs: visa/renewal deadlines, exams, language, community.
  - **Australia, USA, UK, EU** (fast-growing, students → settlers): needs:
    housing/rooms, jobs, NRN card, passport renewal, events, kids' language &
    culture, eventually property & investment back home.
- **Shared cultural spine across all segments:** Dashain/Tihar and the festival
  calendar, Nepali language (plus heavy romanized-Nepali typing), NRNA
  chapters, local Nepali societies in every city, remitting to family.

**Who to serve first:** pick ONE beachhead segment + a handful of cities, not
"the diaspora." Recommendation: **students/settlers in Australia + USA + UK**
first (English-comfortable, high smartphone quality, dense city clusters,
organizers of societies and events), then expand to Korea/Japan, then Gulf.

---

## 3. The wedge: "Diaspora Life Admin" + city community hubs

The product that earns the first 10,000 users is **not a feed**. It is:

### 3a. The utility: a diaspora life-admin assistant

Every Nepali abroad fights the same paperwork, and there is no good tool:

- **Passport renewal (e-passport) tracker & guide** — per-embassy steps,
  documents checklist, appointment links, typical timelines.
- **Visa & document deadline vault** — store expiry dates (visa, passport,
  NOC, driving licence); get reminders *months* ahead. Dead simple, private,
  crazy retention.
- **Guides that answer real questions**: NOC from Nepal, power of attorney
  (adhikrit warisnama) for property back home, NRN card application, marrying
  /sponsoring across countries, sending a deceased loved one home (a real,
  devastating, recurring need), police clearance, degree verification.
- **AI assistant layer** (see §5): answers these in Nepali, English, or
  romanized Nepali, grounded in the curated guides — not hallucinating law.

This is defensible: it requires *Nepal-specific* curation no global app will
do, it's needed regardless of who else uses the app, and it compounds into
trust — the app that helped you renew your passport is the app you'll try
remittance comparison in.

### 3b. The community layer: city hubs, not a global feed

- **City hubs** (Sydney, Melbourne, Dallas, London, Seoul…): the Nepali
  events calendar for that city (Dashain programs, concerts, sports), the
  directory of Nepali businesses (restaurants, groceries, lawyers,
  accountants, remit agents), and the local societies/NRNA chapter.
- **Classifieds that matter:** rooms/flatmates and jobs — the two things
  Nepali Facebook groups are actually used for, done with structure and search
  instead of scrolling.
- Seed these manually. Ten cities, hand-curated, before writing one line of
  feed code. Partner with the societies that already run events — give them
  free event pages and ticketing later.

### What NOT to build early

- ❌ **Chat/messaging** — you will not beat Messenger/Viber/WhatsApp. Deep-link
  to them instead.
- ❌ **A general feed** — until communities exist, a feed is an empty room.
- ❌ **Your own remittance rails** — money transmission is licence-heavy in
  every destination country (US per-state MTLs, UK FCA, AUSTRAC…). Start with
  a **rate-comparison + affiliate** layer over existing providers; partner
  later; build never (or only with serious capital and a licensed partner).
- ❌ **Video/shorts** — capital intensive; TikTok owns it.

---

## 4. Business model (in order of activation)

1. **Business directory** — free listing, paid featured placement (restaurants,
   remit agents, lawyers, travel agencies serving Nepalis). Activatable in
   month one with manual sales.
2. **Remittance affiliate/comparison** — referral revenue per funded transfer;
   the audience's biggest recurring spend.
3. **Events & ticketing** — fee per paid ticket for society events, concerts.
4. **Jobs board** — paid postings (especially agencies recruiting for
   Korea/Japan/Gulf — with strict anti-scam vetting; this is also a safety
   feature).
5. **Premium life-admin** — document vault for family, priority AI assistant,
   multi-country profiles.
6. **Later, platform:** mini-app / API surface for Nepali services (insurance,
   property back home, travel) — the actual "super app" economics.

---

## 5. Technical architecture: built to last 15 years

The goal "relevant through tech evolution" is achieved by **owning the
durable things and renting the volatile things**:

- **Durable (own them):** user identity, the social graph, the content/data,
  the domain, the API contracts, the curated knowledge base.
- **Volatile (rent/replace them):** UI frameworks, AI models, hosting,
  payment providers, app stores.

### Principles

1. **One modular monolith, API-first.** A single TypeScript backend exposing a
   clean API (REST + typed client). No microservices until a specific scaling
   pain forces it. Clients (web, iOS, Android) are replaceable shells over the
   API — that is what survives platform shifts.
2. **Boring, proven data core: PostgreSQL** (+ object storage for media,
   + Redis when needed). Postgres has outlived every framework hype cycle and
   will outlive the next one. All data models get soft-delete + audit trails.
3. **PWA-first, app-store later.** Ship as an installable Next.js PWA (already
   the team's stack) with offline caching for guides (Gulf users, patchy
   data). Wrap with **Expo/React Native** when retention justifies the app
   stores — sharing the API and most business logic.
4. **AI-native, model-agnostic.** All AI features go through an internal
   gateway service so models can be swapped as they improve/cheapen. Use
   retrieval over the curated guides (RAG) so the assistant cites real
   procedures instead of guessing. AI also powers: Nepali ⇄ English ⇄
   romanized-Nepali translation everywhere, moderation triage, and search.
   This is the main "future evolution" bet — the app's interface increasingly
   *is* the assistant.
5. **Identity built for portability.** Email/phone + passkeys (WebAuthn) from
   day one; OAuth (Google/Apple/Facebook) as convenience, never the only key.
   Users can export their data. Consider ActivityPub/AT-proto compatibility
   *later* as a distribution hedge, not a day-one constraint.
6. **Multilingual as a first-class citizen.** UI in English + Nepali
   (Devanagari), input accepting romanized Nepali with smart transliteration.
   This is a moat: global apps won't do it well.
7. **Trust & safety from day one.** Nepali-context moderation (political,
   caste, region sensitivities), scam-job detection, verified-organizer badges
   for societies. Moderation debt killed many diaspora spaces; budget for it.
8. **Privacy & jurisdiction.** Diaspora users span GDPR (EU/UK), Australia,
   US; store minimal PII, encrypt document-vault contents client-side where
   feasible, publish a plain-language policy in both languages.
9. **Cost discipline.** Phase 0 should run under ~$50/mo (managed Postgres +
   serverless hosting + object storage). The $100/mo Discourse bill bought a
   ceiling; the same money now buys infrastructure with no ceiling.

### Concrete starting stack (matches existing team skills)

- **Next.js (App Router) + TypeScript + Tailwind** — web + PWA
- **PostgreSQL** (Supabase or Neon to start) with Drizzle/Prisma
- **Auth:** Auth.js or Supabase Auth with passkeys enabled
- **Media:** Cloudflare R2 / S3
- **AI gateway:** small internal service wrapping the current-best LLM API
- **Search:** Postgres full-text first; Typesense/Meilisearch when needed
- **Later mobile:** Expo (React Native), same API

---

## 6. Roadmap

### Phase 0 — Wedge & proof (weeks 1–8)
- New repo/domain (sanjal.com is owned — good).
- Ship: e-passport renewal guides for 5 embassies, document-deadline reminders
  (email/WhatsApp share), city event calendars for 5 cities (hand-curated),
  business directory v0, waitlist.
- No feed, no chat, no profiles beyond email.
- **Success metric:** 1,000 people set at least one document reminder or RSVP
  to one event. That is real pull.

### Phase 1 — Community hubs (months 3–6)
- Accounts + profiles (city, since-year, interests).
- City hubs: events + directory + classifieds (rooms, jobs) with structure.
- Society/NRNA-chapter pages with verified organizer badges.
- AI assistant v1 over the guides (Nepali/English/romanized).
- **Metric:** 10 cities with weekly organic posting; 30% M1 retention.

### Phase 2 — Social layer (months 6–12)
- Feeds *scoped to city hubs and groups* (never a global firehose first).
- Remittance rate comparison + affiliate.
- Expo mobile apps.
- **Metric:** DAU/MAU > 20%; first revenue from directory + affiliate.

### Phase 3 — Super app surface (year 2+)
- Ticketing, jobs marketplace with vetting, premium vault.
- Partner mini-services (insurance, property, travel) via the API.
- Payments only through licensed partners.

---

## 7. Decisions needed from the founders

1. **Beachhead:** confirm Australia/US/UK-first (recommended) vs. Gulf-first.
2. **Name/brand:** revive "Sanjal" on sanjal.com, or a fresh brand?
3. **Separation:** this must live in its own repository and company — it is
   unrelated to Himalaya Cannabis Pvt. Ltd. and mixing brands/repos hurts both.
4. **Seed cities:** pick the 5 where the team personally knows organizers.
5. **Budget/time:** who builds (hours/week), and the ~$50–100/mo infra line.

---

*Treat this as a living document — revise the post-mortem and metrics as real
data arrives. Phase 0 of the roadmap below is implemented in this repository;
see [`ARCHITECTURE.md`](ARCHITECTURE.md) for how it is built and what Phase 1
changes.*
