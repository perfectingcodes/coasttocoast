import { useEffect, useState } from "react";
import { CheckCircle2, FileWarning, RefreshCw } from "lucide-react";
import { business, locations, services } from "@/content/site";
import { keywordTargets } from "@/content/marketing";
import { AdminShell } from "@/components/admin/shell";
import { Panel, StatCard, Table, Td } from "@/components/admin/ui";

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
        <div className="flex items-start gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3">
          <FileWarning className="mt-0.5 size-4 shrink-0 text-slate-500" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-slate-600">
            No audit report found. Run{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
              pnpm build &amp;&amp; pnpm audit:seo
            </code>{" "}
            to generate <code className="text-xs">seo-report.json</code>, then
            reload.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      <Panel
        title="Content uniqueness"
        subtitle="Mean pairwise similarity within each generated page set, measured on main content with nav and footer stripped. Anything above 60% risks being treated as duplicate."
        action={
          report && (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
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
                <Td className="font-medium text-slate-900">{label}</Td>
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
          <p className="text-sm text-slate-500">Waiting on the audit report…</p>
        )}
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
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
              <li key={t} className="flex gap-2.5 text-slate-700">
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
              <li key={t} className="flex gap-2.5 text-slate-700">
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
            <Td className="font-medium text-slate-900">Service × city</Td>
            <Td>{cityServicePages}</Td>
            <Td muted>{locations.length} cities × {services.length} services</Td>
            <Td muted>Narrow reading column, answer first</Td>
          </tr>
          <tr>
            <Td className="font-medium text-slate-900">City landing</Td>
            <Td>{locations.length}</Td>
            <Td muted>content/site.ts locations</Td>
            <Td muted>Wide service matrix + fact table</Td>
          </tr>
          <tr>
            <Td className="font-medium text-slate-900">Service</Td>
            <Td>{services.length}</Td>
            <Td muted>content/site.ts services</Td>
            <Td muted>One layout per service detail.kind</Td>
          </tr>
          <tr>
            <Td className="font-medium text-slate-900">Company & legal</Td>
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
              <Td className="font-medium text-slate-900">{k.term}</Td>
              <Td muted>{k.intent}</Td>
              <Td>
                <span
                  className={
                    k.priority === "P0"
                      ? "font-semibold text-rose-600"
                      : k.priority === "P1"
                        ? "font-semibold text-amber-600"
                        : "text-slate-500"
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

      <p className="text-xs text-slate-500">
        NAP of record: {business.name} · {business.street}, {business.city},{" "}
        {business.state} {business.zip} · {business.phone}. Keep this identical
        everywhere it appears online.
      </p>
    </AdminShell>
  );
}
