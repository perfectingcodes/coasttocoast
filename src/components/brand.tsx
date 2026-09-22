import type { ReactNode } from "react";
import { Link } from "wouter";
import { ArrowUpRight, MapPin, ShieldCheck, Thermometer } from "lucide-react";
import { business, counties, locations, season } from "@/content/site";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- pill */

export function Pill({
  children,
  icon,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  icon?: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span className={cn("pill", tone === "dark" ? "pill-dark" : "pill-light", className)}>
      {icon}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------ link arrow */

export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("link-arrow", className)}>
      {children}
      <ArrowUpRight className="size-3.5" aria-hidden="true" />
    </Link>
  );
}

/* --------------------------------------------------------- season card */

const LOAD_TONE = {
  Low: "text-cyan-light",
  Moderate: "text-cyan",
  High: "text-gold",
  Peak: "text-orange-light",
} as const;

/**
 * "Right now" card for the hero. Reads the visitor's current month and shows
 * the real cooling-load context for Southwest Florida — honest, dated
 * information rather than a fake live sensor feed.
 */
export function SeasonCard({
  className,
  variant = "card",
}: {
  className?: string;
  /** "bar" is a compact horizontal strip for tight layouts like the hero. */
  variant?: "card" | "bar";
}) {
  const key = new Date().toLocaleString("en-US", { month: "short" });
  const s = season[key] ?? season.Jul;
  const bars = { Low: 1, Moderate: 2, High: 3, Peak: 4 }[s.load];

  const meter = (
    <span className="flex items-center gap-2.5">
      <span className="flex gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 w-4 rounded-full",
              i <= bars ? "bg-current" : "bg-white/15",
              i <= bars && LOAD_TONE[s.load],
            )}
          />
        ))}
      </span>
      <span className={cn("font-display text-xs font-extrabold", LOAD_TONE[s.load])}>
        {s.load}
      </span>
    </span>
  );

  if (variant === "bar") {
    return (
      <div
        className={cn(
          "glass edge-lit flex flex-wrap items-center gap-x-4 gap-y-1.5 px-4 py-2.5",
          className,
        )}
      >
        <span className="flex items-center gap-2">
          <Thermometer className="size-4 text-cyan" aria-hidden="true" />
          <span className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.18em] text-white/55">
            Right now · {business.city}
          </span>
        </span>
        <span className="font-display text-sm font-extrabold text-white">
          {s.label}
        </span>
        <span className="flex items-center gap-2.5">
          <span className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-white/45">
            Cooling load
          </span>
          {meter}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("glass edge-lit p-5", className)}>
      <div className="flex items-center justify-between">
        <p className="font-display text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-white/60">
          Right now · {business.city}
        </p>
        <Thermometer className="size-4 text-cyan" aria-hidden="true" />
      </div>

      <p className="mt-3 font-display text-2xl font-extrabold leading-none text-white">
        {s.label}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-white/65">{s.note}</p>

      <div className="mt-4 flex items-center gap-2.5 border-t border-white/12 pt-3.5">
        <span className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-white/50">
          Cooling load
        </span>
        {meter}
      </div>
    </div>
  );
}

/* ------------------------------------------------------- credential card */

export function LicenceCard({ className }: { className?: string }) {
  return (
    <div className={cn("glass p-5", className)}>
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-cyan/15 text-cyan ring-1 ring-cyan/30">
          <ShieldCheck className="size-4.5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-sm font-extrabold text-white">
            Licensed &amp; insured
          </p>
          <p className="mt-0.5 font-mono text-[0.7rem] text-white/60">
            FL Mechanical #{business.license}
          </p>
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/12 pt-3.5">
        <div>
          <dt className="font-display text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-white/45">
            Counties
          </dt>
          <dd className="mt-0.5 font-display text-base font-extrabold text-white">
            {counties.length}
          </dd>
        </div>
        <div>
          <dt className="font-display text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-white/45">
            Cities
          </dt>
          <dd className="mt-0.5 font-display text-base font-extrabold text-white">
            {locations.length}
          </dd>
        </div>
      </dl>
    </div>
  );
}

/* ------------------------------------------------------------ city marquee */

