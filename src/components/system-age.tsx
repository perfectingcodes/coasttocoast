import { useId, useMemo, useState } from "react";
import { Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * "How old is your system?"
 *
 * The one question every homeowner in this climate can answer off the top of
 * their head, checked against the only lifespan figure the site asserts: AC
 * systems here last 10–15 years rather than twenty, because they run close to
 * year-round. The band on the track is that range, drawn to scale.
 *
 * The verdict is guidance, not a diagnosis, and says so — nothing here knows
 * anything about a particular system. Every line of it restates something
 * already on the site: twice-yearly maintenance, a second opinion before a
 * large repair, and the published Clean & Tune.
 */

const MAX = 20;
/** The asserted range for this climate — see the cooling service page. */
const LIFE_FROM = 10;
const LIFE_TO = 15;

type Verdict = { tone: string; label: string; body: string };

function verdictFor(years: number): Verdict {
  if (years < LIFE_FROM)
    return {
      tone: "text-cyan",
      label: "Maintenance years",
      body: "Service it twice a year",
    };
  if (years <= LIFE_TO)
    return {
      tone: "text-gold",
      label: "Watch years",
      body: "Know its condition now",
    };
  return {
    tone: "text-orange-light",
    label: "Past the usual range",
    body: "Get a second opinion",
  };
}

export function SystemAgeCard({ className }: { className?: string }) {
  const [years, setYears] = useState(8);
  const id = useId();
  const v = useMemo(() => verdictFor(years), [years]);

  const pct = (years / MAX) * 100;
  const bandLeft = (LIFE_FROM / MAX) * 100;
  const bandWidth = ((LIFE_TO - LIFE_FROM) / MAX) * 100;

  return (
    <div
      className={cn(
        "glass-instrument edge-lit relative overflow-hidden px-4 py-3",
        className,
      )}
    >
      <span className="flex items-center gap-2">
        <Gauge className="size-3 shrink-0 text-cyan" aria-hidden="true" />
        <span className="truncate font-display text-[0.52rem] font-extrabold uppercase tracking-[0.13em] text-white/58">
          How old is your system?
        </span>
      </span>

      <p className="mt-1.5 flex items-baseline justify-between gap-2">
        <span
          className={cn(
            "truncate font-display text-[0.88rem] font-extrabold leading-tight",
            v.tone,
          )}
        >
          {v.label}
        </span>
        <span className="shrink-0 font-mono text-[0.56rem] uppercase tracking-[0.1em] text-white/50">
          {years === MAX ? `${MAX}+` : years} yr
        </span>
      </p>

      <div className="relative mt-2.5">
        {/* Track, with the 10–15 year band drawn to scale on it. */}
        <div className="h-1.5 w-full rounded-full bg-white/15" aria-hidden="true">
          <div
            className="absolute top-0 h-1.5 rounded-full bg-gold/45"
            style={{ left: `${bandLeft}%`, width: `${bandWidth}%` }}
          />
          <div
            className="absolute top-0 h-1.5 rounded-full bg-gradient-to-r from-cyan to-cyan-light transition-[width] duration-200"
            style={{ width: `${pct}%` }}
          />
        </div>

        <label htmlFor={id} className="sr-only">
          System age in years
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={MAX}
          step={1}
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          aria-valuetext={`${years} years — ${v.label}`}
          className="range-ghost absolute inset-x-0 -top-3 h-7 w-full cursor-ew-resize"
        />
      </div>

      <p className="mt-2 flex items-baseline justify-between gap-3 font-mono text-[0.55rem] uppercase tracking-[0.06em]">
        <span className="truncate text-white/65">{v.body}</span>
        <span className="shrink-0 text-gold/90">
          {LIFE_FROM}–{LIFE_TO} yr typical
        </span>
      </p>
    </div>
  );
}
