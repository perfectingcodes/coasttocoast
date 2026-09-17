import { renderToString } from "react-dom/server";
import App from "./App";
import { renderHeadToString, type HeadCollector } from "./lib/head";
import { business, locations, services } from "./content/site";

/** Canonical origin, so the prerender step and the pages agree on one host. */
export const siteUrl: string = business.url.replace(/\/$/, "");

export interface RenderResult {
  html: string;
  head: string;
}

/** Every public route that gets prerendered to static HTML. */
export const routes: string[] = [
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

/** Render one route to static HTML plus its serialized <head> tags. */
export function render(url: string): RenderResult {
  const head: HeadCollector = { tags: [] };
  const html = renderToString(<App head={head} ssrPath={url} />);
  return { html, head: renderHeadToString(head.tags) };
}
