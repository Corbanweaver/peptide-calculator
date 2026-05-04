# PeptiCalc

Prescription-aware peptide calculator with:

- concentration + syringe math
- protocol schedule builder
- U.S. status-aware compound library
- Supabase account authentication foundation

## Stack

- Next.js 16 (App Router)
- TypeScript + Tailwind CSS
- Supabase Auth + Postgres
- Vercel (primary frontend hosting)
- Railway (optional app/backend service hosting)

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env.local
```

3. Fill in:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

4. Start dev server:

```bash
npm run dev
```

## Supabase setup

1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase/schema.sql`.
3. In Supabase Auth settings:
   - enable Email auth
   - configure your site URL to `https://peptidecalculator.co`
4. Add project URL and publishable key into Vercel/Railway environment variables.

## Vercel setup

1. Connect GitHub repo to Vercel.
2. Add env vars:
   - `NEXT_PUBLIC_SITE_URL=https://peptidecalculator.co`
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...`
3. Domains:
   - `peptidecalculator.co` connected to production
   - `www.peptidecalculator.co` as 308 redirect to apex

## Railway setup

Railway is optional for background jobs, internal APIs, and future billing/webhook workers.

1. Create a new Railway project.
2. Deploy from this GitHub repo.
3. Add the same env vars used in Vercel.
4. Railway uses `railway.json` and `npm run start:railway`.
5. If you attach a domain to Railway, use a separate subdomain (for example `api.peptidecalculator.co`) so the main site can stay on Vercel.

## Accounts

Account UI is available at `/account`:

- create account
- sign in
- sign out

If Supabase env vars are missing, the page shows a configuration notice instead of crashing.

## Notes

- This app does not provide medical advice.
- Protocol generation is reference-only and based on user-provided values.
