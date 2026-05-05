# PeptiCalc SEO Launch Checklist

Use this after each content push so the site grows in a clean, repeatable way.

## 1. Deploy the latest code

1. Push to `main`.
2. Wait for Vercel to finish the production deployment.
3. Visit `https://peptidecalculator.co/sitemap.xml` and confirm the new URLs appear.

## 2. Add Google Search Console

Official docs:

- Add a property: https://support.google.com/webmasters/answer/34592
- Verify ownership: https://support.google.com/webmasters/answer/9008080

Recommended setup:

1. Open https://search.google.com/search-console.
2. Click **Add property**.
3. Choose **Domain**.
4. Enter `peptidecalculator.co`.
5. Copy the Google TXT verification value.
6. In Namecheap, open **Domain List** > `peptidecalculator.co` > **Advanced DNS**.
7. Add a **TXT Record**:
   - Host: `@`
   - Value: the full `google-site-verification=...` value from Google
   - TTL: Automatic
8. Save, wait a few minutes, then click **Verify** in Search Console.
9. Keep the TXT record in Namecheap so ownership stays verified.

## 3. Submit the sitemap

1. In Search Console, choose the `peptidecalculator.co` property.
2. Open **Sitemaps**.
3. Submit `https://peptidecalculator.co/sitemap.xml`.
4. Check that Google shows the sitemap as successful.

## 4. Request indexing for important pages

Start with:

- `https://peptidecalculator.co/`
- `https://peptidecalculator.co/calculator`
- `https://peptidecalculator.co/peptides`
- `https://peptidecalculator.co/tools`
- New compound and tool pages from the sitemap

Use **URL Inspection** > paste the URL > **Request indexing**.

## 5. Weekly growth loop

Every week:

1. Open Search Console > **Performance**.
2. Look for queries with impressions but low clicks.
3. Add or improve pages for those exact searches.
4. Keep all medical content math-focused and source-backed.
5. Avoid personalized dosing advice, protocols, or unsupported research-compound directions.

## 6. Add Google Analytics

Official Google setup doc:

- https://support.google.com/analytics/answer/9304153

Setup:

1. Open https://analytics.google.com.
2. Create an Analytics account if you do not already have one.
3. Create a GA4 property for `PeptiCalc`.
4. Add a **Web** data stream for `https://peptidecalculator.co`.
5. Copy the **Measurement ID**. It should start with `G-`.
6. In Vercel, open the PeptiCalc project > **Settings** > **Environment Variables**.
7. Add:
   - Name: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - Value: your `G-...` Measurement ID
   - Environments: Production and Preview
8. Redeploy the site.
9. In Google Analytics, open **Reports** > **Realtime** and visit the site in another tab to confirm your visit appears.

## 7. Monetization order

Best order for this site:

1. Build traffic with free calculator pages.
2. Add a simple email capture for saved calculations and updates.
3. Add ads only after traffic is steady.
4. Add a paid account later for saved protocols, printable guides, dose logs, and premium calculators.
5. Avoid selling email lists. It hurts trust and can create privacy/legal headaches.
