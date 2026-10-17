import { useMemo, useState } from "react";
import { CalendarDays, Flag, Lock, TriangleAlert, User } from "lucide-react";
import {
  TRACKS,
  schedule,
  socialPlan,
  type Entry,
  type Track,
} from "@/content/calendar";
import { AdminShell } from "@/components/admin/shell";
import { Instrument, Micro, Panel, StatCard } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

/**
 * The schedule.
 *
 * A month grid to see the shape of it and a dated agenda to actually work
 * from. Both read the same list, so they cannot disagree.
 *
 * "Today" is the real date, which means this page ages honestly: a week after
 * launch the first four entries are behind the line and visibly so, rather
 * than sitting there looking like they are still to come.
 */

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

/** Parsed as local midday so a timezone never shifts a date by a day. */
const asDate = (iso: string) => new Date(`${iso}T12:00:00`);

const MONTHS = ["2026-10", "2026-11", "2026-12", "2027-01"];

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function AdminCalendar() {
  const [filter, setFilter] = useState<Track | "all">("all");

  const entries = useMemo(
    () =>
      [...schedule]
        .filter((e) => filter === "all" || e.track === filter)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [filter],
  );

  const milestones = schedule.filter((e) => e.milestone);
  const clientItems = schedule.filter((e) => e.owner === "Client");
  const overdue = schedule.filter(
    (e) => e.owner === "Client" && asDate(e.date) < TODAY,
  );

  /** Grouped by ISO date, for the agenda. */
  const byDate = useMemo(() => {
    const map = new Map<string, Entry[]>();
    for (const e of entries) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return [...map.entries()];
  }, [entries]);

  return (
    <AdminShell
      title="Schedule"
      lead="Every date from publish day to the 90-day review, with who owns it and what breaks if it slips. Nothing on this page is a placeholder."
    >
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Publish"
          value="Sat 17 Oct"
          icon={<CalendarDays />}
          hint="Two quiet days before ads point at it"
        />
        <StatCard
          label="Ads live"
          value="Mon 19 Oct"
          tone="good"
          icon={<Flag />}
          hint="$300 in week one"
        />
        <StatCard
          label="Milestones"
          value={milestones.length}
          icon={<Flag />}
          hint="Through 18 Jan"
        />
        <StatCard
          label="Client-owned dates"
          value={clientItems.length}
          tone={overdue.length ? "bad" : "warn"}
          icon={<User />}
          hint={overdue.length ? `${overdue.length} already past` : "None past yet"}
        />
      </div>

      {/* ------------------------------------------------------ the shape */}
      <Panel
        title="The shape of it"
        subtitle="Four months. Shaded days have something on them; a ring marks a milestone."
      >
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {MONTHS.map((key) => (
            <MonthGrid key={key} monthKey={key} entries={schedule} />
          ))}
        </div>

        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-navy/8 pt-4">
          {(Object.keys(TRACKS) as Track[]).map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span className={cn("size-2 rounded-full", TRACKS[t].dot)} aria-hidden="true" />
              <span className="text-[0.74rem] font-semibold text-navy/60">
                {TRACKS[t].label}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      {/* -------------------------------------------------------- agenda */}
      <Panel
        title="Day by day"
        subtitle="Filter by track, or read it straight through."
        action={
          <div className="flex flex-wrap gap-1.5">
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
              All
            </FilterChip>
            {(Object.keys(TRACKS) as Track[]).map((t) => (
              <FilterChip
                key={t}
                active={filter === t}
                onClick={() => setFilter(filter === t ? "all" : t)}
              >
                {TRACKS[t].label}
              </FilterChip>
            ))}
          </div>
        }
      >
        <ol className="space-y-5">
          {byDate.map(([date, items]) => {
            const d = asDate(date);
            const past = d < TODAY;
            return (
              <li key={date} className="grid gap-3 sm:grid-cols-[7.5rem_minmax(0,1fr)]">
                <div className={cn("sm:pt-1", past && "opacity-45")}>
                  <p className="font-display text-[0.95rem] font-extrabold leading-none text-navy">
                    {d.toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                  </p>
                  <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-navy/40">
                    {d.toLocaleDateString("en-US", { weekday: "long" })}
                  </p>
                </div>

                <ul className="space-y-2.5">
                  {items.map((e) => (
                    <li
                      key={e.title}
                      className={cn(
                        "min-w-0 rounded-xl p-4 ring-1 ring-inset",
                        past && "opacity-60",
                        e.milestone
                          ? "bg-blue/5 ring-blue/30"
                          : e.owner === "Client"
                            ? "bg-gold/8 ring-gold/35"
                            : "bg-navy/[0.025] ring-navy/8",
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        {e.milestone && (
                          <Flag className="size-3.5 shrink-0 text-blue" aria-hidden="true" />
                        )}
                        <p className="font-display text-[0.92rem] font-extrabold text-navy">
                          {e.title}
                        </p>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 text-[0.62rem] font-bold ring-1 ring-inset",
                            TRACKS[e.track].chip,
                          )}
                        >
                          {TRACKS[e.track].label}
                        </span>
                        <span className="shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-navy/40">
                          {e.owner}
                        </span>
                      </div>

                      <p className="mt-2 text-[0.82rem] leading-relaxed text-navy/70">
                        {e.detail}
                      </p>

                      {e.why && (
                        <p className="mt-2 text-[0.78rem] leading-relaxed text-navy/55">
                          <span className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-navy/40">
                            Why then ·{" "}
                          </span>
                          {e.why}
                        </p>
                      )}

                      {e.blocks && (
                        <p className="mt-2.5 flex gap-2 rounded-lg bg-ember/6 p-2.5 text-[0.76rem] leading-relaxed text-navy/75">
                          <TriangleAlert
                            className="mt-0.5 size-3.5 shrink-0 text-ember"
                            aria-hidden="true"
                          />
                          <span>
                            <span className="font-semibold">If it slips — </span>
                            {e.blocks}
                          </span>
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </Panel>

      {/* -------------------------------------------------------- social */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Instrument
          className="lg:col-span-5 lg:self-start"
          label="What Instagram is for"
          footnote={socialPlan.cadence}
        >
          <p className="mt-3 text-[0.9rem] leading-relaxed text-white/80">
            {socialPlan.note}
          </p>
          <div className="mt-5 border-t border-white/12 pt-4">
            <p className="font-display text-[0.58rem] font-extrabold uppercase tracking-[0.18em] text-cyan">
              What we need
            </p>
            <ul className="mt-2.5 space-y-2">
              {socialPlan.need.map((n) => (
                <li key={n} className="flex gap-2.5 text-[0.82rem] leading-relaxed text-white/75">
                  <Lock className="mt-0.5 size-3.5 shrink-0 text-cyan" aria-hidden="true" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </Instrument>

        <Panel
          className="lg:col-span-7"
          title="What gets posted"
          subtitle="Two a week, sustained, beats five a week abandoned in a fortnight."
        >
          <ul className="space-y-4">
            {socialPlan.pillars.map((p, i) => (
              <li key={p.name} className="flex gap-3.5">
                <span className="mt-0.5 font-mono text-[0.7rem] font-bold tabular-nums text-orange">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-baseline gap-x-3">
                    <span className="font-display text-[0.92rem] font-extrabold text-navy">
                      {p.name}
                    </span>
                    <span className="font-mono text-[0.64rem] uppercase tracking-[0.1em] text-navy/45">
                      {p.share}
                    </span>
                  </p>
                  <p className="mt-1 text-[0.8rem] leading-relaxed text-navy/60">
                    {p.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AdminShell>
  );
}

/* ------------------------------------------------------------- the grid */

function MonthGrid({ monthKey, entries }: { monthKey: string; entries: Entry[] }) {
  const [y, m] = monthKey.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const days = new Date(y, m, 0).getDate();
  // Monday-first, which is how a working week is actually read.
  const lead = (first.getDay() + 6) % 7;

  const marks = new Map<number, { tracks: Track[]; milestone: boolean }>();
  for (const e of entries) {
    if (!e.date.startsWith(monthKey)) continue;
    const day = Number(e.date.slice(8, 10));
    const cur = marks.get(day) ?? { tracks: [], milestone: false };
    if (!cur.tracks.includes(e.track)) cur.tracks.push(e.track);
    cur.milestone = cur.milestone || Boolean(e.milestone);
    marks.set(day, cur);
  }

  return (
    <div className="min-w-0">
      <Micro>{monthLabel(monthKey)}</Micro>
      <div className="mt-2.5 grid grid-cols-7 gap-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span
            key={i}
            className="pb-1 text-center font-mono text-[0.55rem] uppercase text-navy/30"
          >
            {d}
          </span>
        ))}
        {Array.from({ length: lead }).map((_, i) => (
          <span key={`lead-${i}`} aria-hidden="true" />
        ))}
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1;
          const mark = marks.get(day);
          const date = new Date(y, m - 1, day);
          const isToday = date.getTime() === TODAY.getTime();
          return (
            <div
              key={day}
              title={
                mark
                  ? `${day} ${monthLabel(monthKey)} — ${mark.tracks.map((t) => TRACKS[t].label).join(", ")}`
                  : undefined
              }
              className={cn(
                "relative grid aspect-square place-items-center rounded-md text-[0.62rem] tabular-nums",
                mark ? "bg-navy/[0.06] font-bold text-navy" : "text-navy/30",
                mark?.milestone && "ring-2 ring-inset ring-blue",
                isToday && "bg-blue text-white",
              )}
            >
              {day}
              {mark && (
                <span className="absolute inset-x-0 bottom-0.5 flex justify-center gap-[2px]">
                  {mark.tracks.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className={cn("size-[3px] rounded-full", TRACKS[t].dot)}
                      aria-hidden="true"
                    />
                  ))}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-3 py-1.5 text-[0.7rem] font-bold transition-colors",
        active
          ? "bg-navy text-white"
          : "text-navy/55 ring-1 ring-inset ring-navy/15 hover:bg-navy/5",
      )}
    >
      {children}
    </button>
  );
}
