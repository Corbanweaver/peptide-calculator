const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://peptidecalculator.co";
const host = new URL(siteUrl).host;
const key = "29ce5d83b8dc4b208fe26feb1b98e241";
const keyLocation = `${siteUrl}/${key}.txt`;
const sitemapUrl = `${siteUrl}/sitemap.xml`;
const endpoint = "https://api.indexnow.org/indexnow";

const sitemapResponse = await fetch(sitemapUrl);

if (!sitemapResponse.ok) {
  throw new Error(
    `Could not fetch sitemap: ${sitemapResponse.status} ${sitemapResponse.statusText}`,
  );
}

const sitemap = await sitemapResponse.text();
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => match[1],
);

if (!urlList.length) {
  throw new Error(`No URLs found in ${sitemapUrl}`);
}

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  body: JSON.stringify({
    host,
    key,
    keyLocation,
    urlList,
  }),
});

if (![200, 202].includes(response.status)) {
  throw new Error(
    `IndexNow submission failed: ${response.status} ${await response.text()}`,
  );
}

console.log(
  `Submitted ${urlList.length} URLs to IndexNow. Status: ${response.status}.`,
);
