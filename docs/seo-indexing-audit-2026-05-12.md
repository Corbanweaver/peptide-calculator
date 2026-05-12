# PeptiCalc SEO Indexing Audit - 2026-05-12

## What I could verify directly

The live site is technically crawlable.

- `https://peptidecalculator.co/` returns `200`.
- `https://peptidecalculator.co/calculator` returns `200`.
- `https://peptidecalculator.co/peptides` returns `200`.
- `https://peptidecalculator.co/tools` returns `200`.
- `https://peptidecalculator.co/sitemap.xml` returns `200` with 41 URLs.
- `https://peptidecalculator.co/robots.txt` allows all crawlers and points to the sitemap.
- Priority SEO pages return `200` and have self-canonical URLs.

## What public search suggests

Google's public results appear to show the homepage first, but not much visibility yet for the newer long-tail calculator pages.

This can happen even when URL Inspection says a page is indexed. Indexing only means Google has accepted the URL. It does not mean Google is showing it for queries yet.

## Pages we want indexed

Priority 1:

- `https://peptidecalculator.co/`
- `https://peptidecalculator.co/peptides/bpc-157-calculator`
- `https://peptidecalculator.co/peptides/tb-500-calculator`
- `https://peptidecalculator.co/peptides/nad-plus-calculator`
- `https://peptidecalculator.co/tools/mcg-to-units-calculator`

Priority 2:

- `https://peptidecalculator.co/peptides/semaglutide-calculator`
- `https://peptidecalculator.co/peptides/tirzepatide-calculator`
- `https://peptidecalculator.co/tools/peptide-reconstitution-calculator`
- `https://peptidecalculator.co/tools/u100-syringe-units-calculator`
- `https://peptidecalculator.co/tools/bac-water-calculator`

Do not prioritize:

- `/account` because it is an auth/profile page, not a search landing page.
- `/offline` because it is only a PWA fallback page.

## Changes made from this audit

- Added stronger metadata and canonical URLs to the homepage, calculator, peptide library, and tool index.
- Added structured data to the homepage for the calculator app.
- Removed `/account` from the sitemap.
- Marked `/account` as `noindex`.

## Why clicks are still low

Likely causes:

1. The site is new, so Google has not built trust yet.
2. The main pages have very little backlink authority.
3. Some long-tail pages may be indexed but not ranking yet.
4. Google may still be using older cached snippets for the homepage.
5. The niche is health-adjacent, so Google can be slower and more selective.

## Next actions

1. Request indexing for the homepage again after this deploy:
   - `https://peptidecalculator.co/`
2. Request indexing for only 2-3 priority pages:
   - `https://peptidecalculator.co/peptides/bpc-157-calculator`
   - `https://peptidecalculator.co/tools/mcg-to-units-calculator`
   - `https://peptidecalculator.co/peptides/nad-plus-calculator`
3. Build 2-3 real backlinks or mentions:
   - GitHub repo About link
   - one app/tool directory
   - one founder/community feedback post when the account is old enough
4. Check Search Console weekly, not daily:
   - Performance > Search results > Pages
   - Performance > Search results > Queries
   - Indexing > Pages

## What to send me from Search Console if possible

Screenshots or exports of:

1. Performance > Queries, last 28 days.
2. Performance > Pages, last 28 days.
3. Indexing > Pages, especially rows for:
   - Indexed
   - Crawled - currently not indexed
   - Discovered - currently not indexed
   - Duplicate without user-selected canonical

Those reports will tell us whether the next move should be title rewrites, more unique content, or backlinks.
