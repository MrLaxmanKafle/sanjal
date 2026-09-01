# Getting this onto GitHub

This project has its own git history already — one commit on `main`, with no
connection to any other repository.

## 1. Create the repository

On GitHub, create a new repository named `sanjal`. Leave **"Add a README",
"Add .gitignore" and "Choose a licence" all unticked** — the repo must be empty
so this history pushes cleanly without a merge.

## 2. Push

From this directory:

```bash
git remote add origin git@github.com:MrLaxmanKafle/sanjal.git
git push -u origin main
```

Use the HTTPS URL instead if you don't have SSH keys set up:
`https://github.com/MrLaxmanKafle/sanjal.git`

## 3. Run it

```bash
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

Node 20 or newer.

## 4. Before launch

- Set `NEXT_PUBLIC_SITE_URL` to the real domain once it is connected. Metadata,
  the sitemap and robots.txt all read from it.
- Set `WAITLIST_WEBHOOK_URL` to somewhere signups can land — a spreadsheet
  automation, an email service, a CRM. Until it is set the form tells people to
  email instead, which is honest but costs you signups.
- Verify the guides. Every one currently shows an "unverified" banner because
  none has been checked against its official sources by a named person. See the
  end of `docs/SEEDING.md`.

Deploy anywhere that runs Node — Vercel, Cloudflare, or a container. No
database, no auth, nothing to provision.

You can delete this file once the repository is up.
