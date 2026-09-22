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
        "glass edge-lit relative overflow-hidden px-5 py-3.5",
        className,
      )}
    >
      {/* Two columns from `sm`: the reading on the left, the control on the
          right. Stacked it was tall enough to cover the artwork behind it. */}
      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Thermometer
                className="size-3.5 shrink-0 text-cyan"
                aria-hidden="true"
              />
              <span className="font-display text-[0.58rem] font-extrabold uppercase tracking-[0.18em] text-white/55">
                Cooling year · {business.city}
              </span>
            </span>

            {isToday ? (
              <span className="shrink-0 rounded-full bg-cyan/15 px-2 py-0.5 font-display text-[0.52rem] font-extrabold uppercase tracking-[0.16em] text-cyan ring-1 ring-cyan/30 sm:hidden">
                Today
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setMonth(today)}
                className="flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 font-display text-[0.52rem] font-extrabold uppercase tracking-[0.16em] text-white/60 ring-1 ring-white/20 transition-colors hover:text-white hover:ring-white/40 sm:hidden"
              >
                <RotateCcw className="size-2.5" aria-hidden="true" />
                Today
              </button>
            )}
          </div>

          <p className="mt-1.5 font-display text-base font-extrabold leading-tight text-white">
            {s.label}
            <span className="ml-2 align-middle font-display text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-white/55">
              {MONTHS[month]}
            </span>
          </p>
          <p className="mt-0.5 text-[0.74rem] leading-snug text-white/55">
            {s.note}
          </p>
        </div>

        <div className="sm:w-[14.5rem] sm:shrink-0">
          {/* The year's profile, doubling as the face of the control. */}
          <div className="relative">
            <div className="flex h-8 items-end gap-[3px]" aria-hidden="true">
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
              className="range-ghost absolute inset-x-0 bottom-0 h-8 w-full cursor-ew-resize"
            />
          </div>

          <div className="mt-1 flex gap-[3px]" aria-hidden="true">
            {MONTHS.map((m, i) => (
              <span
                key={m}
                className={cn(
                  "flex-1 text-center font-display text-[0.5rem] font-extrabold uppercase transition-colors",
                  i === month ? "text-white" : "text-white/48",
                )}
              >
                {m[0]}
              </span>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="flex gap-1" aria-hidden="true">
              {[1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 w-3.5 rounded-full transition-colors",
                    i <= bars ? cn("bg-current", LOAD_TONE[s.load]) : "bg-white/15",
                  )}
                />
              ))}
            </span>
            <span
              className={cn(
                "font-display text-[0.7rem] font-extrabold",
                LOAD_TONE[s.load],
              )}
            >
              {s.load}
            </span>

            {isToday ? (
              <span className="ml-auto hidden rounded-full bg-cyan/15 px-2 py-0.5 font-display text-[0.52rem] font-extrabold uppercase tracking-[0.16em] text-cyan ring-1 ring-cyan/30 sm:block">
                Today
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setMonth(today)}
                className="ml-auto hidden items-center gap-1.5 rounded-full px-2 py-0.5 font-display text-[0.52rem] font-extrabold uppercase tracking-[0.16em] text-white/60 ring-1 ring-white/20 transition-colors hover:text-white hover:ring-white/40 sm:flex"
              >
                <RotateCcw className="size-2.5" aria-hidden="true" />
                Today
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
