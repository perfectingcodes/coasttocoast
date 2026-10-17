import { useState } from "react";
import { Link } from "wouter";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  CircleDot,
  Clock,
  Copy,
  DollarSign,
  ExternalLink,
  Target,
  TriangleAlert,
} from "lucide-react";
import {
  assetBlocks,
  budgetLadder,
  cadence,
  clientAsks,
  keywordBlocks,
  launch,
  negativeBlocks,
  rsaBlocks,
  setupSteps,
  strategy,
  weekOneCaveat,
  weekOneMath,
  type AskState,
  type PasteBlock,
} from "@/content/ads-launch";
import { conflicts, geoTargets, kpiTargets } from "@/content/ads-plan";
import { landingPages } from "@/content/landing";
import { AdminShell } from "@/components/admin/shell";
import { Instrument, Micro, Panel, StatCard, Table, Td } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

/**
 * The launch plan, built to be worked through top to bottom and pasted into
 * Google Ads as you go.
 *
 * Order is deliberate: what we are doing and why, what it costs, what we need
 * from the client, then the build in the order the screens appear, then every
 * block of text with a copy button on it. Reference material from the
 * original build sheet sits at the bottom where it does not get in the way.
 */

const ASK_STATE: Record<AskState, { label: string; cls: string }> = {
  "in-flight": { label: "In progress", cls: "bg-gold/20 text-amber-800 ring-gold/40" },
  waiting: { label: "Not started", cls: "bg-ember/10 text-ember ring-ember/25" },
  done: { label: "Done", cls: "bg-emerald-500/12 text-emerald-700 ring-emerald-500/25" },
};

