import { useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { business, countyList, locations, type Location } from "@/content/site";
import { saltNote } from "@/content/local";
import { Pill, SeasonCard, SectionEyebrow } from "@/components/brand";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Coverage map.
 *
 * Pins and coastline share one equirectangular projection, so the shape of the
 * coast, the angle it runs at and the position of every city on it agree with
 * one another. The shore is a simplified read of the real coastline rather
 * than survey data — barrier islands are taken as the coast and the smaller
 * sounds are left out — which is what the panel says.
 */

const BOUNDS = { minLat: 25.85, maxLat: 27.2, minLng: -82.58, maxLng: -81.55 };

/** Projection width. The canvas is wider than the projection so a city label
 *  has room to sit east of its pin without being clipped at the edge. */
const W = 440;
const VIEW_W = 500;

/**
 * Equirectangular, with the height derived from the latitude of the middle of
 * the frame rather than fixed. Stretching one axis to fill a chosen box is
 * what made the old outline look hand-drawn: at 26.5°N a degree of longitude
 * is only 0.895 of a degree of latitude, so the projection has to say so.
 */
const LAT_SPAN = BOUNDS.maxLat - BOUNDS.minLat;
const LNG_SPAN = BOUNDS.maxLng - BOUNDS.minLng;
const LAT_MID = (BOUNDS.minLat + BOUNDS.maxLat) / 2;
const H = Math.round(
  (W * LAT_SPAN) / (LNG_SPAN * Math.cos((LAT_MID * Math.PI) / 180)),
);

function px(lat: number, lng: number) {
  return {
    x: ((lng - BOUNDS.minLng) / LNG_SPAN) * W,
    y: ((BOUNDS.maxLat - lat) / LAT_SPAN) * H,
  };
}

function project(loc: Location) {
  return px(loc.lat, loc.lng);
}

/**
 * The Gulf shore from Manasota Key down to Cape Romano, as [lat, lng] pairs
 * read off the real coastline and run through the same projection as the
 * pins — so the shape, the angle of the coast and the position of every city
 * on it agree with one another.
 *
 * The barrier islands are taken as the coast, which is what a coverage map
 * should show, and the excursion in the middle is Charlotte Harbor: north-east
 * from Boca Grande Pass up to Punta Gorda and back down the far shore. It is
 * the feature that makes this stretch of coast recognisable, so it is the one
 * piece of inland water worth drawing at this size.
 */
const GULF_SHORE: [number, number][] = [
  [27.2, -82.52], // Casey Key
  [27.16, -82.495],
  [27.12, -82.47], // Nokomis Beach
  [27.085, -82.458], // Venice Beach
  [27.04, -82.432], // Caspersen Beach
  [26.99, -82.405], // Manasota Key, north end
  [26.95, -82.378],
  [26.905, -82.355], // Englewood Beach
  [26.865, -82.34], // Stump Pass
  [26.82, -82.315],
  [26.775, -82.29],
  [26.735, -82.272], // Gasparilla Island
  [26.715, -82.255], // Boca Grande Pass
  // -- north-west shore of Charlotte Harbor, running inland --
  [26.762, -82.236], // Cape Haze
  [26.806, -82.216],
  [26.852, -82.186],
  [26.902, -82.142],
  [26.948, -82.096], // head of the harbour, off Punta Gorda
  [26.986, -82.058], // Peace River mouth
  // -- and back out along the south-east shore --
  [26.958, -82.028],
  [26.908, -82.048],
  [26.858, -82.068],
  [26.802, -82.086], // Burnt Store
  [26.742, -82.114],
  [26.698, -82.152],
  [26.668, -82.196],
  // -- back out along the islands --
  [26.64, -82.245], // Cayo Costa
  [26.58, -82.228],
  [26.52, -82.215], // North Captiva
  [26.47, -82.19], // Captiva
  [26.45, -82.15], // Blind Pass
  [26.455, -82.105], // Sanibel, west end
  [26.435, -82.05],
  [26.435, -81.99], // Point Ybel
  [26.455, -81.955], // Estero Island
  [26.41, -81.895], // Big Carlos Pass
  [26.365, -81.87], // Lovers Key
  [26.325, -81.855], // Bonita Beach
  [26.28, -81.845], // Barefoot Beach
  [26.24, -81.835], // Wiggins Pass
  [26.2, -81.825], // Vanderbilt Beach
  [26.15, -81.812], // Naples Beach
  [26.1, -81.795], // Gordon Pass
  [26.05, -81.765], // Keewaydin
  [25.99, -81.74],
  [25.94, -81.725], // Marco Island
  [25.88, -81.69], // Cape Romano
  [25.85, -81.645],
];

/** The Caloosahatchee, San Carlos Bay to the eastern edge of the frame. */
const CALOOSAHATCHEE: [number, number][] = [
  [26.45, -82.0],
  [26.5, -81.968],
  [26.535, -81.928],
  [26.565, -81.898],
  [26.61, -81.878],
  [26.645, -81.868],
  [26.685, -81.83],
  [26.72, -81.78],
  [26.732, -81.72],
  [26.722, -81.64],
  [26.712, -81.55],
];

/** County lines, as latitudes. Both run close enough to east-west at this
 *  scale to draw as one. */
const COUNTY_LINES = [26.945, 26.785, 26.322];

/** Where each county's name sits, as the latitude of the middle of its band. */
const COUNTY_LABELS = [
  { lat: 27.09, name: "SARASOTA" },
  { lat: 26.87, name: "CHARLOTTE" },
  { lat: 26.56, name: "LEE" },
  { lat: 26.15, name: "COLLIER" },
] as const;

/** Great-circle distance in statute miles. */
function milesBetween(
  aLat: number, aLng: number, bLat: number, bLng: number,
) {
  const R = 3958.8;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(bLat - aLat);
  const dLng = rad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Straight-line distance from the shop to a city, rounded to the nearest mile.
 * Deliberately not a drive time: the projection is real but the roads are not
 * in it, and quoting a duration we have not measured would be a promise.
 */
function milesFromShop(loc: Location) {
  return Math.round(milesBetween(business.lat, business.lng, loc.lat, loc.lng));
}

function polyline(points: [number, number][]) {
  return points
    .map(([lat, lng], i) => {
      const { x, y } = px(lat, lng);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

/** Land: the shore, then round the eastern edge of the frame to close it. */
const LAND = (() => {
  const first = px(...GULF_SHORE[0]);
  const last = px(...GULF_SHORE[GULF_SHORE.length - 1]);
  return `${polyline(GULF_SHORE)} L${VIEW_W} ${last.y.toFixed(1)} L${VIEW_W} 0 L${first.x.toFixed(1)} 0 Z`;
})();

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
          <SectionEyebrow index={5} className="text-cyan">Where we work</SectionEyebrow>
          <h2 className="poster mt-4 text-[clamp(1.9rem,4.2vw,2.9rem)] text-white">
            We work
            <span className="block text-chill">where you live.</span>
          </h2>
          <p className="mt-4 leading-relaxed text-white/75 md:text-lg">
            Fort Myers based, {locations.length} towns on the route. Same crew,
            same pricing and the same 24/7 line in every one of them.
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
              aria-label={`Coverage map of ${locations.length} Southwest Florida cities across ${countyList} counties, from Venice down to Naples`}
            >
              <defs>
                <linearGradient id="map-land" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1d59ad" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#0d2f6b" stopOpacity="0.95" />
                </linearGradient>
                <radialGradient id="map-glow" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#2bd9ff" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#2bd9ff" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Gulf */}
              <rect width={VIEW_W} height={H} fill="#04102a" rx="18" />
              <g stroke="#2bd9ff" strokeOpacity="0.13" strokeLinecap="round">
                {Array.from({ length: 12 }, (_, i) => (
                  <path
                    key={i}
                    d={`M8 ${52 + i * 52} q26 -10 52 0 t52 0`}
                    fill="none"
                    strokeWidth="2"
                  />
                ))}
              </g>

              {/* Land */}
              <clipPath id="map-land-clip">
                <path d={LAND} />
              </clipPath>
              <path d={LAND} fill="url(#map-land)" />

              {/* County lines, clipped to the land so they stop at the shore
                  rather than running out over the Gulf. */}
              <g clipPath="url(#map-land-clip)">
                {COUNTY_LINES.map((lat) => {
                  const { y } = px(lat, 0);
                  return (
                    <line
                      key={lat}
                      x1="0"
                      x2={VIEW_W}
                      y1={y}
                      y2={y}
                      stroke="#2bd9ff"
                      strokeOpacity="0.28"
                      strokeWidth="1.5"
                      strokeDasharray="7 7"
                    />
                  );
                })}
                <path
                  d={polyline(CALOOSAHATCHEE)}
                  fill="none"
                  stroke="#04102a"
                  strokeOpacity="0.55"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={polyline(CALOOSAHATCHEE)}
                  fill="none"
                  stroke="#2bd9ff"
                  strokeOpacity="0.22"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>

              <path
                d={LAND}
                fill="none"
                stroke="#2bd9ff"
                strokeOpacity="0.75"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* County names, set along their own band. */}
              <g
                fill="#ffffff"
                fillOpacity="0.3"
                fontSize="15"
                fontWeight={800}
                letterSpacing="2.5"
                style={{ fontFamily: "Archivo, sans-serif" }}
                className="select-none"
              >
                {COUNTY_LABELS.map((c) => (
                  <text key={c.name} x={VIEW_W - 14} y={px(c.lat, 0).y} textAnchor="end">
                    {c.name}
                  </text>
                ))}
              </g>

              {/* Frame, so the panel has an edge against the brighter band. */}
              <rect
                x="1"
                y="1"
                width={VIEW_W - 2}
                height={H - 2}
                rx="17"
                fill="none"
                stroke="#2bd9ff"
                strokeOpacity="0.22"
                strokeWidth="2"
              />

              {/* The run from the shop to the city being looked at. Both
                  ends are real coordinates, so the line is the actual bearing
                  — which is the point of drawing it at all. */}
              {(() => {
                const from = px(business.lat, business.lng);
                const to = project(active);
                return (
                  <g>
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="#ff6a13"
                      strokeOpacity="0.28"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="#ff9d4d"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="10 8"
                      className="map-run"
                    />
                  </g>
                );
              })()}

              {/* The shop itself. Everything on this map is measured from it,
                  so it is the one marker that is never a city. */}
              {(() => {
                const { x, y } = px(business.lat, business.lng);
                return (
                  <g className="pointer-events-none">
                    <circle cx={x} cy={y} r="15" fill="#ff6a13" fillOpacity="0.18" />
                    <circle
                      cx={x}
                      cy={y}
                      r="7.5"
                      fill="#ff6a13"
                      stroke="#fff"
                      strokeWidth="3"
                    />
                  </g>
                );
              })()}

              {/* Pins */}
              {locations.map((l) => {
                const { x, y } = project(l);
                const isActive = l.slug === activeSlug;
                // Cape Coral sits at the shop's own latitude, so its label ran
                // straight through the shop marker. Anything that close flips
                // to the seaward side, which is open water here.
                const shop = px(business.lat, business.lng);
                const flip =
                  x < shop.x &&
                  Math.abs(x - shop.x) < 80 &&
                  Math.abs(y - shop.y) < 26;
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
                        x={x + (flip ? -1 : 1) * (l.focus ? 18 : 15)}
                        y={y + 5}
                        textAnchor={flip ? "end" : "start"}
                        fill={isActive ? "#ffffff" : "rgba(255,255,255,0.72)"}
                        fontSize="19"
                        fontWeight={l.focus ? 800 : 600}
                        /* A dark keyline under the type so a label crossing a
                           pin, a county rule or the run stays readable. */
                        stroke="#04102a"
                        strokeWidth="4"
                        strokeOpacity="0.85"
                        paintOrder="stroke"
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

            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:mt-5 lg:pl-24">
              {[
                { c: "bg-orange ring-2 ring-white/70", label: "Our shop" },
                { c: "bg-orange", label: "Focus markets" },
                { c: "bg-cyan", label: "Also covered" },
              ].map((k) => (
                <li
                  key={k.label}
                  className="flex items-center gap-2 font-display text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-white/58"
                >
                  <span className={cn("size-2.5 rounded-full", k.c)} aria-hidden="true" />
                  {k.label}
                </li>
              ))}
              <li className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-white/48">
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
              className="pointer-events-none absolute -bottom-10 -left-14 hidden w-36 drop-shadow-[0_18px_36px_rgb(5_15_38/0.85)] lg:block xl:-left-20 xl:w-44"
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

              <div className="mt-3 flex flex-wrap items-end justify-between gap-x-5 gap-y-2">
                <h3 className="poster text-[1.75rem] text-white sm:text-3xl">
                  {active.city}
                  <span className="text-cyan">.</span>
                </h3>
                <p className="text-right">
                  <span className="poster text-[1.6rem] leading-none text-orange-light">
                    {milesFromShop(active)}
                    <span className="ml-1 font-display text-sm font-bold">mi</span>
                  </span>
                  <span className="mt-1 block font-mono text-[0.58rem] uppercase tracking-[0.12em] text-white/50">
                    From our shop
                  </span>
                </p>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3.5 border-t border-white/12 pt-4">
                {[
                  ["ZIP codes", active.zips.join(", ")],
                  ["Permits issued by", active.permitAuthority],
                  ["Coastal exposure", saltNote(active).short],
                  ["Neighborhoods", active.neighborhoods.slice(0, 3).join(", ")],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-display text-[0.55rem] font-extrabold uppercase tracking-[0.16em] text-white/58 sm:text-[0.6rem]">
                      {k}
                    </dt>
                    <dd className="mt-1 text-[0.8rem] leading-snug text-white/85 sm:text-sm">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-wrap gap-3">
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
            <p className="mt-6 font-display text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-white/55">
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
                      "flex min-h-9 items-center rounded-full px-3.5 py-2 font-display text-xs font-extrabold transition-colors",
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

            <p className="mt-3 text-[0.7rem] text-white/52">
              Cities and coastline are plotted from real coordinates. The shore is
              simplified for legibility and the county lines are approximate — it
              is a coverage map, not a survey.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
