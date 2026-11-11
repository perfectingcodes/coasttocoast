import { useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Phone } from "lucide-react";
import { business, locations, type Location } from "@/content/site";
import { saltNote } from "@/content/local";
import { MAP_BOUNDS, MAP_COUNTIES, MAP_H, MAP_W } from "@/content/map-geo";
import { SectionEyebrow } from "@/components/brand";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Coverage map.
 *
 * Drawn as a chart rather than as an illustration. The county shapes are the
 * U.S. Census Bureau's own cartographic boundaries (see scripts/build-map.py)
 * and the pins run through the same projection, so the coastline, the county
 * lines and every city on them agree because they come from one source —
 * Charlotte Harbor, Pine Island and Sanibel are where they actually are.
 *
 * The furniture is a map's furniture: a graticule with its degrees marked, a
 * scale bar, a north mark and a source line. No glow, no mascot, no animated
 * route. A property manager looking at this should read it the way they read
 * a site plan.
 */

const LAT_SPAN = MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat;
const LNG_SPAN = MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng;

function px(lat: number, lng: number) {
  return {
    x: ((lng - MAP_BOUNDS.minLng) / LNG_SPAN) * MAP_W,
    y: ((MAP_BOUNDS.maxLat - lat) / LAT_SPAN) * MAP_H,
  };
}

/** Graticule at every quarter degree; labelled at the halves. */
const LATS = [26.0, 26.25, 26.5, 26.75, 27.0, 27.25];
const LNGS = [-82.5, -82.25, -82.0, -81.75, -81.5, -81.25];

/** County names sit inland, where there is room and no pin. */
const COUNTY_LABELS: { name: string; lat: number; lng: number }[] = [
  { name: "Sarasota", lat: 27.14, lng: -82.2 },
  { name: "Charlotte", lat: 26.83, lng: -81.76 },
  { name: "Lee", lat: 26.735, lng: -81.68 },
  { name: "Collier", lat: 26.12, lng: -81.42 },
];

/** Cities whose label reads better on the seaward side of the pin. */
const LABEL_LEFT = new Set(["cape-coral", "port-charlotte"]);

/** Twenty statute miles, in map units. One degree of latitude is 69.05 mi. */
const MILES_20 = (20 / (LAT_SPAN * 69.05)) * MAP_H;