export default function AdminGoogleAds() {
  const outstanding = clientAsks.filter((a) => a.state !== "done").length;
  const live = landingPages.filter((p) => p.plan === "google-ads").length;

  return (
    <AdminShell
      title="Launch plan"
      lead={`Google Ads for the HVAC division, starting ${launch.startDate} on $${launch.weekOneBudget} in week one. Work down this page and paste as you go.`}
    >
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Go live"
          value={launch.startShort}
          icon={<CalendarDays />}
          hint="Monday morning, never a Friday"
        />
        <StatCard
          label="Week 1 budget"
          value={`$${launch.weekOneBudget}`}
          icon={<DollarSign />}
          hint="$43 a day, one campaign"
        />
        <StatCard
          label="Needed from client"
          value={outstanding}
          tone={outstanding ? "bad" : "good"}
          icon={<AlertTriangle />}
          hint="DBA and licence are the urgent two"
        />
        <StatCard
          label="Landing pages live"
          value={live}
          tone="good"
          icon={<Target />}
          hint="Built and ready"
        />
      </div>

      {/* --------------------------------------------------- the strategy */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Instrument
          className="lg:col-span-5 lg:self-start"
          label="In one sentence"
          footnote={launch.whyMonday}
        >
          <p className="mt-3 font-display text-[1.25rem] font-extrabold leading-[1.25]">
            {launch.oneLine}
          </p>
        </Instrument>

        <Panel
          className="lg:col-span-7"
          title="The strategy"
          subtitle="Five decisions. Everything else on this page follows from them."
        >
          <ol className="space-y-4">
            {strategy.map((s, i) => (
              <li key={s.point} className="flex gap-3.5">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-blue/10 font-mono text-[0.62rem] font-bold text-blue">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-display text-[0.92rem] font-extrabold text-navy">
                    {s.point}
                  </p>
                  <p className="mt-1 text-[0.8rem] leading-relaxed text-navy/60">
                    {s.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      {/* ------------------------------------------------------ the money */}
      <Panel
        title="The budget ladder"
        subtitle="Each rung is conditional on the one below it producing something. A week that generates nothing earns a diagnosis, not a bigger budget."
      >
        <div className="space-y-3">
          {budgetLadder.map((w, i) => (
            <div
              key={w.label}
              className={cn(
                "min-w-0 rounded-xl p-4 ring-1 ring-inset",
                i === 0 ? "bg-blue/5 ring-blue/30" : "bg-navy/[0.025] ring-navy/8",
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="font-display text-[0.95rem] font-extrabold text-navy">
                  {w.label}
                  <span className="ml-2.5 font-mono text-[0.68rem] font-normal uppercase tracking-[0.1em] text-navy/45">
                    {w.dates}
                  </span>
                </p>
                <p className="font-display text-[1.3rem] font-extrabold tabular-nums text-blue">
                  ${w.total}
                  <span className="ml-1 text-[0.68rem] font-bold uppercase tracking-wide text-navy/40">
                    / wk
                  </span>
                </p>
              </div>

              <ul className="mt-3 grid gap-1.5 border-t border-navy/8 pt-3 sm:grid-cols-2">
                {w.rows.map((r) => (
                  <li
                    key={r.campaign}
                    className="flex flex-wrap items-baseline justify-between gap-x-3 text-[0.78rem]"
                  >
                    <span className="min-w-0 font-semibold text-navy/75">{r.campaign}</span>
                    <span className="shrink-0 font-mono text-[0.68rem] text-navy/50">
                      ${r.daily}/day · {r.cap}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-3 text-[0.78rem] leading-relaxed text-navy/60">{w.goal}</p>
              {w.gate && (
                <p className="mt-2 flex gap-2 text-[0.76rem] leading-relaxed text-amber-800">
                  <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  {w.gate}
                </p>
              )}
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        title="What $300 actually buys"
        subtitle="Stated before anybody forms an expectation from it. Every figure is the build sheet's own month-one target applied to this budget."
      >
        <div className="-mx-5 overflow-x-auto" data-wide="">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <tbody className="divide-y divide-navy/6">
              {weekOneMath.map((m) => (
                <tr key={m.line}>
                  <td className="px-5 py-2.5 text-[0.82rem] font-semibold text-navy">
                    {m.line}
                  </td>
                  <td className="px-5 py-2.5 font-display text-[0.95rem] font-extrabold tabular-nums text-blue">
                    {m.value}
                  </td>
                  <td className="px-5 py-2.5 text-[0.76rem] text-navy/50">{m.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-3xl rounded-xl bg-navy/[0.03] p-4 text-[0.8rem] leading-relaxed text-navy/70">
          {weekOneCaveat}
        </p>
      </Panel>

      {/* ------------------------------------------------ client blockers */}
      <Panel
        title="What we need from the client"
        subtitle="The only list on this page that is not ours to do. The first two are holding up real money."
      >
        <ul className="space-y-3">
          {clientAsks.map((a) => (
            <li
              key={a.what}
              className={cn(
                "min-w-0 rounded-xl p-4 ring-1 ring-inset",
                a.state === "in-flight"
                  ? "bg-gold/8 ring-gold/35"
                  : "bg-navy/[0.025] ring-navy/8",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <p className="font-display text-[0.92rem] font-extrabold text-navy">
                  {a.what}
                </p>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[0.64rem] font-bold ring-1 ring-inset",
                    ASK_STATE[a.state].cls,
                  )}
                >
                  {ASK_STATE[a.state].label}
                </span>
              </div>
              <dl className="mt-3 grid gap-x-8 gap-y-2.5 border-t border-navy/8 pt-3 text-[0.78rem] leading-relaxed md:grid-cols-2">
                <div>
                  <dt className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-navy/40">
                    Why we need it
                  </dt>
                  <dd className="mt-0.5 text-navy/70">{a.why}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-navy/40">
                    What it blocks
                  </dt>
                  <dd className="mt-0.5 text-navy/70">{a.blocks}</dd>
                </div>
              </dl>
              <p className="mt-2.5 flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.1em] text-blue">
                <Clock className="size-3 shrink-0" aria-hidden="true" />
                {a.needBy}
              </p>
            </li>
          ))}
        </ul>
      </Panel>

      {/* ----------------------------------------------------- the build */}
      <Panel
        title="Build it in this order"
        subtitle="The screens as they appear in Google Ads. Settings shown are literally what to type or choose."
      >
        <ol className="space-y-5">
          {setupSteps.map((s) => (
            <li key={s.n} className="flex gap-4">
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-navy font-display text-[0.78rem] font-extrabold text-white">
                {s.n}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[0.95rem] font-extrabold text-navy">
                  {s.title}
                </p>
                <p className="mt-1.5 text-[0.82rem] leading-relaxed text-navy/65">
                  {s.body}
                </p>

                {s.set && (
                  <dl className="mt-3 overflow-hidden rounded-xl ring-1 ring-inset ring-navy/10">
                    {s.set.map((row, i) => (
                      <div
                        key={row.field}
                        className={cn(
                          "flex flex-col gap-0.5 px-3.5 py-2 sm:flex-row sm:gap-5",
                          i % 2 === 0 ? "bg-navy/[0.025]" : "bg-white",
                        )}
                      >
                        <dt className="font-mono text-[0.68rem] uppercase tracking-[0.06em] text-navy/45 sm:w-40 sm:shrink-0">
                          {row.field}
                        </dt>
                        <dd className="min-w-0 font-mono text-[0.72rem] text-navy/80">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                {s.warn && (
                  <p className="mt-3 flex gap-2.5 rounded-xl bg-ember/6 p-3 text-[0.78rem] leading-relaxed text-navy/75 ring-1 ring-inset ring-ember/20">
                    <TriangleAlert
                      className="mt-0.5 size-3.5 shrink-0 text-ember"
                      aria-hidden="true"
                    />
                    {s.warn}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Panel>

      {/* -------------------------------------------------------- pastes */}
      <Panel
        title="Keywords"
        subtitle={`Paste a whole block at once — the keyword box splits on line breaks. "Quotes" are phrase match, [brackets] are exact. No broad match anywhere at launch.`}
      >
        <div className="space-y-6">
          {keywordBlocks.map((c) => (
            <div key={c.campaign}>
              <Micro>{c.campaign}</Micro>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {c.groups.map((g) => (
                  <CopyBlock key={g.title} block={g} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        title="Negative keywords"
        subtitle="Build these as shared lists before the campaign goes live, not after the first wasted week."
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {negativeBlocks.map((b) => (
            <CopyBlock key={b.title} block={b} />
          ))}
        </div>
      </Panel>

      <Panel
        title="Ad copy"
        subtitle="Two responsive search ads per ad group. Headlines are 30 characters max, descriptions 90 — all of these are already inside the limit."
      >
        <div className="space-y-5">
          {rsaBlocks.map((ad) => (
            <div
              key={ad.adGroup}
              className="min-w-0 rounded-xl bg-navy/[0.025] p-4 ring-1 ring-inset ring-navy/8"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="font-display text-[0.92rem] font-extrabold text-navy">
                  {ad.adGroup}
                </p>
                <p className="font-mono text-[0.66rem] text-navy/50">
                  Final URL: {ad.finalUrl}
                </p>
              </div>
              {ad.note && (
                <p className="mt-1.5 text-[0.76rem] leading-relaxed text-navy/55">
                  {ad.note}
                </p>
              )}
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                <CopyBlock
                  block={{
                    where: `${ad.adGroup} → Headlines`,
                    title: `${ad.headlines.length} headlines`,
                    lines: ad.headlines.map((h) => h.text),
                  }}
                  annotations={ad.headlines.map((h) => h.pin)}
                />
                <CopyBlock
                  block={{
                    where: `${ad.adGroup} → Descriptions`,
                    title: `${ad.descriptions.length} descriptions`,
                    lines: ad.descriptions,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        title="Assets and tracking"
        subtitle="All at account level, so every campaign inherits them."
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {assetBlocks.map((b) => (
            <CopyBlock key={b.title} block={b} />
          ))}
        </div>
      </Panel>

      {/* ------------------------------------------------------- ongoing */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Panel
          className="lg:col-span-5"
          title="The ongoing job"
          subtitle="What 'managing it' actually means week to week."
        >
          <ul className="space-y-2.5">
            {cadence.map((c) => (
              <li key={c.when + c.task} className="flex gap-3">
                <CircleDot className="mt-1 size-3 shrink-0 text-blue" aria-hidden="true" />
                <p className="min-w-0 text-[0.8rem] leading-relaxed text-navy/70">
                  <span className="font-bold text-navy">{c.when}</span> — {c.task}
                </p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          className="lg:col-span-7"
          title="Targets"
          subtitle="The build sheet's own numbers. Month 1 assumes a full month at Tier B, so week one will sit below these — that is expected, not a problem."
        >
          <Table columns={["Metric", "Month 1", "Month 3", "Month 6"]}>
            {kpiTargets.slice(0, 8).map((k) => (
              <tr key={k.metric} className="transition-colors hover:bg-navy/[0.02]">
                <Td className="font-bold text-navy">{k.metric}</Td>
                <Td muted>{k.m1}</Td>
                <Td muted>{k.m3}</Td>
                <Td className="font-bold text-blue">{k.m6}</Td>
              </tr>
            ))}
          </Table>
        </Panel>
      </div>

      {/* ----------------------------------------------------- reference */}
      <Panel
        title="Geo targeting"
        subtitle="Three cities at launch. The exclusions are the point — splitting this budget across six cities is the fastest way to fail."
      >
        <ul className="grid gap-2 md:grid-cols-2">
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

      <Panel
        title="Open decisions"
        subtitle="Where the build sheet and the website disagree. Each one is cheaper to settle before launch than after."
      >
        <ul className="space-y-2.5">
          {conflicts.map((c, i) => (
            <li
              key={c.what}
              className="min-w-0 rounded-xl bg-gold/8 p-4 ring-1 ring-inset ring-gold/35"
            >
              <p className="flex items-center gap-2.5 font-display text-[0.88rem] font-extrabold text-navy">
                <span className="font-mono text-[0.66rem] tabular-nums text-ember">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {c.what}
              </p>
              <p className="mt-2 text-[0.78rem] leading-relaxed text-navy/70">{c.cost}</p>
            </li>
          ))}
        </ul>
      </Panel>

      <p className="flex flex-wrap items-center gap-2 text-[0.74rem] text-navy/45">
        <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
        Landing pages and the review sequence live on{" "}
        <Link href="/admin/resources" className="font-semibold text-blue hover:underline">
          Resources
        </Link>
        . The Meta and email plan is on{" "}
        <Link href="/admin/campaigns" className="font-semibold text-blue hover:underline">
          Campaigns
        </Link>
        .
      </p>
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ copy */

/**
 * A block of text with a copy button. The whole point of this page is that
 * nothing has to be retyped into Google Ads, so every list is one click.
 */
function CopyBlock({
  block,
  annotations,
}: {
  block: PasteBlock;
  annotations?: (string | undefined)[];
}) {
  const [copied, setCopied] = useState(false);
  const text = block.lines.join("\n");

  return (
    <div className="flex min-w-0 flex-col rounded-xl bg-white ring-1 ring-inset ring-navy/10">
      <div className="flex items-start justify-between gap-3 border-b border-navy/8 px-3.5 py-2.5">
        <div className="min-w-0">
          <p className="font-display text-[0.8rem] font-extrabold text-navy">
            {block.title}
          </p>
          <p className="mt-0.5 font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.08em] text-navy/40">
            {block.where}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(text).then(
              () => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              },
              () => {
                /* Clipboard blocked — the text is on screen to select. */
              },
            );
          }}
          aria-label={copied ? "Copied" : `Copy ${block.title}`}
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-lg transition-colors",
            copied
              ? "bg-emerald-50 text-emerald-600"
              : "text-navy/40 hover:bg-navy/5 hover:text-navy",
          )}
        >
          {copied ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <Copy className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {block.note && (
        <p className="border-b border-navy/8 px-3.5 py-2 text-[0.74rem] leading-relaxed text-navy/55">
          {block.note}
        </p>
      )}

      <ul className="min-w-0 flex-1 p-3.5 font-mono text-[0.72rem] leading-relaxed text-navy/80">
        {block.lines.map((l, i) => (
          <li
            key={l + i}
            // overflow-wrap:anywhere, not break-words: the tracking template
            // is one long token with no space to break on.
            className="flex min-w-0 flex-wrap items-baseline gap-x-2 [overflow-wrap:anywhere]"
          >
            {l}
            {annotations?.[i] && (
              <span className="rounded bg-blue/10 px-1.5 py-0.5 text-[0.58rem] font-bold uppercase tracking-wide text-blue">
                {annotations[i]}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
