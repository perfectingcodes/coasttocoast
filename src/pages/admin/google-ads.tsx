import { Link } from "wouter";
import {
  AlertTriangle,
  Check,
  CircleDot,
  ExternalLink,
  MapPin,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  adCampaigns,
  biddingPhases,
  budgetNote,
  budgetTiers,
  checklist,
  conflicts,
  conversionActions,
  criticalSettings,
  geoTargets,
  kpiNote,
  kpiTargets,
  planSource,
  type ChecklistItem,
} from "@/content/ads-plan";
import { landingPages } from "@/content/landing";
import { AdminShell } from "@/components/admin/shell";
import { Instrument, Micro, Panel, StatCard, Table, Td } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

/**
 * The Google Ads build sheet, rendered.
 *
 * This is the client's plan, not ours — Arranges Web, October 2026. The page
 * exists so the dashboard shows what is actually being built, and so the
 * places where the sheet and this site disagree are visible rather than
 * quietly reconciled in somebody's head.
 */

const STATE: Record<ChecklistItem["state"], { label: string; cls: string }> = {
  done: { label: "Done", cls: "bg-emerald-500/12 text-emerald-700 ring-emerald-500/25" },
  blocked: { label: "Blocked", cls: "bg-ember/10 text-ember ring-ember/25" },
  outside: { label: "In the ad account", cls: "bg-navy/6 text-navy/55 ring-navy/12" },
};

