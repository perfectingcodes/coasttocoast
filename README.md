# Coast to Coast Air

Marketing and local-SEO site for **Coast to Coast Air** — heating, cooling,
mechanical and indoor air quality across Southwest Florida.

Static-generated React: every public route is prerendered to real HTML with its
own `<title>`, meta, canonical and JSON-LD, then hydrated on the client. No
server required — `dist/public/` deploys to any static host.

## Commands

```bash
pnpm install
pnpm dev         # dev server on http://localhost:5173
pnpm typecheck   # tsc --noEmit
pnpm audit:seo   # post-build SEO/GEO audit of dist/public
pnpm build       # client build + SSR build + prerender to dist/public
pnpm serve       # preview the built output
```

`pnpm build` writes **70 static pages** plus `sitemap.xml`, `robots.txt` and
`404.html`.

## Editing content

**Everything lives in [`src/content/site.ts`](src/content/site.ts)** — business
details, services, service areas, the Clean & Tune checklist, testimonials,
FAQs. Pages, footer links, sitemap entries and structured data all derive from
it. Add a service or a city to those arrays and the routes, landing pages and
sitemap entries appear on the next build, with no page edits.

Business facts (phone, address, licences, service areas, the $89 Clean & Tune
checklist) come from the company's existing site, coastswfl.com.

> Anything marked **⚠️ CONFIRM** in `site.ts` was not published publicly and was
> taken from the design comp. Check those with the client before launch — see
> "Before launch" below.

## Brand assets

Master logo art lives in [`brand/`](brand/) (the designer's originals, opaque
white background). The pipeline turns them into every web asset:

```bash
python3 scripts/brand-assets.py
```

