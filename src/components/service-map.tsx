import { useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { business, locations, type Location } from "@/content/site";
import { saltNote } from "@/content/local";
import { Pill, SeasonCard } from "@/components/brand";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Coverage map.
 *
 * Pins are positioned from the real coordinates in content/site.ts by a plain
 * equirectangular projection, so their positions relative to one another are
 * accurate. The coastline behind them is a deliberate stylisation rather than
 * survey data — it exists to orient the eye, which is why the panel says so.
 */

const BOUNDS = { minLat: 26.08, maxLat: 27.03, minLng: -82.16, maxLng: -81.7 };
/** Projection width. The canvas is wider so labels have room to sit east of
 *  their pin without being clipped at the edge. */
const W = 440;
const VIEW_W = 610;
const H = 720;

function project(loc: Location) {
  return {
    x: ((loc.lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * W,
    y: ((BOUNDS.maxLat - loc.lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * H,
  };
}

/** Stylised Gulf coastline: land to the east, water to the west. */
const COAST =
  `M${VIEW_W} 0 L40 0 C30 58, 92 78, 80 130 C68 182, 152 198, 150 250 ` +
  "C148 302, 198 330, 210 390 C222 450, 278 470, 290 530 " +
  `C302 590, 330 640, 330 720 L${VIEW_W} 720 Z`;

export function ServiceMap() {
  const [activeSlug, setActiveSlug] = useState(
    locations.find((l) => l.focus)?.slug ?? locations[0].slug,
  );
  const active = locations.find((l) => l.slug === activeSlug)!;
  const focusCities = locations.filter((l) => l.focus);

  return (
    <section className="band-navy grain relative overflow-hidden py-14 md:py-16">
      <div className="shell relative">
        <div className="max-w-2xl">
          <p className="eyebrow text-cyan">Where we work</p>
          <h2 className="poster mt-4 text-[clamp(2rem,4.6vw,3.25rem)] text-white">
            {locations.length} cities.
            <span className="block text-chill">Three counties.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/75">
            Same crew, same pricing, same 24/7 line in every one.
          </p>
        </div>

        {/* Fastest path for the three markets most visitors want. */}
        <ul className="mt-6 flex flex-wrap gap-3">
          {focusCities.map((l) => (
            <li key={l.slug}>
              <Link
                href={`/locations/${l.slug}`}
                onMouseEnter={() => setActiveSlug(l.slug)}
                onFocus={() => setActiveSlug(l.slug)}
                className="group flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-2.5 ring-1 ring-orange/50 transition-colors hover:bg-white/16"
              >
                <MapPin className="size-4 text-orange" aria-hidden="true" />
                <span className="font-display text-sm font-extrabold text-white">
                  {l.city}
                </span>
                <ArrowUpRight
                  className="size-3.5 text-white/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
          {/* --------------------------------------------------------- map */}
          <div className="relative mx-auto w-full max-w-sm">
            <svg
              viewBox={`0 0 ${VIEW_W} ${H}`}
              className="w-full"
              role="img"
              aria-label={`Schematic coverage map of ${locations.length} Southwest Florida cities`}
            >
              <defs>
                <linearGradient id="map-land" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#123a7a" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#0a2352" stopOpacity="0.9" />
                </linearGradient>
                <radialGradient id="map-glow" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#2bd9ff" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#2bd9ff" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Gulf */}
              <rect width={VIEW_W} height={H} fill="#050f26" rx="18" />
              <g stroke="#2bd9ff" strokeOpacity="0.14" strokeLinecap="round">
                {Array.from({ length: 13 }, (_, i) => (
                  <path
                    key={i}
                    d={`M6 ${44 + i * 52} q28 -11 56 0 t56 0`}
                    fill="none"
                    strokeWidth="2"
                  />
                ))}
              </g>

              {/* Land */}
              <path d={COAST} fill="url(#map-land)" />
              <path
                d={COAST}
                fill="none"
                stroke="#2bd9ff"
                strokeOpacity="0.5"
                strokeWidth="2"
              />

              {/* Pins */}
              {locations.map((l) => {
                const { x, y } = project(l);
                const isActive = l.slug === activeSlug;
                return (
                  <g key={l.slug}>
                    {isActive && <circle cx={x} cy={y} r="46" fill="url(#map-glow)" />}
                    {l.focus && !isActive && (
                      <circle
                        cx={x}
                        cy={y}
                        r="17"
                        fill="none"
                        stroke="#ff6a13"
                        strokeOpacity="0.45"
                        strokeWidth="2"
                      />
                    )}
                    <g
                      role="button"
                      tabIndex={0}
                      aria-label={`${l.city}, ${l.county}`}
                      aria-pressed={isActive}
                      onClick={() => setActiveSlug(l.slug)}
                      onMouseEnter={() => setActiveSlug(l.slug)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveSlug(l.slug);
                        }
                      }}
                      className="cursor-pointer outline-none focus-visible:[&>circle:nth-child(2)]:stroke-white"
                    >
                      {/* generous invisible hit area */}
                      <circle cx={x} cy={y} r="26" fill="transparent" />
                      <circle
                        cx={x}
                        cy={y}
                        r={l.focus ? 11 : 8}
                        fill={l.focus ? "#ff6a13" : "#2bd9ff"}
                        stroke="#050f26"
                        strokeWidth="3"
                        className="transition-all duration-200"
                        style={{ transform: isActive ? "scale(1.25)" : undefined, transformOrigin: `${x}px ${y}px` }}
                      />
                      <text
                        x={x + (l.focus ? 18 : 15)}
                        y={y + 5}
                        fill={isActive ? "#ffffff" : "rgba(255,255,255,0.62)"}
                        fontSize="19"
                        fontWeight={l.focus ? 800 : 600}
                        className="pointer-events-none select-none"
                        style={{ fontFamily: "Archivo, sans-serif" }}
                      >
                        {l.city}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {[
                { c: "bg-orange", label: "Focus markets" },
                { c: "bg-cyan", label: "Also covered" },
              ].map((k) => (
                <li
                  key={k.label}
                  className="flex items-center gap-2 font-display text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-white/45"
                >
                  <span className={cn("size-2.5 rounded-full", k.c)} aria-hidden="true" />
                  {k.label}
                </li>
              ))}
              <li className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-white/30">
                Tap a pin
              </li>
            </ul>

            {/* The mascot stands in the Gulf, pointing back at the coast. */}
            <img
              src="/brand/mascot.webp"
              srcSet="/brand/mascot-sm.webp 360w, /brand/mascot.webp 900w"
              sizes="(min-width: 640px) 168px, 132px"
              alt=""
              width={900}
              height={1513}
              loading="lazy"
              className="pointer-events-none absolute -bottom-6 -left-8 w-32 drop-shadow-[0_18px_36px_rgb(5_15_38/0.85)] sm:-left-10 sm:w-40"
            />
          </div>

          {/* ------------------------------------------------ detail panel */}
          <div>
            <div className="glass edge-lit p-5 md:p-6">
              <div className="flex flex-wrap items-center gap-3">
                {active.focus && (
                  <Pill icon={<MapPin className="size-3.5 text-orange" />}>
                    Focus market
                  </Pill>
                )}
                <span className="font-display text-xs font-extrabold uppercase tracking-[0.18em] text-white/50">
                  {active.county}
                </span>
              </div>

              <h3 className="poster mt-4 text-3xl text-white">
                {active.city}
                <span className="text-cyan">.</span>
              </h3>


              <dl className="mt-6 grid gap-4 border-t border-white/12 pt-5 sm:grid-cols-2">
                {[
                  ["ZIP codes", active.zips.join(", ")],
                  ["Permits issued by", active.permitAuthority],
                  ["Coastal exposure", saltNote(active).short],
                  ["Neighborhoods", active.neighborhoods.slice(0, 3).join(", ")],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-white/45">
                      {k}
                    </dt>
                    <dd className="mt-1 text-sm leading-snug text-white/85">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href={`/locations/${active.slug}`}>
                  {active.city} services
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href={business.phoneHref} variant="outline">
                  <Phone className="size-4" aria-hidden="true" />
                  {business.phone}
                </ButtonLink>
              </div>
            </div>

            {/* Real links, not buttons: hovering previews the city on the map,
                clicking goes to its page — so every city stays crawlable from
                the home page and reachable without a pointer. */}
            <p className="mt-6 font-display text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-white/40">
              Every city we cover
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {locations.map((l) => (
                <li key={l.slug}>
                  <Link
                    href={`/locations/${l.slug}`}
                    onMouseEnter={() => setActiveSlug(l.slug)}
                    onFocus={() => setActiveSlug(l.slug)}
                    aria-current={l.slug === activeSlug ? "true" : undefined}
                    className={cn(
                      "block rounded-full px-3.5 py-1.5 font-display text-xs font-extrabold transition-colors",
                      l.slug === activeSlug
                        ? "bg-white text-navy"
                        : l.focus
                          ? "text-white ring-1 ring-orange/50 hover:bg-white/10"
                          : "text-white/65 ring-1 ring-white/20 hover:bg-white/10",
                    )}
                  >
                    {l.city}
                  </Link>
                </li>
              ))}
            </ul>

            <SeasonCard variant="bar" className="mt-4 w-fit" />

            <p className="mt-3 text-[0.7rem] text-white/35">
              Pin positions are plotted from real coordinates; the coastline is a
              stylisation, not survey data.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
