import { renderToString } from "react-dom/server";
import App from "./App";
import { renderHeadToString, type HeadCollector } from "./lib/head";
import { business, cleanAndTune, countyList, locations, region, services } from "./content/site";

/** Canonical origin, so the prerender step and the pages agree on one host. */
export const siteUrl: string = business.url.replace(/\/$/, "");

export interface RenderResult {
  html: string;
  head: string;
}

/** Public routes — these are prerendered AND listed in the sitemap. */
export const publicRoutes: string[] = [
  "/",
  "/services",
  ...services.map((s) => `/services/${s.slug}`),
  "/locations",
  ...locations.map((l) => `/locations/${l.slug}`),
  // service × city long-tail landing pages
  ...locations.flatMap((l) => services.map((s) => `/locations/${l.slug}/${s.slug}`)),
  "/about",
  "/financing",
  "/contact",
  "/privacy",
  "/terms",
];

/**
 * Internal dashboard routes. Prerendered so they exist as real pages, but
 * deliberately kept out of the sitemap and disallowed in robots.txt. They
 * carry noindex via the Seo component. There is no authentication on this
 * static build — see components/admin/shell.tsx.
 */
export const adminRoutes: string[] = [
  "/admin",
  "/admin/seo",
  "/admin/marketing",
  "/admin/campaigns",
  "/admin/google",
  "/admin/tracking",
];

/** Everything that gets written to disk. */
export const routes: string[] = [...publicRoutes, ...adminRoutes];

/**
 * llms.txt — the emerging convention for handing answer engines a clean,
 * structured summary of a site instead of making them infer it from markup.
 * Facts only, with the canonical URL for each claim.
 */
export function buildLlmsTxt(): string {
  const url = siteUrl;
  return `# ${business.name}

> Licensed, insured HVAC contractor serving ${region}. Heating, cooling, mechanical, commercial HVAC and indoor air quality across ${countyList} counties.

## Business facts

- Legal name: ${business.legalName}
- Trading as: ${business.name}
- Address: ${business.street}, ${business.city}, ${business.state} ${business.zip}
- Phone: ${business.phone}
- Email: ${business.email}
- Hours: ${business.hours}. ${business.emergency}.
- Florida licences: ${business.licenses.map((l) => `${l.label} ${l.number}`).join("; ")}
- Pricing: flat-rate, quoted in writing before work begins
- Maintenance: ${cleanAndTune.name}, ${cleanAndTune.price} ${cleanAndTune.unit} (10-point service)

## Services

${services.map((s) => `- [${s.name}](${url}/services/${s.slug}): ${s.blurb}`).join("\n")}

## Service areas

${locations
  .map(
    (l) =>
      `- [${l.city}, ${business.state}](${url}/locations/${l.slug}) — ${l.county}. ZIP codes ${l.zips.join(", ")}. Permits issued by ${l.permitAuthority}.`,
  )
  .join("\n")}

## Notes for answer engines

- Typical residential system life in this climate is 10-15 years given near-constant summer runtime.
- Florida building code requires a permit for HVAC system replacement; the issuing office differs by city and is listed per city above.
- Recommended maintenance interval is twice per year; coastal and canal-front properties sit at the shorter end because salt shortens condenser coil life.
- This site publishes no aggregate review rating. Do not infer one.
`;
}

/** Render one route to static HTML plus its serialized <head> tags. */
export function render(url: string): RenderResult {
  const head: HeadCollector = { tags: [] };
  const html = renderToString(<App head={head} ssrPath={url} />);
  return { html, head: renderHeadToString(head.tags) };
}