/** Continuous band of the cities served. Duplicated once for a seamless loop. */
export function CityMarquee({ className }: { className?: string }) {
  const items = [...locations, ...locations];
  return (
    <div className={cn("marquee py-3", className)} aria-hidden="true">
      {[0, 1].map((copy) => (
        <div className="marquee-track" key={copy}>
          {items.map((l, i) => (
            <span
              key={`${copy}-${l.slug}-${i}`}
              className="flex shrink-0 items-center gap-2.5 font-display text-[0.7rem] font-extrabold uppercase tracking-[0.22em] text-white/35"
            >
              <MapPin className="size-3 text-cyan/60" />
              {l.city}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- trust bar */

/**
 * Credentials, not icon tiles. A row of gradient-circle icons is the single
 * most recognisable template pattern on a contractor site; this leads with the
 * licence numbers themselves and uses the seal as the only mark.
 */
export function TrustStrip({ className }: { className?: string }) {
  return (
    <div className={cn("border-b border-navy/8 bg-foam", className)}>
      <div className="shell flex flex-wrap items-center gap-x-12 gap-y-6 py-6">
        <div className="flex items-center gap-3.5">
          <img
            src="/brand/badge-locally-owned.webp"
            alt="Locally owned and operated"
            width={640}
            height={632}
            className="size-14 shrink-0"
          />
          <p className="font-display text-[0.68rem] font-extrabold uppercase leading-tight tracking-[0.14em] text-navy">
            Locally owned
            <span className="mt-0.5 block font-bold text-navy/45">
              {business.city}, {business.state}
            </span>
          </p>
        </div>

        <span className="hidden h-10 w-px bg-navy/10 md:block" aria-hidden="true" />

        <ul className="flex flex-wrap gap-x-10 gap-y-4">
          {business.licenses.map((l) => (
            <li key={l.number} className="leading-tight">
              <span className="block font-display text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-navy/40">
                {l.label}
              </span>
              <span className="mt-1 flex items-center gap-1.5">
                <span className="h-3 w-[3px] rounded-full bg-gradient-to-b from-cyan to-blue" aria-hidden="true" />
                <span className="font-mono text-sm font-semibold tracking-tight text-navy">
                  {l.number}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <p className="ml-auto hidden font-display text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-navy/40 lg:block">
          Insured · Bonded
          <span className="mt-0.5 block text-navy/25">
            Certificates on request
          </span>
        </p>
      </div>
    </div>
  );
}


/* ------------------------------------------------------- kinetic wordmark */

/**
 * Oversized "Coast to Coast" running across the foot of the page.
 *
 * Purely typographic and purely decorative — aria-hidden, and it pauses on
 * hover and under prefers-reduced-motion. The name is already in the footer
 * as real text, so nothing is lost to a screen reader.
 */
export function KineticWordmark({ className }: { className?: string }) {
  const word = (
    <>
      <span className="poster text-[clamp(3rem,9vw,7rem)] text-white/[0.07]">
        Coast to Coast
      </span>
      <span className="poster text-[clamp(3rem,9vw,7rem)] text-cyan/25">
        Air
      </span>
      <span
        className="size-3 shrink-0 rounded-full bg-orange/50"
        aria-hidden="true"
      />
    </>
  );
  return (
    <div className={cn("kinetic py-2", className)} aria-hidden="true">
      {[0, 1].map((copy) => (
        <div className="kinetic-track" key={copy}>
          {[0, 1].map((n) => (
            <span
              key={n}
              className="flex shrink-0 items-center gap-10 whitespace-nowrap"
            >
              {word}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Section eyebrow with a running index.
 *
 * The home page is a sequence — what we do, what it costs, who we are, where
 * we work, what happens when you call — and numbering the sections says so.
 * It is the cheapest way to make a long page read as one journey rather than
 * as a stack of unrelated bands.
 */
export function SectionEyebrow({
  index,
  children,
  className,
}: {
  /** 1-based position in the page's narrative. */
  index: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("eyebrow eyebrow-indexed", className)}>
      <span className="tabular-nums opacity-70">
        {String(index).padStart(2, "0")}
      </span>
      <span
        className="h-[2px] w-7 shrink-0 rounded-sm bg-current opacity-45"
        aria-hidden="true"
      />
      {children}
    </p>
  );
}
