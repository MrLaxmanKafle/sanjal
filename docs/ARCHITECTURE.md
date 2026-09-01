# Architecture

The goal is a product that survives fifteen years of framework churn. The way to
get there is not picking the right framework — it is arranging the system so the
framework is a replaceable part.

**Own the durable things:** identity, the social graph, the content and its
provenance, the API contracts, the domain.

**Rent the volatile things:** UI framework, AI models, hosting, payment
providers, app stores.

Every decision below follows from that split.

## Where things live now

```
app/            routes; server components by default
components/     UI. Only DeadlineVault and WaitlistForm are client components
lib/            data and domain logic, with no React in it
lib/guides.ts   guide content + the review/provenance model
lib/cities.ts   city hub content
lib/documents.ts        deadline maths and calendar generation — pure functions
lib/documentStore.ts    the browser-storage layer, isolated behind a store API
```

`lib/` holds no framework code beyond types. When the UI layer is eventually
replaced, the deadline logic, the guide model and the content move across
untouched. That is the point of the boundary.

## Decisions, and why

**No database in Phase 0.** There is nothing yet whose value depends on
server-side state. Adding Postgres now would mean securing it, backing it up and
migrating it before a single user has proven they want the product. The tracker
works entirely client-side; the waitlist forwards to a webhook.

**The tracker is client-side permanently, by default.** Not a shortcut — a
security posture. A database of Nepali migrants' passport numbers and visa
expiry dates is a target, and we have no reason to hold one. `lib/documentStore.ts`
isolates storage behind `subscribe`/`getSnapshot`/`save`, so if opt-in sync is
added later it swaps in behind the same interface with the local path intact for
people who decline.

**`useSyncExternalStore`, not `useState` + `useEffect`.** Reading browser storage
into state inside an effect causes cascading renders (the React Compiler lint
rejects it). The store shape also gives cross-tab sync for free via the `storage`
event, and caches its snapshot against the raw string so repeated reads return a
stable reference.

**Reminders as a calendar file, not notifications.** An `.ics` download needs no
account, no push service, no server, and no permission prompt — and it lands in
the calendar the person already checks. The event is placed on the date the
renewal should *start*, derived from each document type's lead time, because a
reminder on the expiry date is useless.

**Urgency is relative to lead time, not a fixed threshold.** A passport with four
months left is urgent because renewal takes about six; a driving licence with
four months left is not. `urgencyOf()` compares days remaining against the
document type's own `leadTimeDays`.

**Provenance in the content model.** `Guide.review` carries status, date and
reviewer, and the UI renders an unverified banner from it. Correctness here is a
safety property, not a quality nicety.

**PWA before app stores.** Installable, no review queue, no store cut, and it
reaches cheap Android handsets on patchy data without a large download — which
describes most of the diaspora outside the US, UK and Australia. Expo comes when
retention justifies it, sharing the same API.

**Devanagari-first typography.** Both faces (Anek Devanagari, Mukta) are designed
for Devanagari and carry Latin, so Nepali and English render as one system rather
than English with Devanagari bolted on. Users read both in the same sentence.

**Colour carries state.** The accent is a lapis blue kept clear of the
red/amber/green used for deadline urgency, so semantic colour is never ambiguous.

## Phase 1: what changes, and in what order

1. **Postgres + auth.** Accounts arrive when city hubs need submissions and
   profiles. Passkeys from the start, social OAuth as convenience only — never
   the sole key, so no platform can lock a user out of their own account.
   Soft-delete and audit trails on every table.
2. **Content out of TypeScript.** `lib/guides.ts` and `lib/cities.ts` are fine
   for six guides and five cities, and wrong for sixty and fifty. Move to the
   database behind the same types, keeping the `review` model intact, once
   non-engineers need to edit content.
3. **An API worth having.** Before any mobile client exists, the web app should
   already be consuming a typed API rather than reaching into the database from
   components. The client is replaceable; the contract is not.
4. **The assistant.** Retrieval over the verified guides, behind an internal
   gateway so the model is swappable. It must cite the guide it answered from,
   and must decline rather than invent when the guides do not cover something —
   the failure mode here is confidently wrong immigration advice.
5. **Bilingual input.** Romanized-Nepali transliteration in search and forms.
   Most of the audience types Nepali in Latin script; treating that as a
   first-class input is a moat no global product will bother to build.

## What we are not building, and why it stays out

- **Messaging.** Messenger, Viber and WhatsApp already hold these relationships.
  Deep-link to them.
- **A global feed.** Empty until communities exist; a moderation liability after.
  Feeds arrive scoped to a city hub or a group, or not at all.
- **Money transmission.** Licensed activity in every destination country. The
  path is comparison and affiliate over licensed providers, then partnership.
  Building rails is how this project would die.
- **Microservices.** One modular monolith until a specific measured pain forces
  otherwise.