For logo art it removes the white background with a border flood-fill — so
whites *enclosed* by the logo outline (the wordmark, the husky's fur) survive.
Photographic assets are resized to WebP at the widths the layout actually uses.
It writes `public/brand/*.{webp,png}`, the favicon set, and the 1200×630
`og.jpg`. Pages reference the WebP; the PNGs are a quantised fallback for the
schema.org `logo` field. Requires Pillow and NumPy.

Image sources and licensing are recorded in [`brand/CREDITS.md`](brand/CREDITS.md).

## Design system

The palette in [`src/index.css`](src/index.css) is sampled directly from the logo
art — deep Gulf navy, the cyan glow off the badge outline, sunset orange and
gold. Rebranding is an edit to that one `@theme` block.

| Token | Use |
| --- | --- |
| `--color-navy` / `--color-navy-deep` | Body text, dark bands, footer |
| `--color-blue` / `--color-blue-bright` | Links, eyebrows, headline accents |
| `--color-cyan` / `--color-cyan-light` | Icons and accents on dark grounds |
| `--color-orange` / `--color-orange-light` | Primary CTA — the only orange on the page |
| `--color-gold` | Sunset highlights, review stars |
| `--color-foam` | Alternating section background |

Type is Montserrat (display), Inter (body) and Caveat (the "Comfort Lives Here."
brush line). The `.sky`, `.band-navy` and `.band-sunset` grounds plus the
`<Wave>` divider carry the coastal identity across every page.

### Photography

| Slot | Asset |
| --- | --- |
| Home + inner-page heroes | `hero-coast.jpg` — Gulf-coast skyline (Unsplash, see [`brand/CREDITS.md`](brand/CREDITS.md)) under a navy wash |
| Why-us band | `photo-condenser.png` — branded condenser, with the Locally Owned badge as a corner sticker |
| Testimonials | `photo-van.png` — wrapped service van |
| About | `badge-locally-owned.png` |

Swap the hero for real Southwest Florida photography — or a shot of the team or
a completed job — when the client supplies it. Only the file needs replacing;
the pipeline and markup stay the same.

## SEO and GEO

### Local content, not templated content

The 48 service × city pages are the whole point of the route tree, and the risk
with that shape is 48 copies of one page with a city name swapped in — which
search engines treat as doorway content and answer engines have no reason to
cite.

[`src/content/local.ts`](src/content/local.ts) derives page copy from facts that
genuinely differ between these cities: the office that issues the permit,
whether condensers sit on brackish water, the age of the housing stock, whether
homes sit empty for months, and whether the area took a direct hit in 2022.
Nothing there invents a claim — each branch restates a documented condition from
`Location.conditions`, the county permitting authority, or the company's own
published service description.

Measured on main-page content with nav and footer stripped:

| Page set | Mean pairwise similarity | Pairs >60% similar | Median words |
| --- | --- | --- | --- |
| City landing pages (8) — before | 65.1% | 28 of 28 | 367 |
| City landing pages (8) — after | 27.7% | 0 of 28 | 704 |
| Service × city (48) | 24.1% | 0 of 1128 | 678 |

The city landing pages were the real duplicate problem: all eight shared one
generic FAQ set, so they emitted eight identical `FAQPage` blocks. They now
carry city-specific questions — permitting office, ZIP coverage, salt cadence —
and 39 of 39 questions across the eight pages are unique.

### Structured data

Each page emits **one** `<script type="application/ld+json">` containing a
linked `@graph`, not a pile of disconnected blocks. Nodes reference each other
by `@id`, so a crawler reads "this Service is provided by that HVACBusiness,
described on this WebPage, which is part of this WebSite."

- `HVACBusiness` / `LocalBusiness` / `Organization` with `geo`, a 50-mile
  `GeoCircle`, every city as a `City` node with coordinates, all three counties
  as `AdministrativeArea`, `hasOfferCatalog` over the six services,
  `hasCredential` for each DBPR licence, and separate weekday/emergency
  `openingHoursSpecification`.
- `Service` nodes on city pages carry `areaServed` as a geocoded `City`
  `containedInPlace` its county.
- `WebPage` carries `speakable` pointed at `h1` and `[data-answer]`.
- **No `aggregateRating`.** The client publishes no review count, and inventing
  one is both a policy violation and a manual-action risk. Supply a real count
  and it can be added in one place.

Run `pnpm audit:seo` after a build to check the whole output — it fails the build
on truncated or duplicated metadata, missing or multiple H1s, unparseable or
unlinked JSON-LD, and near-duplicate body copy across any generated page set.

### GEO (answer engines)

- `llms.txt` is generated at build time from `site.ts` — business facts,
  services, every city with its ZIPs and permitting office, and a short "notes"
  block stating the things an answer engine would otherwise guess at.
- `robots.txt` names the answer-engine crawlers explicitly (GPTBot,
  OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended
  and others); several ignore a bare `User-agent: *`.
- Every substantial page opens with an `AnswerBlock` — one self-contained
  paragraph that still makes sense lifted out of the page, carrying
  `data-answer` so the `speakable` schema can point at it.
- City pages render a real `<table>` of local facts (county, permit authority,
  ZIPs, neighborhoods, coastal exposure, licence), which extracts far more
  cleanly than styled divs.
- Descriptions are clamped to 158 characters on a word boundary by
  `clampDescription` in [`src/lib/seo.tsx`](src/lib/seo.tsx), so a long template
  can never silently ship a truncated snippet.

### Layouts

Each page type has its own structure, so the site does not read as one template
with different words:

| Page | Layout |
| --- | --- |
| Home | Photo hero, at-a-glance strip, service grid, offer split, navy why-us band, testimonial carousel, areas, FAQ |
| Service index | Alternating full-width feature rows, no cards |
| Service | Sticky quote sidebar, numbered process strip on navy, full city matrix |
| Area index | Grouped by county with per-county counts, plus a permitting table |
| City | Wide service matrix, conditions split, fact table, sticky form |
| Service × city | Single narrow reading column, answer first, fact table, form at the end |

## Routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/services`, `/services/:slug` | Service index and detail (6) |
| `/locations`, `/locations/:city` | Service-area index and detail (8) |
| `/locations/:city/:service` | Service × city landing page (48, long-tail SEO) |
| `/about`, `/financing`, `/contact` | Company pages |
| `/privacy`, `/terms` | Legal (noindex) |

## Configuration

| Env var | Used by | Purpose |
| --- | --- | --- |
| `VITE_QUOTE_ENDPOINT` | quote form | JSON `POST` target for lead submissions. Unset, the form falls back to opening a prefilled email so leads are never dropped. |
| `SITE_URL` | prerender | Overrides the origin in `sitemap.xml` / `robots.txt`. Defaults to `business.url`, so set it only for staging deploys. |

## Before launch

- [ ] Confirm the **domain** (`business.url`) and **email** (`business.email`) —
      both currently come from the design comp, not from anything published.
- [ ] Replace the two **placeholder testimonials** in `site.ts` with real,
      attributable Google reviews. Only the first (James T.) is adapted from a
      published review.
- [ ] Confirm the **financing** copy — the client publishes no financing details
      anywhere, so `financing` in `site.ts` is written generically.
- [ ] Confirm **business hours** (currently Mon–Fri 8am–5pm) and that 24/7
      emergency service is accurate.
- [ ] Point `VITE_QUOTE_ENDPOINT` at a real lead inbox or CRM webhook.
- [ ] **The van wrap in `photo-van.png` shows (813) 555-0123 and
      CoastToCoastAir.com** — the design-comp placeholder, not the real
      (239) 518-5928. It is legible at display size on the testimonials
      section. Re-render or photograph the real vehicle before launch.
- [ ] Replace the stock hero photo with real Southwest Florida photography if
      available — see "Photography" above.
- [ ] If the client wants star ratings in search results, supply a real review
      count so `aggregateRating` can be added to the JSON-LD. It is deliberately
      omitted rather than invented.
