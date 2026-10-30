# Sanjal — working rules

Sanjal (सञ्जाल) is a mobile-first super app for Nepalis, launching in
Kathmandu. The plan is a daily-use utility first (Today, News), then identity
and chat, then city communities, then partner mini-apps (WeChat model). The
product plan lives outside the repo; decisions that shape the code are logged
in [`docs/DECISIONS.md`](docs/DECISIONS.md). Read it before changing direction,
and add an entry when you make a call that a future contributor would
otherwise have to rediscover.

Expo-specific guidance (versions, `npx expo install`, routing) is in
[`AGENTS.md`](AGENTS.md).

## Commands

```bash
npm run lint
npm run typecheck   # needs expo-env.d.ts; `npx expo start` creates it
npm test            # node:test, pure logic only
npx expo export --platform android --output-dir /tmp/export   # bundle check
```

CI runs all four on every pull request. Keep them green.

## Product principles

1. **Human first.** One verified Nepali phone number per person. No bots
   posing as people, no AI-written posts presented as human. AI is for
   utility (summaries, translation, moderation), and it is labelled.
2. **Trust over growth.** Never sell personal data, phone numbers or
   messages. Revenue comes from ads by city and interest, business pages,
   sponsored events and anonymous aggregate insights.
3. **Nepali by default.** Every user-facing string works in Nepali
   (Devanagari) and English. Dates show Bikram Sambat first.
4. **Cheap to run.** Running costs stay under $200/month until revenue
   says otherwise. Prefer managed free tiers and cached results.
5. **Empty beats fake.** Never seed fake users, posts, events or reviews.
6. **Link out, don't copy.** News shows headlines and links, never article
   bodies.

## Code conventions

- Screens live in `src/app/` (Expo Router). Everything else lives outside it.
- Network and parsing logic goes in `src/lib/` as plain functions with no
  React imports, so it can be tested with `node --test`. Every parser gets
  a test in `test/`.
- UI uses `ThemedText`, `ThemedView`, `Screen` and `Card`, and colours from
  `src/constants/theme.ts`. No hard-coded colours in screens.
- A screen that loads data shows a loading state, an error state with a way
  to retry, and keeps the last good data while refreshing.
- Secrets never go in the repo. Public client config uses `EXPO_PUBLIC_*`
  env vars; server secrets live in Supabase.
- Pin new dependencies to a version that is at least a few weeks old.