export function ServiceMap() {
  const [activeSlug, setActiveSlug] = useState(
    locations.find((l) => l.focus)?.slug ?? locations[0].slug,
  );
  const active = locations.find((l) => l.slug === activeSlug)!;
  const shop = px(business.lat, business.lng);

  return (
    <section className="relative overflow-hidden bg-navy-deep py-16 text-white md:py-24">
      <div className="shell relative">
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-end">
          <div>
            <SectionEyebrow index={6} className="text-cyan">
              Where we work
            </SectionEyebrow>
            <h2 className="poster mt-4 text-[clamp(1.9rem,4.2vw,2.9rem)] text-white">
              Four counties,
              <span className="block text-chill">one crew.</span>
            </h2>
          </div>
          <p className="max-w-xl leading-relaxed text-white/70 md:text-lg">
            Based in {business.city} and on the road most of the day. The same
            people, the same pricing and the same line answered around the
            clock in every one of these {locations.length} towns.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-12">
          {/* ------------------------------------------------------- chart */}
          <figure className="min-w-0">
            <div className="overflow-hidden rounded-card ring-1 ring-white/14">
              <svg
                viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                className="block w-full"
                role="img"
                aria-label={`Coverage map: ${locations.length} Southwest Florida towns across Sarasota, Charlotte, Lee and Collier counties`}
              >
                {/* Water */}
                <rect width={MAP_W} height={MAP_H} fill="#050f26" />

                {/* Graticule */}
                <g stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1">
                  {LATS.map((lat) => (
                    <line key={lat} x1="0" x2={MAP_W} y1={px(lat, 0).y} y2={px(lat, 0).y} />
                  ))}
                  {LNGS.map((lng) => (
                    <line key={lng} y1="0" y2={MAP_H} x1={px(0, lng).x} x2={px(0, lng).x} />
                  ))}
                </g>

                {/* Land outside the service area */}
                <g fill="#10305f" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.8">
                  {MAP_COUNTIES.filter((c) => !c.service).map((c) => (
                    <path key={c.id} d={c.d} />
                  ))}
                </g>

                {/* The four counties. The one holding the selected town lifts. */}
                {MAP_COUNTIES.filter((c) => c.service).map((c) => {
                  const on = active.county.startsWith(c.name);
                  return (
                    <path
                      key={c.id}
                      d={c.d}
                      fill={on ? "#1d6fe0" : "#14509f"}
                      stroke="#7fdcff"
                      strokeOpacity={on ? 0.95 : 0.55}
                      strokeWidth={on ? 1.4 : 0.9}
                      strokeLinejoin="round"
                      className="transition-[fill,stroke-opacity] duration-300"
                    />
                  );
                })}

                {/* Degree marks, on the frame like a chart's. */}
                <g
                  fill="#ffffff"
                  fillOpacity="0.38"
                  className="select-none font-mono text-[11px]"
                >
                  {[26.0, 26.5, 27.0].map((lat) => (
                    <text key={lat} x={MAP_W - 8} y={px(lat, 0).y - 5} textAnchor="end">
                      {lat.toFixed(1)}°N
                    </text>
                  ))}
                  {[-82.5, -82.0, -81.5].map((lng) => (
                    <text key={lng} x={px(0, lng).x + 5} y={MAP_H - 9}>
                      {Math.abs(lng).toFixed(1)}°W
                    </text>
                  ))}
                </g>

                {/* County names */}
                <g
                  fill="#ffffff"
                  fillOpacity="0.5"
                  className="select-none font-mono text-[12px] font-semibold uppercase"
                  style={{ letterSpacing: "0.16em" }}
                >
                  {COUNTY_LABELS.map((c) => {
                    const { x, y } = px(c.lat, c.lng);
                    return (
                      <text key={c.name} x={x} y={y} textAnchor="middle">
                        {c.name}
                      </text>
                    );
                  })}
                </g>

                {/* Scale and north, in open water. */}
                <g transform={`translate(28 ${MAP_H - 46})`}>
                  <line x1="0" x2={MILES_20} y1="0" y2="0" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.5" />
                  <line x1="0" x2="0" y1="-5" y2="5" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.5" />
                  <line x1={MILES_20 / 2} x2={MILES_20 / 2} y1="-3" y2="3" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.2" />
                  <line x1={MILES_20} x2={MILES_20} y1="-5" y2="5" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.5" />
                  <text x="0" y="-11" fill="#ffffff" fillOpacity="0.6" className="select-none font-mono text-[11px]">
                    20 mi
                  </text>
                </g>
                <g transform="translate(34 40)" fill="none" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1.4">
                  <path d="M0 14 L0 -12 M-5 -5 L0 -12 L5 -5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="0" y="29" textAnchor="middle" stroke="none" fill="#ffffff" fillOpacity="0.6" className="select-none font-mono text-[11px]">
                    N
                  </text>
                </g>

                {/* The shop: a square, because it is not a town. */}
                <g>
                  <rect
                    x={shop.x - 5}
                    y={shop.y - 5}
                    width="10"
                    height="10"
                    transform={`rotate(45 ${shop.x} ${shop.y})`}
                    fill="#ffffff"
                    stroke="#ff6a13"
                    strokeWidth="2.5"
                  />
                  <text
                    x={shop.x + 13}
                    y={shop.y + 4}
                    fill="#ffb48a"
                    stroke="#06142e"
                    strokeWidth="3.5"
                    paintOrder="stroke"
                    className="select-none font-mono text-[14px] font-semibold uppercase lg:text-[11px]"
                    style={{ letterSpacing: "0.1em" }}
                  >
                    Shop
                  </text>
                </g>

                {/* Towns */}
                {locations.map((l) => (
                  <Pin
                    key={l.slug}
                    loc={l}
                    active={l.slug === activeSlug}
                    onPick={() => setActiveSlug(l.slug)}
                  />
                ))}
              </svg>
            </div>

            <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-white/45">
              <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-orange" aria-hidden="true" />
                  Focus markets
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-white" aria-hidden="true" />
                  Also covered
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rotate-45 bg-white ring-1 ring-orange" aria-hidden="true" />
                  Our shop
                </span>
              </span>
              <span>County boundaries: U.S. Census Bureau, 2023</span>
            </figcaption>
          </figure>

          {/* ------------------------------------------------ detail panel */}
          <div className="min-w-0">
            <div className="rounded-card bg-white/[0.06] p-6 ring-1 ring-white/14 md:p-7">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.12em]">
                <span className="text-white/50">{active.county}</span>
                {active.focus && (
                  <span className="flex items-center gap-1.5 text-orange-light">
                    <span className="size-1.5 rounded-full bg-orange" aria-hidden="true" />
                    Focus market
                  </span>
                )}
              </p>

              <h3 className="poster mt-3 text-[1.9rem] text-white sm:text-[2.2rem]">
                {active.city}
              </h3>

              <dl className="mt-6 grid grid-cols-1 gap-x-6 border-t border-white/12 sm:grid-cols-2">
                {[
                  ["ZIP codes", active.zips.join(", ")],
                  ["Permits issued by", active.permitAuthority],
                  ["Coastal exposure", saltNote(active).short],
                  ["Districts", active.neighborhoods.slice(0, 3).join(", ")],
                ].map(([k, v]) => (
                  <div key={k} className="border-b border-white/10 py-3.5">
                    <dt className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white/45">
                      {k}
                    </dt>
                    <dd className="mt-1 text-[0.86rem] leading-snug text-white/88">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href={`/locations/${active.slug}`}>
                  {active.city} coverage
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href={business.phoneHref} variant="outline">
                  <Phone className="size-4" aria-hidden="true" />
                  {business.phone}
                </ButtonLink>
              </div>
            </div>

            {/* Real links, not buttons: hovering previews the town on the map,
                clicking goes to its page — so every town stays crawlable from
                the home page and reachable without a pointer. */}
            <p className="mt-7 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white/45">
              Every town on the route
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 sm:grid-cols-3">
              {locations.map((l) => (
                <li key={l.slug} className="border-b border-white/10">
                  <Link
                    href={`/locations/${l.slug}`}
                    onMouseEnter={() => setActiveSlug(l.slug)}
                    onFocus={() => setActiveSlug(l.slug)}
                    aria-current={l.slug === activeSlug ? "true" : undefined}
                    className={cn(
                      "flex min-h-11 items-center justify-between gap-2 text-[0.86rem] font-semibold transition-colors",
                      l.slug === activeSlug ? "text-white" : "text-white/60 hover:text-white",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className={cn(
                          "size-1.5 shrink-0 rounded-full",
                          l.focus ? "bg-orange" : "bg-white/50",
                        )}
                        aria-hidden="true"
                      />
                      <span className="truncate">{l.city}</span>
                    </span>
                    <ArrowUpRight
                      className={cn(
                        "size-3.5 shrink-0 transition-opacity",
                        l.slug === activeSlug ? "text-cyan opacity-100" : "opacity-0",
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pin({
  loc,
  active,
  onPick,
}: {
  loc: Location;
  active: boolean;
  onPick: () => void;
}) {
  const { x, y } = px(loc.lat, loc.lng);
  const left = LABEL_LEFT.has(loc.slug);
  const r = loc.focus ? 5.5 : 4;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${loc.city}, ${loc.county}`}
      aria-pressed={active}
      onMouseEnter={onPick}
      onFocus={onPick}
      onClick={onPick}
      className="cursor-pointer outline-none"
    >
      {/* A generous invisible target: the dot alone is far too small to tap. */}
      <circle cx={x} cy={y} r="20" fill="transparent" />
      {active && (
        <circle cx={x} cy={y} r="12" fill="none" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="1.2" />
      )}
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={loc.focus ? "#ff6a13" : "#ffffff"}
        stroke="#06142e"
        strokeWidth="1.8"
      />
      <text
        x={x + (left ? -1 : 1) * (active ? 17 : 11)}
        y={y + 5}
        textAnchor={left ? "end" : "start"}
        fill="#ffffff"
        fillOpacity={active ? 1 : 0.86}
        stroke="#06142e"
        strokeWidth="4"
        strokeOpacity="0.9"
        paintOrder="stroke"
        className={cn(
          "pointer-events-none select-none text-[19px] lg:text-[14.5px]",
          active || loc.focus ? "font-bold" : "font-medium",
        )}
      >
        {loc.city}
      </text>
    </g>
  );
}
