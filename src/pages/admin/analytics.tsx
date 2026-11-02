import { useMemo, useState } from "react";
import { ArrowUpRight, MessageSquare, MousePointerClick, Phone } from "lucide-react";
import { EVENT_LABELS, ago, useCrm, type SiteEvent } from "@/lib/leads";
import { env } from "@/lib/detect";
import { AdminShell } from "@/components/admin/shell";
import { Instrument, Micro, Panel, StatCard } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

/**
 * Analytics.
 *
 * Reads the site's own event store rather than a third party, which means it
 * answers the question that matters here — which page was somebody on when
 * they picked up the phone — without waiting on a GA4 property to populate.
 *
 * One honest line about scope, kept to one line because the point has been
 * made elsewhere: this is the browser it is open in unless a leads endpoint
 * is configured, in which case the same events are forwarded and a real
 * backend holds the full picture.
 */

const RANGES = [7, 14, 30, 90] as const;
type Range = (typeof RANGES)[number];
const DAY = 86_400_000;

/** A page title worth reading, derived from the path. */
function label(path: string) {
  if (path === "/") return "Home";
  const parts = path.replace(/^\//, "").split("/");
  return parts
    .map((p) => p.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(" · ");
}

export default function AdminAnalytics() {
  const crm = useCrm();
  const [days, setDays] = useState<Range>(14);

  const stats = useMemo(() => {
    const since = Date.now() - days * DAY;
    const recent = crm.events.filter((e) => e.at >= since);
    const views = recent.filter((e) => e.kind === "view");

    const pages = new Map<string, number>();
    for (const v of views) pages.set(v.path, (pages.get(v.path) ?? 0) + 1);

    const byDay: { label: string; count: number; iso: string }[] = [];
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    for (let i = days - 1; i >= 0; i--) {
      const from = start.getTime() - i * DAY;
      byDay.push({
        iso: new Date(from).toISOString().slice(0, 10),
        label: new Date(from).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count: views.filter((e) => e.at >= from && e.at < from + DAY).length,
      });
    }

    const kind = (k: SiteEvent["kind"]) => recent.filter((e) => e.kind === k).length;

    return {
      recent,
      views: views.length,
      calls: kind("call"),
      quoteOpens: kind("quote-open"),
      quoteSubmits: kind("quote-submit"),
      financing: kind("financing"),
      chat: kind("chat"),
      offer: kind("offer"),
      pages: [...pages.entries()]
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count),
      byDay,
    };
  }, [crm.events, days]);

  const peak = Math.max(1, ...stats.byDay.map((d) => d.count));
  const topPageViews = Math.max(1, ...stats.pages.map((p) => p.count));

  /** Views → reached a form → acted. The only funnel that matters here. */
  const funnel = [
    { label: "Page views", value: stats.views, Icon: ArrowUpRight },
    { label: "Reached a quote form", value: stats.quoteOpens, Icon: MousePointerClick },
    { label: "Tapped the phone", value: stats.calls, Icon: Phone },
    { label: "Sent a request", value: stats.quoteSubmits, Icon: MessageSquare },
  ];

  return (
    <AdminShell
      title="Analytics"
      lead="Which pages people land on, what they do there, and which page they were reading when they picked up the phone."
      actions={
        <div className="flex gap-1.5">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setDays(r)}
              aria-pressed={days === r}
              className={cn(
                "rounded-full px-3 py-1.5 text-[0.72rem] font-bold transition-colors",
                days === r
                  ? "bg-navy text-white"
                  : "text-navy/55 ring-1 ring-inset ring-navy/15 hover:bg-navy/5",
              )}
            >
              {r}d
            </button>
          ))}
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {funnel.map((f) => (
          <StatCard
            key={f.label}
            label={f.label}
            value={f.value}
            icon={<f.Icon />}
            tone={f.label === "Sent a request" && f.value > 0 ? "good" : "default"}
            hint={`Last ${days} days`}
          />
        ))}
      </div>

      {/* ------------------------------------------------------- traffic */}
      <Panel
        title="Traffic"
        subtitle={`Page views a day over the last ${days} days.`}
      >
        <div className="flex h-36 items-end gap-1">
          {stats.byDay.map((d) => (
            <div
              key={d.iso}
              title={`${d.label}: ${d.count} view${d.count === 1 ? "" : "s"}`}
              className="flex h-full min-w-0 flex-1 items-end overflow-hidden rounded-sm bg-navy/[0.06]"
            >
              <div
                className="w-full rounded-sm bg-gradient-to-t from-blue to-cyan transition-all"
                style={{ height: `${(d.count / peak) * 100}%` }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[0.6rem] uppercase tracking-[0.1em] text-navy/40">
          <span>{stats.byDay[0]?.label}</span>
          <span>Peak {peak} / day</span>
          <span>Today</span>
        </div>
      </Panel>

      {/* --------------------------------------------------------- pages */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Panel
          className="lg:col-span-7"
          title="Pages"
          subtitle="Where people actually land. This is the list that tells you which page to improve next."
        >
          {stats.pages.length ? (
            <ul className="space-y-2.5">
              {stats.pages.slice(0, 12).map((p) => (
                <li key={p.path} className="min-w-0">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="min-w-0 truncate text-[0.84rem] font-semibold text-navy">
                      {label(p.path)}
                    </p>
                    <p className="shrink-0 font-display text-[0.9rem] font-extrabold tabular-nums text-navy">
                      {p.count}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center gap-3">
                    <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-navy/6">
                      <span
                        className="block h-full rounded-full bg-blue"
                        style={{ width: `${(p.count / topPageViews) * 100}%` }}
                      />
                    </span>
                    <span className="shrink-0 font-mono text-[0.62rem] text-navy/40">
                      {p.path}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty days={days} />
          )}
        </Panel>

        <Panel
          className="lg:col-span-5"
          title="What people did"
          subtitle="Beyond reading a page."
        >
          <ul className="space-y-3">
            {[
              ["Tapped the phone number", stats.calls],
              ["Reached a quote form", stats.quoteOpens],
              ["Sent a quote request", stats.quoteSubmits],
              ["Used the financing estimator", stats.financing],
              ["Saw the $89 offer popup", stats.offer],
              ["Opened the chat", stats.chat],
            ].map(([k, v]) => (
              <li
                key={k as string}
                className="flex items-baseline justify-between gap-4 border-b border-navy/6 pb-2.5 last:border-0 last:pb-0"
              >
                <span className="min-w-0 text-[0.82rem] text-navy/70">{k as string}</span>
                <span
                  className={cn(
                    "shrink-0 font-display text-[1.05rem] font-extrabold tabular-nums",
                    (v as number) > 0 ? "text-navy" : "text-navy/25",
                  )}
                >
                  {v as number}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* -------------------------------------------------------- stream */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Panel
          className="lg:col-span-7"
          title="Live activity"
          subtitle="Newest first. This is the one view that shows which page somebody was on at the moment they acted."
        >
          {stats.recent.length ? (
            <ol className="space-y-2">
              {stats.recent.slice(0, 20).map((e) => (
                <li
                  key={e.id}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-navy/6 pb-2 text-[0.8rem] last:border-0"
                >
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      e.kind === "view" ? "bg-navy/25" : "bg-cyan",
                    )}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      "font-semibold",
                      e.kind === "view" ? "text-navy/60" : "text-navy",
                    )}
                  >
                    {EVENT_LABELS[e.kind]}
                  </span>
                  {e.label && <span className="text-navy/45">{e.label}</span>}
                  <span className="ml-auto shrink-0 font-mono text-[0.62rem] text-navy/40">
                    {e.path} · {ago(e.at)}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <Empty days={days} />
          )}
        </Panel>

        <Instrument
          className="lg:col-span-5 lg:self-start"
          label="Where this data comes from"
          footnote={
            env.leads
              ? "Forwarding is on — the same events reach the backend."
              : "No forwarding endpoint set."
          }
        >
          <p className="mt-3 text-[0.88rem] leading-relaxed text-white/80">
            The site records its own events, so this works without waiting on a
            GA4 property to populate and it can answer the thing GA4 makes
            hard: which page somebody was reading at the moment they tapped the
            number.
          </p>
          <p className="mt-3 text-[0.82rem] leading-relaxed text-white/60">
            {env.leads
              ? "Every event here is also POSTed to the configured endpoint, so the office sees the whole picture rather than one browser."
              : "Until a forwarding endpoint is set, this shows the browser it is open in. GA4 covers the cross-visitor view in the meantime."}
          </p>
          {crm.visitor && (
            <dl className="mt-5 space-y-2 border-t border-white/12 pt-4 text-[0.78rem]">
              {[
                ["Sessions", String(crm.visitor.visits)],
                ["First seen", new Date(crm.visitor.first).toLocaleDateString()],
                ["Arrived from", crm.visitor.referrer || "Typed or bookmarked"],
                [
                  "Paid click",
                  crm.visitor.attribution?.gclid
                    ? `GCLID captured · ${crm.visitor.attribution.utm_campaign ?? "no campaign"}`
                    : "None recorded",
                ],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-white/50">{k}</dt>
                  <dd className="min-w-0 truncate text-right text-white/85">{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </Instrument>
      </div>
    </AdminShell>
  );
}

function Empty({ days }: { days: number }) {
  return (
    <div className="rounded-xl border border-dashed border-navy/15 bg-navy/[0.02] px-6 py-10 text-center">
      <Micro>Nothing in the last {days} days</Micro>
      <p className="mx-auto mt-2 max-w-sm text-[0.8rem] leading-relaxed text-navy/55">
        Open the public site in this browser and it fills in. If you are
        expecting traffic from other visitors, that needs the forwarding
        endpoint or GA4 — see Connected tools.
      </p>
    </div>
  );
}
