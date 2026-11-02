import { useEffect, useState } from "react";
import { CheckCircle2, FileWarning, RefreshCw } from "lucide-react";
import { business, locations, services } from "@/content/site";
import { keywordTargets } from "@/content/marketing";
import {
  geoWork,
  leadLevers,
  seoPremise,
  targets,
  type Tier,
} from "@/content/seo-plan";
import { AdminShell } from "@/components/admin/shell";
import { Micro, Panel, StatCard, Table, Td } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

interface SeoReport {
  generatedAt: string;
  pages: number;
  problems: string[];
  similarity: Record<
    string,
    {
      pages: number;
      meanSimilarity: number;
      maxSimilarity: number;
      pairsOverThreshold: number;
      medianWords: number;
    }
  >;
  titles: { total: number; duplicates: number };
  descriptions: { total: number; duplicates: number };
}

/**
 * Reads the report written by `pnpm audit:seo` after each build. This is real
 * measured data about the live output, not a mock — if the file is missing the
 * panel says so rather than showing invented numbers.
 */
function useSeoReport() {
  const [report, setReport] = useState<SeoReport | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");

  useEffect(() => {
    let alive = true;
    fetch("/seo-report.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("missing"))))
      .then((d) => alive && (setReport(d), setState("ok")))
      .catch(() => alive && setState("missing"));
    return () => {
      alive = false;
    };
  }, []);

  return { report, state };
}

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

export default function AdminSeo() {
  const { report, state } = useSeoReport();
  const cityServicePages = locations.length * services.length;

  return (
    <AdminShell
      title="SEO & GEO"
      lead="Measured from the built site, not estimated. Figures refresh when you run pnpm build && pnpm audit:seo."
    >
      {state === "missing" && (
        <div className="flex items-start gap-3 rounded-lg border border-navy/15 bg-white px-4 py-3">
          <FileWarning className="mt-0.5 size-4 shrink-0 text-navy/50" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-navy/60">
            No audit report found. Run{" "}
            <code className="rounded bg-navy/8 px-1.5 py-0.5 text-xs">
              pnpm build &amp;&amp; pnpm audit:seo
            </code>{" "}
            to generate <code className="text-xs">seo-report.json</code>, then
            reload.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pages published"
          value={report?.pages ?? "—"}
          hint="Prerendered static HTML"
        />
        <StatCard
          label="Duplicate titles"
          value={report ? report.titles.duplicates : "—"}
          tone={report && report.titles.duplicates === 0 ? "good" : "bad"}
          hint={`${report?.titles.total ?? "—"} unique titles`}
        />
        <StatCard
          label="Duplicate descriptions"
          value={report ? report.descriptions.duplicates : "—"}
          tone={report && report.descriptions.duplicates === 0 ? "good" : "bad"}
        />
        <StatCard
          label="Audit problems"
          value={report ? report.problems.length : "—"}
          tone={report && report.problems.length === 0 ? "good" : "bad"}
          hint="Titles, descriptions, H1s, JSON-LD"
        />
      </div>

      {/* The plan, before the measurements. Somebody opening this page wants
          to know what we are going after before they want an audit score. */}
      <Panel
        title="Where this site actually stands"
        subtitle="The premise the whole organic plan is built on."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            ["Position", seoPremise.position],
            ["What follows from it", seoPremise.consequence],
            ["How it produces leads", seoPremise.leadLever],
          ].map(([k, v]) => (
            <div key={k} className="min-w-0">
              <Micro>{k}</Micro>
              <p className="mt-2 text-[0.82rem] leading-relaxed text-navy/70">{v}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        title="What we are targeting"
        subtitle="Grouped by when it is realistically winnable from where the domain stands today, not by guessed search volume — we have no volume data yet and inventing it would make this look more rigorous than it is."
      >
        {(["Now", "Quarter", "Year"] as Tier[]).map((tier) => {
          const rows = targets.filter((t) => t.tier === tier);
          if (!rows.length) return null;
          return (
            <div key={tier} className="mt-6 first:mt-0">
              <Micro>
                {tier === "Now"
                  ? "Winnable now — thin competition, pages already built"
                  : tier === "Quarter"
                    ? "This quarter — needs the pages to age and a few links"
                    : "A year out — paid covers these until then"}
              </Micro>
              <ul className="mt-3 space-y-2">
                {rows.map((t) => (
                  <li
                    key={t.term}
                    className="min-w-0 rounded-xl bg-navy/[0.025] p-3.5 ring-1 ring-inset ring-navy/8"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <p className="font-mono text-[0.82rem] font-semibold text-navy">
                        {t.term}
                      </p>
                      <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-[0.62rem] font-bold text-navy/55 ring-1 ring-navy/12">
                        {t.intent}
                      </span>
                    </div>
                    <p className="mt-1.5 font-mono text-[0.68rem] text-blue">{t.page}</p>
                    <p className="mt-1.5 text-[0.78rem] leading-relaxed text-navy/60">
                      {t.why}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </Panel>

      <Panel
        title="What actually moves leads"
        subtitle="Ordered by effect on booked jobs, not by effort. The first three are worth more than everything below them put together."
      >
        <ol className="space-y-3">
          {leadLevers.map((l, i) => (
            <li key={l.lever} className="flex gap-3.5">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-blue/10 font-mono text-[0.62rem] font-bold text-blue">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-display text-[0.9rem] font-extrabold text-navy">
                    {l.lever}
                  </span>
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-navy/40">
                    {l.owner}
                  </span>
                </p>
                <p className="mt-1 text-[0.8rem] leading-relaxed text-navy/60">{l.effect}</p>
              </div>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel
        title="Answer engines"
        subtitle="Being the source that gets quoted, rather than the tenth blue link. For a local trade this is no longer a side bet."
      >
        <ul className="grid gap-2.5 md:grid-cols-2">
          {geoWork.map((g) => (
            <li
              key={g.item}
              className={cn(
                "min-w-0 rounded-xl p-3.5 ring-1 ring-inset",
                g.state === "done"
                  ? "bg-emerald-500/6 ring-emerald-500/20"
                  : "bg-gold/8 ring-gold/35",
              )}
            >
              <p className="flex items-start gap-2 text-[0.82rem] font-semibold text-navy">
                <span
                  className={cn(
                    "mt-1.5 size-1.5 shrink-0 rounded-full",
                    g.state === "done" ? "bg-emerald-500" : "bg-gold",
                  )}
                  aria-hidden="true"
                />
                {g.item}
              </p>
              <p className="mt-1 pl-3.5 text-[0.76rem] leading-relaxed text-navy/60">
                {g.detail}
              </p>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel
        title="Content uniqueness"
        subtitle="Mean pairwise similarity within each generated page set, measured on main content with nav and footer stripped. Anything above 60% risks being treated as duplicate."
        action={
          report && (
            <span className="inline-flex items-center gap-1.5 text-xs text-navy/50">
              <RefreshCw className="size-3" aria-hidden="true" />
              {new Date(report.generatedAt).toLocaleString()}
            </span>
          )
        }
      >
        {report ? (
          <Table columns={["Page set", "Pages", "Mean", "Max", "Over 60%", "Median words"]}>
            {Object.entries(report.similarity).map(([label, s]) => (
              <tr key={label}>
                <Td className="font-medium text-navy">{label}</Td>
                <Td muted>{s.pages}</Td>
                <Td>{pct(s.meanSimilarity)}</Td>
                <Td>{pct(s.maxSimilarity)}</Td>
                <Td>
                  <span
                    className={
                      s.pairsOverThreshold === 0
                        ? "font-semibold text-emerald-600"
                        : "font-semibold text-rose-600"
                    }
                  >
                    {s.pairsOverThreshold}
                  </span>
                </Td>
                <Td muted>{s.medianWords}</Td>
              </tr>
            ))}
          </Table>
        ) : (
          <p className="text-sm text-navy/50">Waiting on the audit report…</p>
        )}
      </Panel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel
          title="Structured data"
          subtitle="What every page emits, and what it deliberately does not."
        >
          <ul className="space-y-2.5 text-sm">
            {[
              "One linked @graph per page, not separate blocks",
              "HVACBusiness with geo, a 50-mile GeoCircle and every city geocoded",
              "hasOfferCatalog across all six services",
              "hasCredential for all three DBPR licences",
              "Service nodes with areaServed contained in their county",
              "FAQPage on every service, city and service × city page",
              "speakable pointed at h1 and [data-answer] for answer engines",
            ].map((t) => (
              <li key={t} className="flex gap-2.5 text-navy/75">
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-emerald-600"
                  aria-hidden="true"
                />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3.5">
            <p className="text-xs leading-relaxed text-amber-900">
              <strong className="font-semibold">No aggregateRating.</strong> The
              client publishes no verified review count, and inventing a star
              rating is a Google policy violation. Fill{" "}
              <code className="text-[0.7rem]">googleReviews</code> in{" "}
              <code className="text-[0.7rem]">content/site.ts</code> and the
              stars, the count and the markup all switch on together.
            </p>
          </div>
        </Panel>

        <Panel
          title="Answer-engine surface"
          subtitle="What the site gives GPT, Claude, Perplexity and AI Overviews to work with."
        >
          <ul className="space-y-2.5 text-sm">
            {[
              "llms.txt generated at build time from the content file",
              "robots.txt names GPTBot, ClaudeBot, PerplexityBot, Google-Extended and others explicitly",
              "Every substantial page opens with a self-contained [data-answer] block",
              "City pages render local facts as a real table, not styled divs",
              "Descriptions clamped to 158 chars on a word boundary",
            ].map((t) => (
              <li key={t} className="flex gap-2.5 text-navy/75">
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-emerald-600"
                  aria-hidden="true"
                />
                {t}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        title="Page inventory"
        subtitle="What is published, and which template generates it."
      >
        <Table columns={["Page set", "Count", "Generated from", "Layout"]}>
          <tr>
            <Td className="font-medium text-navy">Service × city</Td>
            <Td>{cityServicePages}</Td>
            <Td muted>{locations.length} cities × {services.length} services</Td>
            <Td muted>Narrow reading column, answer first</Td>
          </tr>
          <tr>
            <Td className="font-medium text-navy">City landing</Td>
            <Td>{locations.length}</Td>
            <Td muted>content/site.ts locations</Td>
            <Td muted>Wide service matrix + fact table</Td>
          </tr>
          <tr>
            <Td className="font-medium text-navy">Service</Td>
            <Td>{services.length}</Td>
            <Td muted>content/site.ts services</Td>
            <Td muted>One layout per service detail.kind</Td>
          </tr>
          <tr>
            <Td className="font-medium text-navy">Company & legal</Td>
            <Td>7</Td>
            <Td muted>Home, about, financing, contact, indexes, legal</Td>
            <Td muted>Bespoke</Td>
          </tr>
        </Table>
      </Panel>

      <Panel
        title="Keyword targets"
        subtitle={`Template terms expanded across ${locations.length} cities. {city} and {county} substitute per page.`}
      >
        <Table columns={["Term", "Intent", "Priority", "Target page"]}>
          {keywordTargets.map((k) => (
            <tr key={k.term}>
              <Td className="font-medium text-navy">{k.term}</Td>
              <Td muted>{k.intent}</Td>
              <Td>
                <span
                  className={
                    k.priority === "P0"
                      ? "font-semibold text-rose-600"
                      : k.priority === "P1"
                        ? "font-semibold text-amber-600"
                        : "text-navy/50"
                  }
                >
                  {k.priority}
                </span>
              </Td>
              <Td muted className="font-mono text-xs">
                {k.page}
              </Td>
            </tr>
          ))}
        </Table>
      </Panel>

      {report && report.problems.length > 0 && (
        <Panel title="Open problems" subtitle="From the most recent audit run.">
          <ul className="space-y-1.5 text-sm text-rose-700">
            {report.problems.slice(0, 20).map((p) => (
              <li key={p}>• {p}</li>
            ))}
          </ul>
        </Panel>
      )}

      <p className="text-xs text-navy/50">
        NAP of record: {business.name} · {business.street}, {business.city},{" "}
        {business.state} {business.zip} · {business.phone}. Keep this identical
        everywhere it appears online.
      </p>
    </AdminShell>
  );
}
