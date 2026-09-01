# What kind of platform this is

The answer you should be able to give in one breath, to a hire, a society
president, a journalist, or an investor:

> **Sanjal is practical infrastructure for Nepalis living abroad — a utility
> that grows into a community, not a community hoping to become useful.**

Everything below exists so that nobody on the team has to guess what we are when
a decision gets hard.

## We are not a social network

We are building something that will eventually contain social features. That is
not the same thing, and the distinction is the entire lesson of the first
attempt.

A social network's product is **attention**: it needs everyone present at once,
its value is the graph, and it monetises time spent. Sanjal's product is
**trust**: it needs to be right, its value is that the information and the
listings can be relied upon, and it monetises transactions that trust unlocks.

That single difference decides almost every argument you will have. It is why an
unverified guide wears a banner, why a city hub ships empty rather than
plausible, why paid placement must be visibly labelled, and why we will not
upload anyone's contacts. Those choices look anti-growth from inside an
attention business. Inside a trust business they *are* the asset.

## Three layers, and only two of them need other people

**1. The personal layer — works with zero other users.**
Deadlines, guides, documents. Useful to one person alone on a Tuesday night.
This is the wedge, the retention engine, and the reason there is no cold-start
problem. Nothing here depends on anyone else showing up.

**2. The local layer — needs density in one city, not in the world.**
Events, businesses, societies, rooms, jobs. The critical mass required is a few
hundred people in Sydney, not a million people globally. This is why hubs open
one city at a time and why the first question about a new city is "who is the
organiser", never "how many Nepalis live there".

**3. The transaction layer — where the money is.**
Remittance comparison, directory placement, ticketing, vetted job postings, and
later partner services. Every one of these is a fee on a transaction that
happens because someone trusted us. None of them is an ad.

Layer 1 makes layer 2 possible. Layer 2 makes layer 3 valuable. Building them in
any other order is how this fails.

## One-sided now, two-sided later

Most marketplaces die trying to bootstrap supply and demand simultaneously. We
avoid that entirely for as long as possible: in layer 1 there is no second side.
The user gets full value from software alone.

The second side — businesses, organisers, employers, service providers — only
gets recruited once there is an audience worth appearing in front of. By then we
are selling access to a trusted audience, which is a far easier sale than
selling a listing on an empty page.

## The comparison set

Useful reference points, and the ones that mislead.

- **Hamro Patro** — the closest true analogue: a humble utility that compounded
  into the diaspora's default app, then added services. Study it. Do not attack
  the calendar.
- **Nextdoor** — local-first community, except our "local" is defined by shared
  origin as well as postcode, and our members are scattered across cities.
- **A trusted procedural reference** — for the guides. The value is that it is
  correct and dated, not that it is comprehensive.
- **Not Facebook.** Anyone who describes Sanjal as "Facebook for Nepalis" has
  mis-heard us, including if that person works here.

## What kind of platform, technically

One engine, many clients. `@sanjal/core` holds the product's rules and knows
nothing about React, browsers or phones; web and mobile are presentation layers
over it, and a future partner API is a third. We own the durable things — the
data, the content and its provenance, identity, the contracts — and rent the
volatile ones: frameworks, models, hosting, app stores.

That is a deliberate hedge against the next fifteen years of platform churn. The
client that matters in 2030 may not exist yet. The engine should not care.

## The test, when a decision is genuinely hard

1. **Does it work for someone who is alone on the app?** If it only works once
   many people are here, it belongs to a later layer.
2. **Would we ship it if it produced no growth?** If not, we are optimising for
   attention, and that is the other business.
3. **Can it be abused by someone targeting migrants?** If yes and we have no
   answer, it does not ship — however much it would grow.

## What we are, in ascending order of ambition

The paperwork tool → the place your city's Nepali community is findable → the
default app for living Nepali outside Nepal → the surface every service aimed at
that population reaches it through.

We are at the first. Each one earns the next. None of them is skippable.
