# Sanjal — सञ्जाल

A mobile-first app for Nepalis, starting in Kathmandu. The first release is a
daily-use screen people open every morning; communities and services come
once there is a habit to build on.

Contributors (human or AI): read [`CLAUDE.md`](CLAUDE.md) and
[`docs/DECISIONS.md`](docs/DECISIONS.md) first.

The previous diaspora-focused codebase is preserved on the
`archive/diaspora-v1` branch.

## What's in this version

| Tab | What it does | Data source |
| --- | --- | --- |
| Today (आज) | Bikram Sambat date in Nepali and English, plus NPR exchange rates | [`nepali-date-converter`](https://github.com/subeshb1/Nepali-Date), [Nepal Rastra Bank forex API](https://www.nrb.org.np/api-docs/) |
| News (समाचार) | Latest headlines, opened on the publisher's site | Onlinekhabar, Setopati and Ratopati RSS feeds |
| Chat (कुराकानी) | Sign in with a +977 mobile number and SMS code, set a name, then 1:1 chat with live updates | Supabase (Auth, Postgres, Realtime) |
| Kathmandu (काठमाडौं) | Placeholder for city groups and events | Next release: accounts and a database |

News shows headlines and links only. Never store or republish article bodies.

## Running it

```bash
npm install
npx supabase start    # local backend in Docker; prints the URL and keys
cp .env.example .env.local   # then paste the local URL and publishable key
npx expo start        # scan the QR code with Expo Go, or press a / i / w

npm test              # pure logic tests (Node 22+)
npm run test:db       # database tests; needs SUPABASE_ANON_KEY from `npx supabase status`
npm run typecheck
npm run lint
```

Locally, the numbers 9800000001, 9800000002 and 9800000003 sign in with
code 123456 and no SMS is sent.

## Backend setup (production, once)

1. Create a Supabase project (free tier is enough to start; pick the Mumbai
   region, the closest to Nepal).
2. `npx supabase link --project-ref <ref>` then `npx supabase db push` to
   create the tables, policies and hooks.
3. In the dashboard: Authentication → Sign In / Providers: turn on Phone and
   turn off email sign-ups. Authentication → Hooks: set **Before User
   Created** to the Postgres function `public.hook_before_user_created` and
   **Send SMS** to `public.hook_send_sms`.
4. Open a [Sparrow SMS](https://sparrowsms.com) account and get an approved
   sender ID, then in the SQL editor:
   `select vault.create_secret('<token>', 'sparrow_sms_token');`
   `select vault.create_secret('<sender id>', 'sparrow_sms_from');`
5. Put the project URL and publishable key in `.env.local` (or EAS
   environment variables for builds).

Only Nepali mobile numbers (+977 96/97/98…) can create accounts; the
database enforces this, not just the app.

The app targets Android and iOS. The web build works for layout checks, but
the browser blocks the news and forex requests (CORS), so those cards show
their error state there.

## Layout

```
src/app/          screens (Expo Router; one file per tab)
src/components/   shared UI (Screen, Card, themed text and views, tabs)
src/hooks/        useAsync for loading + pull-to-refresh
src/lib/          data: Nepali date, NRB forex, RSS, phone numbers, Supabase, chat
supabase/         config and SQL migrations (schema, row-level security, auth hooks)
test/             node:test tests; test/db/ runs against a local Supabase
```
