# Seeding a city hub

City hubs ship empty. This is the process for opening one, and it is manual on
purpose: the point of the hub is that everything in it is true, which is the one
thing a scraped or crowd-filled directory cannot promise.

The bar: **a listing appears only after a person has confirmed it.** Not "found
it on Google Maps" — confirmed it is trading, and that the people running it
know they are listed.

## 1. Find the one person

A hub opens when someone local already knows the scene: a society committee
member, a student association organiser, the person who runs the group chat
everyone actually reads. One person is enough. Two is better.

They are not being asked to write software or moderate a forum. They are being
asked to answer: what is on, who runs it, and which businesses are ours.

## 2. Ask the organisations first

Before listing a society, NRNA chapter or student association, ask them. Two
reasons: they will correct the details you were about to get wrong, and a group
that finds itself listed without being asked starts as an opponent rather than a
partner. They are also the source for events, which is where the recurring value
is.

Record them in `lib/cities.ts` under `organisations`.

## 3. Events: only from the organiser

Add an event only when it comes from whoever is running it, with a date they
have confirmed.

Festival dates move every year with the lunar calendar — Dashain and Tihar are
not on fixed Gregorian dates, and a hub that gets this wrong once will not be
trusted again. Never carry last year's date forward.

Past events stay in the data. They are how someone new to the city sees that the
place is alive.

## 4. Businesses: confirm they are trading

Restaurants, groceries, remittance agents, accountants, lawyers, travel agents.
For each one, confirm it is currently open before setting `confirmed: true`. A
closed restaurant in the directory is the fastest way to make the whole hub look
abandoned.

Do not accept payment for placement while seeding. Once directory revenue starts
(see the blueprint), paid placement must be visibly labelled — the moment a
reader cannot tell a paid listing from a confirmed one, the directory is worth
nothing.

## 5. Open the hub

A hub is ready when it has, roughly: one or two organisations, at least one
upcoming event, and enough businesses that a newcomer would find the list
useful. `isSeeded()` in `lib/cities.ts` flips the label on the index page as soon
as any of the three arrays has content, so partially-seeded hubs are visible
rather than hidden.

## 6. Keep it true

Set a monthly reminder per hub: check upcoming events are still happening,
remove businesses that closed, refresh next year's festival dates when they are
announced. A hub nobody maintains becomes actively misleading within about a
year — that is roughly the lifespan of an unmaintained diaspora directory, and
it is why most of them are dead.

---

## Which cities are next

The first five (`lib/cities.ts`) were chosen for population density and existing
organisers. The next ones should go wherever a willing local organiser is, not
wherever the population numbers say — the constraint is people, not demand.

## Guides work the same way

A guide stays `status: "unverified"` and shows a banner until a named person has
opened every official source listed on it and checked the steps against them, on
a recorded date. Then set `status`, `lastChecked` and `checkedBy` in
`lib/guides.ts`.

Re-verify at least annually. Nepal has moved several of these processes online
in the last few years and the entry points have changed more than once, so an
old guide is not merely stale — it sends people to a form that no longer exists.
