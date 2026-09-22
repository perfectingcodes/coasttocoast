import { useId, useState } from "react";
import { RotateCcw, Thermometer } from "lucide-react";
import { business, season } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * The cooling year, scrubbable.
 *
 * It opens on today's month — the honest default, and the only reading a
 * visitor did not ask for — but the whole twelve months are there to drag
 * through, because the useful thing about Southwest Florida's cooling load is
 * the *shape* of it: two flat months in winter, a wall from June to August,
 * and two shoulder months that are the right time to book a service.
 *
 * Every figure comes from `season` in content/site.ts. Nothing here pretends
 * to be a live sensor reading.
 */

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

const LOAD_TONE = {
  Low: "text-cyan-light",
  Moderate: "text-cyan",
  High: "text-gold",
  Peak: "text-orange-light",
} as const;

const LOAD_BARS = { Low: 1, Moderate: 2, High: 3, Peak: 4 } as const;

/** Column height for each month, as a fraction — the year's profile at a glance. */
const LOAD_HEIGHT = { Low: 0.3, Moderate: 0.55, High: 0.8, Peak: 1 } as const;

export function SeasonScrubber({ className }: { className?: string }) {
  const today = new Date().getMonth();
  const [month, setMonth] = useState(today);
  const id = useId();

  const s = season[MONTHS[month]] ?? season.Jul;
  const bars = LOAD_BARS[s.load];
  const isToday = month === today;

  return (
    <div
      className={cn(
        "glass edge-lit relative overflow-hidden px-5 pb-4 pt-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-2">
          <Thermometer className="size-4 shrink-0 text-cyan" aria-hidden="true" />
          <span className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.18em] text-white/55">
            Cooling year · {business.city}
          </span>
        </span>

        {isToday ? (
          <span className="rounded-full bg-cyan/15 px-2.5 py-1 font-display text-[0.55rem] font-extrabold uppercase tracking-[0.16em] text-cyan ring-1 ring-cyan/30">
            Today
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setMonth(today)}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[0.55rem] font-extrabold uppercase tracking-[0.16em] text-white/60 ring-1 ring-white/20 transition-colors hover:text-white hover:ring-white/40"
          >
            <RotateCcw className="size-3" aria-hidden="true" />
            Today
          </button>
        )}
      </div>

      <p className="mt-2.5 font-display text-lg font-extrabold leading-tight text-white">
        {s.label}
        <span className="ml-2 align-middle font-display text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-white/40">
          {MONTHS[month]}
        </span>
      </p>
      <p className="mt-0.5 text-[0.78rem] leading-snug text-white/60">{s.note}</p>

      {/* The year's profile, drawn behind the control it belongs to. */}
      <div className="relative mt-3">
        <div
          className="flex h-9 items-end gap-[3px]"
          aria-hidden="true"
        >
          {MONTHS.map((m, i) => {
            const ms = season[m] ?? season.Jul;
            return (
              <span
                key={m}
                className={cn(
                  "flex-1 rounded-t-[3px] transition-all duration-300",
                  i === month
                    ? cn("bg-current", LOAD_TONE[ms.load])
                    : "bg-white/18",
                )}
                style={{ height: `${LOAD_HEIGHT[ms.load] * 100}%` }}
              />
            );
          })}
        </div>

        <label htmlFor={id} className="sr-only">
          Month
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={11}
          step={1}
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          aria-valuetext={`${MONTHS[month]} — ${s.label}, ${s.load} cooling load`}
          className="range-ghost absolute inset-x-0 -bottom-1 h-9 w-full cursor-ew-resize"
        />
      </div>

      <div className="mt-1.5 flex gap-[3px]" aria-hidden="true">
        {MONTHS.map((m, i) => (
          <span
            key={m}
            className={cn(
              "flex-1 text-center font-display text-[0.55rem] font-extrabold uppercase transition-colors",
              i === month ? "text-white" : "text-white/30",
            )}
          >
            {m[0]}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2.5 border-t border-white/12 pt-3">
        <span className="font-display text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-white/45">
          Cooling load
        </span>
        <span className="flex gap-1" aria-hidden="true">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 w-4 rounded-full transition-colors",
                i <= bars ? cn("bg-current", LOAD_TONE[s.load]) : "bg-white/15",
              )}
            />
          ))}
        </span>
        <span
          className={cn("font-display text-xs font-extrabold", LOAD_TONE[s.load])}
        >
          {s.load}
        </span>
      </div>
    </div>
  );
}
