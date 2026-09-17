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
