# Security

Most security documents start with a list of controls. This one starts with who
we are protecting and from whom, because for this audience the threat model is
unusual and it is what makes every decision below make sense.

## Who we are protecting

Nepalis living outside Nepal. Many are on temporary visas. Some are labour
migrants whose passports have been held by an employer or agent at some point.
Many send money home every month. Almost all of them are targeted constantly.

The consequence of a breach here is not embarrassment. It is a fraudulent visa
"agent" who knows exactly when your permit expires and calls you the week you
are most desperate. Design accordingly.

## Threat model

Ranked by how likely they are to actually happen to us.

**1. Scammers using the platform as a channel.** Fake recruiters, fake visa
agents, fake remittance deals. They do not need to breach anything — they
just need us to let them post. This is the most probable harm and it arrives
through the front door. Mitigation is product work, not infrastructure:
vetting, verified organisers, reporting, and rate limits on posting.

**2. Credential theft and account takeover.** Password reuse is near-universal,
and phishing that imitates an embassy or a remittance service works well on a
worried person. Assume any password will eventually be known to someone else.

**3. SIM swap and number loss.** This audience changes phone numbers when they
change countries, and SIM-swap fraud is real in several of the countries they
live in. **SMS one-time codes are therefore not an acceptable second factor and
must never be the account recovery path.** This is both a security and a
usability decision.

**4. Bulk theft of document data.** Visa and passport expiry dates, tied to
names and cities, are a target list. Our answer is not to hold them (see below).

**5. Coercive device access.** A labour migrant may hand their unlocked phone to
an employer or agent. Anything valuable must not be visible from a home screen
or a notification preview.

**6. Community harassment and doxxing.** Caste, region, and diaspora politics
are live tensions. Home addresses, workplaces and immigration status must never
be exposed by a profile or a listing.

**7. Insider access.** A small team with production access is normal and fine;
unlogged access to user data is not.

**8. Supply chain.** A compromised npm package reaches every user. Lockfile is
committed, dependencies are updated deliberately, and additions are justified.

Explicitly **out of scope** for now: a targeted state-level adversary. We are
not going to promise protection we cannot deliver. What we do instead is hold
so little data that we are not worth that attack.

## What we deliberately do not collect

The strongest control we have is absence.

- **No passport or document numbers.** The vault holds a label you chose, a
  type, an expiry date, and an optional note. Look at `TrackedDocument` in
  `packages/core/src/documents.ts` — there is no field for a document number,
  and there must not be one. An expiry date leaks far less than an identifier.
- **No document scans or photos.** Not now, and not without a specific,
  argued reason and encryption designed for it.
- **No immigration status as a profile field.**
- **No location history.** A city, chosen by the user, is enough.
- **No contact-list upload.** The usual growth hack; for this audience it is a
  ready-made target list.
- **No analytics or advertising cookies** at present. If measurement is added it
  will be aggregate and privacy-preserving, and `/privacy` will say so before it
  ships.

## Controls in place today

Phase 0 has no database and no accounts, which is a genuine security posture
rather than an accident — the attack surface is one form.

- **The vault never leaves the device.** `createVault(storage)` in core owns the
  rules; the host supplies storage. On web that is `localStorage`, on mobile the
  device store. Nothing is transmitted, so there is no server-side vault to
  breach and no backup of one.
- **Reminders without an account.** Calendar files are generated on-device, so
  reminders need no push service, no phone number, and no user record.
- **Waitlist intake is validated, throttled and honeypotted**
  (`apps/web/app/api/waitlist/route.ts`). It stores nothing itself; it forwards
  to a configured endpoint, and when unconfigured it fails loudly rather than
  dropping addresses silently.
- **Fonts are self-hosted** via `next/font`, so loading a page does not announce
  the visit to a third party.
- **Secrets live in the environment**, never in the repo. `.env.example`
  documents the names only.

### Known gaps, stated plainly

- **No security response headers yet.** `apps/web/next.config.ts` sets none.
  Content-Security-Policy, HSTS, `X-Content-Type-Options`, `Referrer-Policy` and
  `Permissions-Policy` should be added before any real traffic. This is the
  cheapest outstanding item on the list.
- **The waitlist rate limit is per-instance and in memory.** It resets on deploy
  and does not coordinate across regions. Adequate for a waitlist, not for
  anything authenticated.
- **No automated dependency scanning.** Turn on Dependabot.

## Required before accounts ship

Do not merge an authentication system missing any of these.

1. **Passkeys as the primary factor.** Social OAuth may be offered as a
   convenience but must never be the only key — a platform lockout must not
   become an account loss. If passwords exist at all: strong hashing (argon2id
   or bcrypt), and breach-list checking on signup.
2. **No SMS-based second factor or recovery.** See threat 3. Use passkeys and
   recovery codes the user stores themselves.
3. **Row-level security in Postgres**, so an application bug cannot read another
   user's rows. Authorisation checked server-side on every request — Server
   Actions are reachable by direct POST and must verify the session themselves.
4. **Sync stays opt-in and end-to-end encrypted.** The on-device default does
   not change when accounts arrive. If a user opts into sync, we hold ciphertext
   we cannot read.
5. **Audit log for administrative access** to any user record, reviewed.
   Production access is least-privilege and named.
6. **Data export and deletion** that actually work, exercised before launch.
   GDPR and UK GDPR apply to users in Europe, the Privacy Act to those in
   Australia; the obligations arrive with the first user in those countries, not
   with a lawyer's letter.
7. **Notification privacy.** No document details, and no immigration content, in
   a lock-screen preview. See threat 5.
8. **App-level lock** on mobile (device biometric) for the vault.

## Rules for anyone writing code here

- Validate on the server. A client-side check is a convenience, never a control.
- Never log personal data. Not expiry dates, not emails, not tokens.
- Never add a field to `TrackedDocument` that identifies a document.
- Parameterised queries only; no string-built SQL, ever.
- Escape user content on render; treat every submitted listing, event and
  message as hostile input.
- New dependency: justify it. Each one is production access for a stranger.
- Secrets in the environment. If one is ever committed, rotate it — removing the
  commit is not enough.

## Content safety is security here

For this audience these are the same subject.

- **Job postings are the highest-risk content on the platform.** Recruitment
  fraud has cost Nepali migrants their savings and worse. Vet posters, show
  clearly what has and has not been checked, make reporting one tap, and act on
  reports fast.
- **Never let a paid listing look like a verified one.** The moment a reader
  cannot tell them apart, the directory is worth nothing and becomes a channel
  for whoever pays.
- **Moderation must work in Nepali**, including romanized Nepali, or it does not
  work.
- **Guides carry provenance** and say when they are unverified. Wrong procedural
  information can cost someone a visa; that banner is a safety control.

## If something goes wrong

Write this down properly before launch, but the shape is: contain, assess what
data was actually reachable, notify affected users in plain language in both
languages, notify regulators where required and within their deadlines, then
publish what happened. For this audience, warning people quickly that they may
be targeted matters more than protecting the project's reputation.

Security contact: hello@sanjal.com — replace with a monitored address, and
publish it in `/.well-known/security.txt` before launch.
