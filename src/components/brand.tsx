import type { ReactNode } from "react";
import { Link } from "wouter";
import { ArrowUpRight, MapPin, ShieldCheck, Star, Thermometer, Zap } from "lucide-react";
import { business, locations, season } from "@/content/site";
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
          "glass edge-lit flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3",
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
        <span className="hidden h-4 w-px bg-white/20 sm:block" aria-hidden="true" />
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
          <dd className="mt-0.5 font-display text-base font-extrabold text-white">3</dd>
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

const TRUST = [
  { Icon: ShieldCheck, title: "Licensed & insured", sub: `FL #${business.license}` },
  { Icon: Zap, title: "24/7 emergency", sub: "Answered by a person" },
  { Icon: Star, title: "Flat-rate pricing", sub: "Quoted before work starts" },
  { Icon: MapPin, title: "Locally owned", sub: `${business.city}, FL` },
];

export function TrustStrip({ className }: { className?: string }) {
  return (
    <div className={cn("border-y border-navy/8 bg-white", className)}>
      <ul className="shell grid gap-6 py-7 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST.map(({ Icon, title, sub }) => (
          <li key={title} className="flex items-center gap-3.5">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue/12 to-cyan/20 text-blue ring-1 ring-blue/15">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-sm font-extrabold text-navy">
                {title}
              </span>
              <span className="block truncate text-xs text-navy/55">{sub}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
