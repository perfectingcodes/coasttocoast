import { Link } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  CircleAlert,
  Gauge,
  Globe,
  Megaphone,
  Phone,
  Star,
  Target,
  Users,
} from "lucide-react";
import { business, cleanAndTune, counties, locations, services } from "@/content/site";
import {
  channels,
  objectives,
  planMeta,
  seasonality,
  trackingStack,
} from "@/content/marketing";
import { AdminShell } from "@/components/admin/shell";
import {
  FeatureCard,
  Micro,
  Panel,
  StatCard,
  StatusPill,
  Table,
  Td,
} from "@/components/admin/ui";
import { STAGES, ago, traction, useCrm } from "@/lib/leads";
import { cn } from "@/lib/utils";

/**
 * Home Base — the one screen that answers "where does everything stand".
 *
 * Laid out on a twelve-column grid with deliberately uneven spans. A stack of
 * equal full-width panels is the thing that makes a dashboard look generated;
 * the eye needs somewhere to land first, then a second rank, then detail.
 */

const BLOCKERS = [
  {
    what: "Google Business Profile not claimed",
    go: "/admin/google",
    why: "The highest-ROI asset in local search. Nothing in the local pack works without it, and it is what issues the review link.",
    who: "Client",
  },
  {
    what: "No analytics or conversion tracking installed",
    go: "/admin/tracking",
    why: "No visitor data is being collected. Ad spend cannot be judged until this exists.",
    who: "Elevate + client",
  },
  {
    what: "Quote form has no destination",
    go: "/admin/leads",
    why: "VITE_QUOTE_ENDPOINT is unset, so the form falls back to a prefilled email. Requests are also written to the visitor's own browser, which the office cannot see.",
    who: "Elevate",
  },
  {
    what: "Domain and email unconfirmed",
    go: "/admin/seo",
    why: "coasttocoastair.com and info@ come from the design comp, not from anything published.",
    who: "Client",
  },
  {
    what: "No verified review figures",
    go: "/admin/google",
    why: "Site shows a neutral Google link and emits no rating, by design.",
    who: "Client",
  },
];

