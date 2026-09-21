import { Link } from "wouter";
import { ArrowRight, CircleAlert, Gauge, Globe, Megaphone, Target } from "lucide-react";
import { business, cleanAndTune, locations, services } from "@/content/site";
import {
  channels,
  objectives,
  planMeta,
  seasonality,
  trackingStack,
} from "@/content/marketing";
import { AdminShell } from "@/components/admin/shell";
import { Panel, StatCard, StatusPill, Table, Td } from "@/components/admin/ui";

/** Home Base — the one screen that answers "where does everything stand". */
export default function AdminHome() {
  const blocked = [
    ...channels.filter((c) => c.status === "blocked" || c.status === "not-connected"),
  ];
  const trackingBlocked = trackingStack.filter(
    (t) => t.status === "blocked" || t.status === "not-connected",
  );
  const peak = Math.max(...seasonality.map((s) => s.demand));
  const month = new Date().toLocaleString("en-US", { month: "short" });
  const current = seasonality.find((s) => s.month === month);

  return (
    <AdminShell
      title="Home Base"
      lead={`Everything for ${business.name} in one place — what is live, what is blocked, and what the season calls for next. ${planMeta.version}, ${planMeta.drafted}.`}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pages live"
          value={locations.length * services.length + locations.length + services.length + 7}
          hint="Prerendered static HTML"
        />
        <StatCard label="Cities covered" value={locations.length} hint="Across three counties" />
        <StatCard
          label="Channels blocked"
          value={blocked.length}
          tone={blocked.length ? "warn" : "good"}
          hint="Need client account access"
        />
        <StatCard
          label="Tracking gaps"
          value={trackingBlocked.length}
          tone={trackingBlocked.length ? "bad" : "good"}
          hint="Nothing is measurable yet"
        />
      </div>

      {/* The honest headline: nothing paid can start until these land. */}
      <Panel
        title="Blocking the whole plan"
        subtitle="None of the paid or measurement work can begin until these are resolved. They all need the client, not us."
      >
        <ul className="space-y-3">
          {[
            {
              what: "Google Business Profile not claimed",
              why: "The highest-ROI asset in local search. Nothing in the local pack works without it.",
              who: "Client",
            },
            {
              what: "No analytics or conversion tracking installed",
              why: "No visitor data is being collected. Ad spend cannot be judged until this exists.",
              who: "Elevate + client",
            },
            {
              what: "Quote form has no destination",
              why: "VITE_QUOTE_ENDPOINT is unset, so the form falls back to opening a prefilled email. Leads are not lost but are not tracked.",
              who: "Elevate",
            },
            {
              what: "Domain and email unconfirmed",
              why: "coasttocoastair.com and info@ come from the design comp, not from anything published.",
              who: "Client",
            },
            {
              what: "No verified review figures",
              why: "Site shows a neutral Google link and emits no rating, by design.",
              who: "Client",
            },
          ].map((b) => (
            <li key={b.what} className="flex gap-3 rounded-lg bg-slate-50 p-3.5">
              <CircleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{b.what}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{b.why}</p>
              </div>
              <span className="ml-auto shrink-0 self-start rounded-full bg-white px-2.5 py-0.5 text-[0.7rem] font-semibold text-slate-600 ring-1 ring-slate-300">
                {b.who}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Channel status" subtitle="Where each channel stands today.">
          <Table columns={["Channel", "Status", "Budget", "Owner"]}>
            {channels.map((c) => (
              <tr key={c.key}>
                <Td className="font-medium text-slate-900">{c.name}</Td>
                <Td>
                  <StatusPill status={c.status} />
                </Td>
                <Td muted>{c.budget}</Td>
                <Td muted>{c.owner}</Td>
              </tr>
            ))}
          </Table>
        </Panel>

        <Panel
          title="Seasonal demand"
          subtitle={
            current
              ? `${current.month}: ${current.focus.toLowerCase()}.`
              : "Florida's curve is the inverse of most of the country."
          }
        >
          <ul className="space-y-1.5">
            {seasonality.map((s) => (
              <li key={s.month} className="flex items-center gap-3">
                <span className="w-8 shrink-0 text-xs font-semibold text-slate-500">
                  {s.month}
                </span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <span
                    className={
                      s.month === month
                        ? "block h-full rounded-full bg-orange"
                        : "block h-full rounded-full bg-slate-400"
                    }
                    style={{ width: `${(s.demand / peak) * 100}%` }}
                  />
                </span>
                <span className="w-8 shrink-0 text-right text-xs tabular-nums text-slate-500">
                  {s.demand}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            Relative index, not call volume. Shape is what matters: push
            maintenance in March and October, emergency June to September.
          </p>
        </Panel>
      </div>

      <Panel title="Objectives" subtitle="What this plan is trying to achieve.">
        <div className="grid gap-4 md:grid-cols-2">
          {objectives.map((o) => (
            <div key={o.title} className="rounded-lg border border-slate-200 p-4">
              <p className="font-display text-sm font-bold text-slate-900">{o.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{o.body}</p>
              <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-slate-100 pt-3 text-xs">
                <div className="flex gap-1.5">
                  <dt className="text-slate-500">Target</dt>
                  <dd className="font-semibold text-slate-900">{o.target}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="text-slate-500">By</dt>
                  <dd className="font-semibold text-slate-900">{o.horizon}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/admin/seo", label: "SEO & GEO", body: "Measured audit of the live site", Icon: Gauge },
          { href: "/admin/marketing", label: "Marketing plan", body: "Channels, budget, calendar", Icon: Target },
          { href: "/admin/campaigns", label: "Campaigns", body: `Meta & Google, ${cleanAndTune.price} offer`, Icon: Megaphone },
          { href: "/admin/google", label: "Google", body: "Profile, Ads, Search Console", Icon: Globe },
        ].map(({ href, label, body, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-400"
          >
            <Icon className="size-5 text-slate-400" aria-hidden="true" />
            <p className="mt-3 font-display text-sm font-bold text-slate-900">{label}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{body}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-900">
              Open
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        ))}
      </div>

      <p className="text-xs leading-relaxed text-slate-500">{planMeta.note}</p>
    </AdminShell>
  );
}