export default function AdminGoogleAds() {
  const blockers = checklist.filter((c) => c.state === "blocked");
  const built = landingPages.filter((p) => p.plan === "google-ads");
  const tierB = budgetTiers.reduce((a, b) => a + b.b, 0);

  return (
    <AdminShell
      title="Google Ads build"
      lead={`${planSource.title} — ${planSource.author}, ${planSource.dated}. The plan being built, transcribed from the workbook. Where this and the rest of the dashboard disagree, this wins.`}
    >
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Launch markets"
          value={4}
          icon={<MapPin />}
          hint="Naples, Bonita, Estero, N. Naples"
        />
        <StatCard
          label="Landing pages built"
          value={`${built.length}/4`}
          tone={built.length >= 4 ? "good" : "warn"}
          icon={<Target />}
          hint="Against tab 10"
        />
        <StatCard
          label="Tier B budget"
          value={`$${tierB.toLocaleString()}`}
          icon={<Wallet />}
          hint="Per month, recommended"
        />
        <StatCard
          label="Pre-launch blockers"
          value={blockers.length}
          tone={blockers.length ? "bad" : "good"}
          icon={<AlertTriangle />}
          hint="All need the client"
        />
      </div>

      {/* The one thing on this page that must not be missed. */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Instrument
          className="lg:col-span-5"
          label="Before anything is enabled"
          footnote={`${planSource.client} · ${planSource.markets}`}
        >
          <p className="mt-3 font-display text-[1.3rem] font-extrabold leading-tight">
            {planSource.gate}
          </p>
          <p className="mt-3 text-[0.85rem] leading-relaxed text-white/70">
            {planSource.constraint}
          </p>
        </Instrument>

        <Panel
          className="lg:col-span-7"
          title="Settings that are wrong by default"
          subtitle="Each of these costs money if it is left as Google ships it."
        >
          <ul className="space-y-3">
            {criticalSettings.map((s) => (
              <li key={s.setting} className="flex gap-3.5">
                <CircleDot className="mt-1 size-3.5 shrink-0 text-ember" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="flex flex-wrap items-baseline gap-x-2.5 text-[0.85rem]">
                    <span className="font-bold text-navy">{s.setting}</span>
                    <span className="font-mono text-[0.7rem] text-blue">{s.value}</span>
                  </p>
                  <p className="mt-0.5 text-[0.76rem] leading-relaxed text-navy/55">
                    {s.why}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* ------------------------------------------------------- conflicts */}
      <Panel
        title="Where the sheet and this site disagree"
        subtitle="None of these are ours to decide, and each one is cheaper to settle before launch than after."
      >
        <ul className="space-y-3">
          {conflicts.map((c, i) => (
            <li
              key={c.what}
              className="min-w-0 rounded-xl bg-gold/8 p-4 ring-1 ring-inset ring-gold/35"
            >
              <p className="flex items-center gap-2.5 font-display text-[0.9rem] font-extrabold text-navy">
                <span className="font-mono text-[0.68rem] tabular-nums text-ember">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {c.what}
              </p>
              <dl className="mt-3 grid gap-x-8 gap-y-2 text-[0.78rem] leading-relaxed md:grid-cols-2">
                <div>
                  <dt className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-navy/40">
                    The sheet says
                  </dt>
                  <dd className="mt-0.5 text-navy/70">{c.sheet}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-navy/40">
                    The site says
                  </dt>
                  <dd className="mt-0.5 text-navy/70">{c.site}</dd>
                </div>
              </dl>
              <p className="mt-3 border-t border-gold/30 pt-2.5 text-[0.78rem] leading-relaxed text-navy/75">
                {c.cost}
              </p>
            </li>
          ))}
        </ul>
      </Panel>

      {/* ------------------------------------------------------- structure */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Panel
          className="lg:col-span-7"
          title="Account structure"
          subtitle="Budget share and when each campaign turns on."
        >
          <ul className="space-y-2.5">
            {adCampaigns.map((c) => (
              <li key={c.name} className="min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="font-display text-[0.88rem] font-extrabold text-navy">
                    {c.name}
                  </p>
                  <p className="flex shrink-0 items-center gap-2.5 font-mono text-[0.65rem] uppercase tracking-[0.08em]">
                    <span className={c.share ? "text-blue" : "text-navy/35"}>
                      {c.share}%
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 font-semibold",
                        c.timing === "Day 1"
                          ? "bg-emerald-500/12 text-emerald-700"
                          : c.timing === "Hold"
                            ? "bg-navy/6 text-navy/45"
                            : "bg-gold/20 text-amber-800",
                      )}
                    >
                      {c.timing}
                    </span>
                  </p>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-navy/6">
                  <div
                    className={cn("h-full rounded-full", c.share ? "bg-blue" : "bg-transparent")}
                    style={{ width: `${c.share}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[0.76rem] leading-relaxed text-navy/55">
                  {c.purpose}
                </p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          className="lg:col-span-5"
          title="Geo targeting"
          subtitle="Phase 1 is three cities. The exclusions are the point."
        >
          <ul className="space-y-2">
            {geoTargets.map((g) => (
              <li
                key={g.place}
                className={cn(
                  "min-w-0 rounded-lg px-3 py-2.5",
                  g.kind === "Exclude" ? "bg-ember/6" : "bg-navy/[0.025]",
                )}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p
                    className={cn(
                      "min-w-0 text-[0.82rem] font-bold",
                      g.kind === "Exclude" ? "text-ember" : "text-navy",
                    )}
                  >
                    {g.place}
                  </p>
                  <span className="shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-navy/45">
                    {g.bid}
                  </span>
                </div>
                <p className="mt-1 text-[0.72rem] leading-relaxed text-navy/55">{g.note}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* ---------------------------------------------------- landing pages */}
      <Panel
        title="Landing pages against tab 10"
        subtitle="What each page has to carry, and whether it does."
      >
        <ul className="space-y-3">
          {built.map((lp) => (
            <li key={lp.path} className="min-w-0 rounded-xl bg-navy/[0.025] p-4 ring-1 ring-inset ring-navy/8">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <div className="min-w-0">
                  <a
                    href={lp.path}
                    className="inline-flex items-center gap-1.5 font-display text-[0.9rem] font-extrabold text-navy hover:text-blue"
                  >
                    {lp.path}
                    <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                  </a>
                  <p className="mt-1 text-[0.76rem] text-navy/55">
                    {lp.adGroups.join(" · ")}
                  </p>
                </div>
                <p className="shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-navy/40">
                  {lp.campaign}
                </p>
              </div>
              <ul className="mt-3 flex flex-wrap gap-1.5 border-t border-navy/8 pt-3">
                {lp.requirements.map((r) => {
                  const open = /NOT CONFIRMED|NOT SET/i.test(r);
                  return (
                    <li
                      key={r}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold ring-1 ring-inset",
                        open
                          ? "bg-gold/15 text-amber-800 ring-gold/40"
                          : "bg-white text-navy/65 ring-navy/10",
                      )}
                    >
                      {open ? (
                        <AlertTriangle className="size-3 shrink-0" aria-hidden="true" />
                      ) : (
                        <Check className="size-3 shrink-0 text-emerald-600" aria-hidden="true" />
                      )}
                      {r}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[0.74rem] leading-relaxed text-navy/50">
          Emergency AC is call-only and has no page by design. The{" "}
          <code className="font-mono">/reviews</code> and{" "}
          <code className="font-mono">/service-areas</code> sitelinks are not
          built — see the conflicts above. Every page here is{" "}
          <code className="font-mono">noindex</code> and out of the sitemap, and
          deliberately not blocked in robots.txt so AdsBot can fetch it.
        </p>
      </Panel>

      {/* --------------------------------------------------------- budget */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Panel className="lg:col-span-7" title="Budget tiers" subtitle={budgetNote}>
          <Table columns={["Campaign", "Tier A", "Tier B", "Tier C", "Bid strategy"]}>
            {budgetTiers.map((b) => (
              <tr key={b.campaign} className="transition-colors hover:bg-navy/[0.02]">
                <Td className="font-bold text-navy">{b.campaign}</Td>
                <Td muted>${b.a.toLocaleString()}</Td>
                <Td className="font-bold text-blue">${b.b.toLocaleString()}</Td>
                <Td muted>${b.c.toLocaleString()}</Td>
                <Td muted>{b.strategy}</Td>
              </tr>
            ))}
            <tr className="bg-navy/[0.03]">
              <Td className="font-bold text-navy">Total / month</Td>
              <Td muted>${budgetTiers.reduce((a, b) => a + b.a, 0).toLocaleString()}</Td>
              <Td className="font-bold text-blue">
                ${budgetTiers.reduce((a, b) => a + b.b, 0).toLocaleString()}
              </Td>
              <Td muted>${budgetTiers.reduce((a, b) => a + b.c, 0).toLocaleString()}</Td>
              <Td muted>—</Td>
            </tr>
          </Table>
        </Panel>

        <Panel className="lg:col-span-5" title="Bidding phases" subtitle="Do not skip ahead.">
          <ol className="space-y-4">
            {biddingPhases.map((p, i) => (
              <li key={p.phase} className="flex gap-3.5">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-blue/10 font-mono text-[0.65rem] font-bold text-blue">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-baseline gap-x-2.5">
                    <span className="font-display text-[0.85rem] font-extrabold text-navy">
                      {p.phase}
                    </span>
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-navy/45">
                      {p.when}
                    </span>
                  </p>
                  <p className="mt-1 text-[0.76rem] leading-relaxed text-navy/60">{p.what}</p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      {/* ------------------------------------------------------- tracking */}
      <Panel
        title="Conversion actions"
        subtitle="Built and tested before a single campaign is enabled."
      >
        <ul className="grid gap-2.5 md:grid-cols-2">
          {conversionActions.map((c) => (
            <li
              key={c.action}
              className="min-w-0 rounded-lg bg-navy/[0.025] px-3.5 py-3"
            >
              <p className="flex flex-wrap items-center gap-2 text-[0.82rem] font-bold text-navy">
                {c.action}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide",
                    c.primary ? "bg-blue/10 text-blue" : "bg-navy/8 text-navy/50",
                  )}
                >
                  {c.primary ? "Primary" : "Secondary"}
                </span>
              </p>
              <p className="mt-1 text-[0.74rem] leading-relaxed text-navy/55">{c.note}</p>
            </li>
          ))}
        </ul>
      </Panel>

      {/* ----------------------------------------------------------- KPIs */}
      <Panel title="KPI targets" subtitle={kpiNote}>
        <Table columns={["Metric", "Month 1", "Month 3", "Month 6", "Note"]}>
          {kpiTargets.map((k) => (
            <tr key={k.metric} className="transition-colors hover:bg-navy/[0.02]">
              <Td className="font-bold text-navy">{k.metric}</Td>
              <Td muted>{k.m1}</Td>
              <Td muted>{k.m3}</Td>
              <Td className="font-bold text-blue">{k.m6}</Td>
              <Td muted>{k.note ?? ""}</Td>
            </tr>
          ))}
        </Table>
      </Panel>

      {/* ------------------------------------------------------ checklist */}
      <Panel
        title="Build checklist"
        subtitle="Status is our read from inside this repo. Anything living in the ad account we cannot see and do not claim."
      >
        {["Pre-build", "Setup", "Build", "Launch"].map((group) => (
          <div key={group} className="mt-5 first:mt-0">
            <Micro>{group}</Micro>
            <ul className="mt-2.5 space-y-1.5">
              {checklist
                .filter((c) => c.group === group)
                .map((c) => (
                  <li
                    key={c.task}
                    className="flex flex-wrap items-start gap-x-3 gap-y-1.5 rounded-lg px-3 py-2 transition-colors hover:bg-navy/[0.02]"
                  >
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-0.5 text-[0.62rem] font-bold ring-1 ring-inset",
                        STATE[c.state].cls,
                      )}
                    >
                      {STATE[c.state].label}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.82rem] font-semibold text-navy">
                        {c.task}
                      </span>
                      {c.note && (
                        <span className="mt-0.5 block break-words text-[0.74rem] leading-relaxed text-navy/55">
                          {c.note}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-navy/40">
                      {c.owner}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </Panel>

      <p className="flex flex-wrap items-center gap-2 text-[0.74rem] text-navy/45">
        <TrendingUp className="size-3.5 shrink-0" aria-hidden="true" />
        The earlier campaign draft in{" "}
        <Link href="/admin/campaigns" className="font-semibold text-blue hover:underline">
          Campaigns
        </Link>{" "}
        predates this sheet. It still holds the Meta and email plan, which the
        sheet does not cover.
      </p>
    </AdminShell>
  );
}
