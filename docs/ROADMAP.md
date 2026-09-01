# The build order

You are leading this. This document is the sequence — what to build, in what
order, and the test that says you may move on. The order matters more than the
speed: almost every failed social product built stage 3 before stage 1.

A note on the goal. "Dominate the social media landscape" is not a plan you can
execute against, and treating it as one is what killed the forum. What you can
execute against is: **become the app a Nepali abroad opens without thinking.**
Hamro Patro did exactly that from a calendar. Domination, if it comes, is the
consequence of that habit — never the strategy that produces it.

---

## Stage 0 — Make it real (weeks 1–2)

Everything here is unblocked today; none of it needs a designer or a second
engineer.

1. **Connect the domain** and set `NEXT_PUBLIC_SITE_URL`. Deploy the web app.
2. **Wire the waitlist.** Set `WAITLIST_WEBHOOK_URL`. Until you do, every signup
   is a person you told to send an email instead — most won't.
3. **Verify the six guides.** They all display an "unverified" banner right now,
   and that banner is doing real work. Open each official source, check each
   step, then set `status`, `lastChecked` and `checkedBy`. Budget a day. This is
   the single highest-value thing a human can do on this codebase.
4. **Finish mobile storage.** Three lines in `apps/mobile/src/storage.ts`, plus
   `npx expo install @react-native-async-storage/async-storage`.
5. **Build the mobile add-document form.** The web form exists; the phone shows
   a seeded list. All the rules are already shared — this is presentation only.

**Move on when:** both apps run against the same core, the guides are verified,
and you can hand your phone to someone and have them add their passport.

---

## Stage 1 — Prove someone wants it (weeks 3–10)

Do not add features here. Find out whether the wedge pulls.

6. **Ship web first, mobile ~2 weeks behind.** Not because mobile matters less,
   but because you can fix a web bug in ten minutes and an App Store bug in
   three days. Let the web app absorb the first embarrassing round of feedback.
7. **Get 100 real users.** Not a launch — 100 people you can name. Nepali
   student groups on Facebook, your own city's society, the WhatsApp groups you
   are already in. Post the passport guide, not the app.
8. **Watch one number:** how many people who add a document come back within 30
   days. Nothing else matters yet. Under 20% means the wedge is wrong and no
   amount of building fixes that.
9. **Talk to 20 of them.** Ask what paperwork problem they hit last, not what
   they think of the app. New guides come from those answers.

**Move on when:** 1,000 people have tracked a document, and month-one return is
above 20%.

---

## Stage 2 — Open the cities (months 3–6)

Only now does community make sense, because now there is a reason to be there.

10. **Accounts.** Postgres, passkeys first, social OAuth as convenience only —
    never the sole key, so no platform can lock a user out of their own account.
    The vault stays on-device by default; sync is opt-in and encrypted.
11. **Move content into the database.** Six guides and five cities are fine in
    TypeScript. Sixty and fifty are not. Keep the `review` model exactly as it
    is — it is a safety property, not a nicety.
12. **Open five city hubs by hand.** Follow `docs/SEEDING.md` strictly. One
    local organiser per city. Resist every temptation to bulk-import listings.
13. **Rooms and jobs.** The two things Nepali Facebook groups are actually used
    for, given structure and search. Vet job posts hard — recruitment scams are
    the single worst thing that could happen on your platform.
14. **The assistant.** Retrieval over the *verified* guides only. It must cite
    the guide it answered from, and decline when the guides do not cover
    something. Confidently wrong immigration advice would undo everything the
    provenance model is there to protect.

**Move on when:** ten cities post weekly without you prompting them.

---

## Stage 3 — Become a habit (months 6–12)

15. **Feeds, scoped to a city or a group.** Never a global firehose. A feed is
    a moderation liability you must earn the right to carry.
16. **Romanized-Nepali input** across search and forms. Most of your audience
    types Nepali in Latin script. No global product will build this. It is a
    real moat and it is cheap.
17. **Remittance rate comparison.** Affiliate revenue on the audience's largest
    recurring spend. Comparison only — never touch the money.
18. **Directory revenue.** Paid placement, visibly labelled. The moment a reader
    cannot tell a paid listing from a confirmed one, the directory is worth
    nothing.

**Move on when:** DAU/MAU is above 20% and revenue covers infrastructure.

---

## Stage 4 — Platform (year 2+)

19. Events and ticketing for the societies already using the hubs.
20. Partner services — insurance, property, travel — through the API, never
    built in-house.
21. Payments only via licensed partners. Money transmission is licensed work in
    every country your users live in; building rails is how this project dies.

---

## Things that will kill this, in order of likelihood

- **Building stage 3 first.** A feed with nobody in it is an empty room. This is
  what happened last time.
- **Fake data in the directory.** One closed restaurant and the whole hub reads
  as abandoned.
- **An unverified guide that costs someone a visa.** The banner exists for this.
- **Scam job posts.** Your audience is targeted constantly. Vetting is a safety
  feature, not moderation overhead.
- **Chasing the Gulf market before the product works.** Different phones,
  different data, different needs. Win one segment first.
- **Shipping mobile and web the same day with no users.** You will spend the
  first month fixing store releases instead of learning.

## What not to build, ever, or at least not soon

Messaging (Messenger, Viber and WhatsApp already hold these relationships —
deep-link out). A global feed. Your own money rails. Short video. Each of these
is someone else's won battle.