export default function AdminHome() {
  const blocked = channels.filter(
    (c) => c.status === "blocked" || c.status === "not-connected",
  );
  const trackingBlocked = trackingStack.filter(
    (s) => s.status === "blocked" || s.status === "not-connected",
  );
  const crm = useCrm();
  const t = traction(crm.events);
  const openLeads = crm.leads.filter((l) => l.stage !== "won" && l.stage !== "lost");
  const peak = Math.max(...seasonality.map((s) => s.demand));
  const month = new Date().toLocaleString("en-US", { month: "short" });
  const current = seasonality.find((s) => s.month === month);
  const pages = locations.length * services.length + locations.length + services.length + 7;

  return (
    <AdminShell
      title="Home Base"
      lead={`Everything for ${business.name} in one place — what is live, what is blocked, and what the season calls for next. ${planMeta.version}, ${planMeta.drafted}.`}
      actions={
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-[0.78rem] font-bold text-white transition-colors hover:bg-navy-soft"
        >
          Open the CRM
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      }
    >
      {/* ------------------------------------------------- first rank */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <FeatureCard
          className="lg:col-span-5"
          eyebrow="Start here"
          title="Claim the Google Business Profile"
          body="The highest-return item on the list and the one everything else depends on — the local pack, the review link, the map. Nothing downstream works until it is claimed."
          action="Open the Google page"
          href="/admin/google"
        />

        <div className="grid grid-cols-2 gap-5 lg:col-span-7">
          <StatCard
            label="Pages live"
            value={pages}
            hint="Prerendered static HTML"
            icon={<Globe />}
          />
          <StatCard
            label="Cities covered"
            value={locations.length}
            hint={`Across ${counties.length} counties`}
            icon={<Target />}
          />
          <StatCard
            label="Channels blocked"
            value={blocked.length}
            tone={blocked.length ? "warn" : "good"}
            hint="Waiting on client account access"
            icon={<Megaphone />}
          />
          <StatCard
            label="Tracking gaps"
            value={trackingBlocked.length}
            tone={trackingBlocked.length ? "bad" : "good"}
            hint="Nothing is measurable yet"
            icon={<Gauge />}
          />
        </div>
      </div>

      {/* ------------------------------------------------ second rank */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Panel
          className="lg:col-span-7"
          title="Blocking the whole plan"
          subtitle="None of the paid or measurement work can begin until these are resolved. They all need the client, not us."
        >
          <ul className="space-y-2">
            {BLOCKERS.map((b, i) => (
              <li key={b.what}>
                <Link
                  href={b.go}
                  className="group flex gap-3 rounded-xl px-3.5 py-3 transition-colors hover:bg-navy/[0.035]"
                >
                  <span className="mt-0.5 font-mono text-[0.65rem] font-bold tabular-nums text-ember">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-[0.85rem] font-bold text-navy">
                      {b.what}
                      <ArrowUpRight
                        className="size-3.5 shrink-0 text-navy/25 transition-colors group-hover:text-blue"
                        aria-hidden="true"
                      />
                    </p>
                    <p className="mt-1 text-[0.76rem] leading-relaxed text-navy/55">
                      {b.why}
                    </p>
                  </div>
                  <span className="shrink-0 self-start rounded-full bg-navy/5 px-2.5 py-1 text-[0.65rem] font-bold text-navy/55">
                    {b.who}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          className="lg:col-span-5 lg:self-start"
          title="Leads & traction"
          subtitle="Read from this browser only — there is no server to share it."
          action={
            <Link
              href="/admin/leads"
              className="shrink-0 font-display text-[0.7rem] font-bold uppercase tracking-[0.1em] text-blue hover:underline"
            >
              Open
            </Link>
          }
        >
          <div className="grid grid-cols-2 gap-x-5 gap-y-4">
            {[
              ["Leads", crm.leads.length, Users],
              ["Still open", openLeads.length, CircleAlert],
              ["Views, 14 days", t.views, ArrowUpRight],
              ["Phone taps", t.calls, Phone],
            ].map(([label, n, Icon]) => {
              const I = Icon as typeof Users;
              return (
                <div key={label as string} className="min-w-0">
                  <p className="flex items-center gap-1.5 font-display text-[0.56rem] font-extrabold uppercase tracking-[0.16em] text-navy/35">
                    <I className="size-3" aria-hidden="true" />
                    {label as string}
                  </p>
                  <p className="mt-1.5 font-display text-[1.65rem] font-extrabold leading-none tabular-nums tracking-[-0.03em] text-navy">
                    {n as number}
                  </p>
                </div>
              );
            })}
          </div>

          {crm.leads.length > 0 ? (
            <ul className="mt-5 space-y-2 border-t border-navy/8 pt-4">
              {crm.leads.slice(0, 4).map((l) => (
                <li key={l.id} className="flex flex-wrap items-baseline gap-x-2.5 text-xs">
                  <span className="font-bold text-navy">{l.name}</span>
                  <span className="min-w-0 truncate text-navy/50">
                    {[l.service, l.city].filter(Boolean).join(" · ")}
                  </span>
                  <span className="ml-auto shrink-0 font-mono text-[0.58rem] uppercase tracking-[0.08em] text-navy/35">
                    {STAGES.find((s) => s.id === l.stage)!.label} · {ago(l.at)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 border-t border-navy/8 pt-4 text-[0.76rem] leading-relaxed text-navy/50">
              Nothing captured in this browser — expected. Quote requests are
              emailed, and a visitor's activity stays on their own device until
              a backend exists.
            </p>
          )}
        </Panel>
      </div>

      {/* ------------------------------------------------- third rank */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Panel
          className="lg:col-span-7"
          title="Channel status"
          subtitle="Where each channel stands today."
        >
          <Table columns={["Channel", "Status", "Budget", "Owner"]}>
            {channels.map((c) => (
              <tr key={c.key} className="transition-colors hover:bg-navy/[0.02]">
                <Td className="font-bold text-navy">{c.name}</Td>
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
          className="lg:col-span-5"
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
                <span
                  className={cn(
                    "w-8 shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.08em]",
                    s.month === month ? "font-bold text-orange" : "text-navy/40",
                  )}
                >
                  {s.month}
                </span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-navy/6">
                  <span
                    className={cn(
                      "block h-full rounded-full",
                      s.month === month ? "bg-orange" : "bg-blue/45",
                    )}
                    style={{ width: `${(s.demand / peak) * 100}%` }}
                  />
                </span>
                <span className="w-6 shrink-0 text-right font-mono text-[0.62rem] tabular-nums text-navy/40">
                  {s.demand}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[0.72rem] leading-relaxed text-navy/45">
            Relative index, not call volume. Push maintenance in March and
            October, emergency June to September.
          </p>
        </Panel>
      </div>

      {/* ------------------------------------------------------ detail */}
      <Panel title="Objectives" subtitle="What this plan is trying to achieve.">
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
          {objectives.map((o, i) => (
            <div
              key={o.title}
              className={cn(
                "min-w-0 border-navy/8 pt-5 md:pt-0",
                i > 0 && "border-t md:border-t-0",
                i % 2 === 1 && "md:border-l md:pl-8",
                i > 1 && "md:mt-5 md:border-t md:pt-5",
              )}
            >
              <Micro>{String(i + 1).padStart(2, "0")}</Micro>
              <p className="mt-2 font-display text-[0.95rem] font-extrabold text-navy">
                {o.title}
              </p>
              <p className="mt-1.5 text-[0.8rem] leading-relaxed text-navy/60">{o.body}</p>
              <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[0.72rem]">
                <div className="flex gap-1.5">
                  <dt className="text-navy/40">Target</dt>
                  <dd className="font-bold text-navy">{o.target}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="text-navy/40">By</dt>
                  <dd className="font-bold text-navy">{o.horizon}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { href: "/admin/leads", label: "Leads & CRM", body: "Enquiries and traction", Icon: Users },
          { href: "/admin/resources", label: "Resources", body: "Review sequence", Icon: Star },
          { href: "/admin/seo", label: "SEO & GEO", body: "Measured site audit", Icon: Gauge },
          { href: "/admin/campaigns", label: "Campaigns", body: `${cleanAndTune.price} offer`, Icon: Megaphone },
          { href: "/admin/google", label: "Google", body: "Profile and Ads", Icon: Globe },
        ].map(({ href, label, body, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group min-w-0 rounded-2xl bg-white px-4 py-3.5 shadow-[0_1px_2px_rgb(7_26_61/0.05)] ring-1 ring-navy/6 transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-16px_rgb(7_26_61/0.5)] hover:ring-blue/35"
          >
            <Icon className="size-4 text-navy/30 transition-colors group-hover:text-blue" aria-hidden="true" />
            <p className="mt-2.5 font-display text-[0.82rem] font-extrabold text-navy">
              {label}
            </p>
            <p className="mt-0.5 truncate text-[0.7rem] text-navy/45">{body}</p>
          </Link>
        ))}
      </div>

      <p className="max-w-3xl text-[0.72rem] leading-relaxed text-navy/40">{planMeta.note}</p>
    </AdminShell>
  );
}
