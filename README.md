# Sanjal — सञ्जाल

A mobile-first app for Nepalis, starting in Kathmandu. The first release is a
daily-use screen people open every morning; communities and services come
once there is a habit to build on.

The previous diaspora-focused codebase is preserved on the
`archive/diaspora-v1` branch.

## What's in this version

| Tab | What it does | Data source |
| --- | --- | --- |
| Today (आज) | Bikram Sambat date in Nepali and English, plus NPR exchange rates | [`nepali-date-converter`](https://github.com/subeshb1/Nepali-Date), [Nepal Rastra Bank forex API](https://www.nrb.org.np/api-docs/) |
| News (समाचार) | Latest headlines, opened on the publisher's site | Onlinekhabar, Setopati and Ratopati RSS feeds |
| Kathmandu (काठमाडौं) | Placeholder for city groups and events | Next release: accounts and a database |

News shows headlines and links only. Never store or republish article bodies.

## Running it

```bash
npm install
npx expo start        # scan the QR code with Expo Go, or press a / i / w
npm test              # parser tests (Node 22+)
npm run typecheck
npm run lint
```

The app targets Android and iOS. The web build works for layout checks, but
the browser blocks the news and forex requests (CORS), so those cards show
their error state there.

## Layout

```
src/app/          screens (Expo Router; one file per tab)
src/components/   shared UI (Screen, Card, themed text and views, tabs)
src/hooks/        useAsync for loading + pull-to-refresh
src/lib/          data: Nepali date, NRB forex, RSS parser, news sources
test/             node:test tests for the pure parsers
```
