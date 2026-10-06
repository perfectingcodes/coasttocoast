import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Download,
  MessageSquarePlus,
  Phone,
  Plus,
  Trash2,
  TriangleAlert,
  UserPlus,
} from "lucide-react";
import { business, locations, services } from "@/content/site";
import { AdminShell } from "@/components/admin/shell";
import { Panel, StatCard } from "@/components/admin/ui";
import {
  EVENT_LABELS,
  STAGES,
  addNote,
  ago,
  captureLead,
  clearCrm,
  deleteLead,
  exportCrm,
  isConnected,
  traction,
  updateLead,
  useCrm,
  type Lead,
  type Stage,
} from "@/lib/leads";
import { cn } from "@/lib/utils";

/**
 * Leads & CRM.
 *
 * Every number on this page is read from the browser it is open in. That is
 * not a design choice, it is the only option a static site has — and the
 * banner at the top says so in those words rather than letting a client
 * assume the office is looking at a shared inbox. See lib/leads.ts.
 */

const STAGE_STYLE: Record<Stage, { pill: string; dot: string; bar: string }> = {
  new: { pill: "bg-blue/10 text-blue", dot: "bg-blue", bar: "bg-blue" },
  contacted: { pill: "bg-cyan/15 text-sky-700", dot: "bg-cyan", bar: "bg-cyan" },
  quoted: { pill: "bg-gold/20 text-amber-700", dot: "bg-gold", bar: "bg-gold" },
  won: { pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500", bar: "bg-emerald-500" },
  lost: { pill: "bg-slate-100 text-slate-500", dot: "bg-slate-400", bar: "bg-slate-300" },
};

function StagePill({ stage }: { stage: Stage }) {
  const s = STAGES.find((x) => x.id === stage)!;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold",
        STAGE_STYLE[stage].pill,
      )}
    >
      <span className={cn("size-1.5 rounded-full", STAGE_STYLE[stage].dot)} aria-hidden="true" />
      {s.label}
    </span>
  );
}

export default function AdminLeads() {
  const crm = useCrm();
  const [filter, setFilter] = useState<Stage | "all">("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const t = useMemo(() => traction(crm.events), [crm.events]);
  const open = crm.leads.filter((l) => l.stage !== "won" && l.stage !== "lost");
  const shown =
    filter === "all" ? crm.leads : crm.leads.filter((l) => l.stage === filter);
  const lead = crm.leads.find((l) => l.id === selected) ?? null;
  const peakDay = Math.max(1, ...t.byDay.map((d) => d.count));

  function download() {
    const blob = new Blob([exportCrm()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `coast-to-coast-crm-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminShell
      title="Leads & CRM"
      lead="Every enquiry the website captures, the stage each one is at, and what visitors did before they got in touch."
    >
      {/* The single most important thing on this page. It is not a footnote. */}
      <div className="overflow-hidden rounded-2xl border border-amber-300 bg-amber-50">
        <div className="flex gap-3 px-5 py-4">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-700" aria-hidden="true" />
          <div className="min-w-0">
            <p className="font-display text-sm font-bold text-amber-950">
              This CRM holds data on this device only
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-amber-900/90">
              The site is a static build with no server and no database, so
              there is nowhere to put a lead except the browser it was created
              in. A homeowner who fills in the quote form writes a record into{" "}
              <em>their</em> browser — it will never appear here. What you see
              below is this machine, and clearing site data erases it with no
              backup.{" "}
              <strong className="font-semibold">
                The emailed quote request is still the real lead path.
              </strong>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-amber-900/90">
              Everything is already wired for the day that changes: set{" "}
              <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[0.68rem]">
                VITE_LEADS_ENDPOINT
              </code>{" "}
              to a URL that accepts a JSON POST and every lead and event below
              is forwarded to it, unchanged.{" "}
              {isConnected ? (
                <strong className="font-semibold text-emerald-800">
                  An endpoint is configured — records are being forwarded.
                </strong>
              ) : (
                <strong className="font-semibold">
                  No endpoint is configured right now.
                </strong>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Leads captured"
          value={crm.leads.length}
          icon={<UserPlus className="size-4" />}
          hint="On this device, all time"
        />
        <StatCard
          label="Still open"
          value={open.length}
          tone={open.length ? "warn" : "default"}
          icon={<MessageSquarePlus className="size-4" />}
          hint="Not yet won or lost"
        />
        <StatCard
          label="Page views"
          value={t.views}
          icon={<ArrowUpRight className="size-4" />}
          hint="Last 14 days, this browser"
        />
        <StatCard
          label="Phone taps"
          value={t.calls}
          tone={t.calls ? "good" : "default"}
          icon={<Phone className="size-4" />}
          hint="Clicks on the number"
        />
      </div>

      {/* --------------------------------------------------------- pipeline */}
      <Panel
        title="Pipeline"
        subtitle="Click a stage to filter the list below."
        action={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAdding((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full bg-blue px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue/90"
            >
              <Plus className="size-3.5" aria-hidden="true" />
              Log a lead
            </button>
            <button
              type="button"
              onClick={download}
              disabled={!crm.leads.length && !crm.events.length}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-300 transition-colors hover:bg-slate-100 disabled:opacity-40"
            >
              <Download className="size-3.5" aria-hidden="true" />
              Export
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {STAGES.map((s) => {
            const n = crm.leads.filter((l) => l.stage === s.id).length;
            const active = filter === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setFilter(active ? "all" : s.id)}
                aria-pressed={active}
                className={cn(
                  "min-w-0 rounded-xl p-3.5 text-left ring-1 transition-colors",
                  active
                    ? "bg-blue/5 ring-blue/40"
                    : "bg-slate-50/70 ring-slate-200 hover:bg-slate-100",
                )}
              >
                <span
                  className={cn("block h-1 w-8 rounded-full", STAGE_STYLE[s.id].bar)}
                  aria-hidden="true"
                />
                <span className="mt-2.5 block font-display text-2xl font-extrabold leading-none tabular-nums text-slate-900">
                  {n}
                </span>
                <span className="mt-1 block text-xs font-semibold text-slate-700">
                  {s.label}
                </span>
                <span className="mt-0.5 block text-[0.68rem] leading-snug text-slate-400">
                  {s.blurb}
                </span>
              </button>
            );
          })}
        </div>

        {adding && (
          <ManualLead
            onDone={() => setAdding(false)}
          />
        )}
      </Panel>

      {/* ------------------------------------------------------------ list */}
      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <Panel
          title={filter === "all" ? "All leads" : `${STAGES.find((s) => s.id === filter)!.label} leads`}
          subtitle={
            crm.leads.length
              ? `${shown.length} of ${crm.leads.length} shown. Select one to work it.`
              : undefined
          }
        >
          {shown.length === 0 ? (
            <EmptyLeads hasAny={crm.leads.length > 0} onAdd={() => setAdding(true)} />
          ) : (
            <ul className="space-y-2.5">
              {shown.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(l.id === selected ? null : l.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl p-3.5 text-left ring-1 transition-colors",
                      l.id === selected
                        ? "bg-blue/5 ring-blue/40"
                        : "bg-white ring-slate-200 hover:bg-slate-50",
                    )}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 font-display text-xs font-extrabold text-slate-500">
                      {initials(l.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <span className="text-sm font-semibold text-slate-900">
                          {l.name}
                        </span>
                        <StagePill stage={l.stage} />
                        {l.source !== "website" && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wide text-slate-500">
                            {l.source}
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {[l.service, l.city].filter(Boolean).join(" · ") ||
                          "No service or city given"}
                      </span>
                      <span className="mt-1.5 block font-mono text-[0.62rem] uppercase tracking-[0.08em] text-slate-400">
                        {origin(l)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="min-w-0 xl:sticky xl:top-6 xl:self-start">
          {lead ? (
            <LeadDetail key={lead.id} lead={lead} onClose={() => setSelected(null)} />
          ) : (
            <Panel title="Lead detail" className="hidden xl:block">
              <p className="text-xs leading-relaxed text-slate-500">
                Select a lead to see the full request, change its stage and
                keep a call log against it.
              </p>
            </Panel>
          )}
        </div>
      </div>

      {/* -------------------------------------------------------- traction */}
      <Panel
        title="Website traction"
        subtitle="What happened on the site in the last 14 days — again, from this browser only."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["Views", t.views],
            ["Phone taps", t.calls],
            ["Quote forms reached", t.quoteOpens],
            ["Quote requests sent", t.quoteSubmits],
          ].map(([label, n]) => (
            <div key={label as string} className="min-w-0">
              <p className="font-display text-xl font-extrabold tabular-nums text-slate-900">
                {n as number}
              </p>
              <p className="mt-0.5 text-[0.7rem] font-medium leading-snug text-slate-500">
                {label as string}
              </p>
            </div>
          ))}
        </div>

        {/* Each day gets a visible track, not just a bar. Fourteen 2px stubs
            under one tall bar reads as a broken chart rather than a quiet
            fortnight. */}
        <div className="mt-6 flex h-24 items-end gap-1">
          {t.byDay.map((d) => (
            <div
              key={d.day}
              title={`${d.day}: ${d.count} event${d.count === 1 ? "" : "s"}`}
              className="flex h-full min-w-0 flex-1 items-end overflow-hidden rounded-sm bg-slate-100"
            >
              <div
                className="w-full rounded-sm bg-blue"
                style={{ height: `${(d.count / peakDay) * 100}%` }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
        <p className="mt-1.5 flex justify-between font-mono text-[0.6rem] uppercase tracking-[0.08em] text-slate-400">
          <span>{t.byDay[0]?.day}</span>
          <span>Today</span>
        </p>

        <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="min-w-0">
            <p className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-slate-400">
              Most viewed pages
            </p>
            {t.topPages.length ? (
              <ul className="mt-3 space-y-1.5">
                {t.topPages.map((p) => (
                  <li
                    key={p.path}
                    className="flex items-center gap-3 border-b border-slate-100 pb-1.5 text-xs last:border-0"
                  >
                    <span className="min-w-0 flex-1 truncate font-mono text-slate-600">
                      {p.path}
                    </span>
                    <span className="shrink-0 tabular-nums font-semibold text-slate-900">
                      {p.count}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-slate-400">
                Nothing recorded yet. Open the public site in this browser and
                these fill in.
              </p>
            )}
          </div>

          <div className="min-w-0">
            <p className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-slate-400">
              Recent activity
            </p>
            {crm.events.length ? (
              <ol className="mt-3 space-y-2.5">
                {crm.events.slice(0, 8).map((e) => (
                  <li key={e.id} className="flex gap-2.5 text-xs">
                    <span
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan"
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span className="text-slate-700">{EVENT_LABELS[e.kind]}</span>
                      {e.label && (
                        <span className="text-slate-400"> — {e.label}</span>
                      )}
                      <span className="mt-0.5 block font-mono text-[0.6rem] uppercase tracking-[0.08em] text-slate-400">
                        {ago(e.at)} · {e.path}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 text-xs text-slate-400">No activity recorded yet.</p>
            )}
          </div>
        </div>

        {crm.visitor && (
          <dl className="mt-7 grid gap-x-8 gap-y-2 border-t border-slate-100 pt-5 text-xs sm:grid-cols-3">
            {[
              ["This browser first seen", new Date(crm.visitor.first).toLocaleDateString()],
              ["Sessions", String(crm.visitor.visits)],
              ["Arrived from", crm.visitor.referrer || "Typed or bookmarked"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-slate-400">{k}</dt>
                <dd className="mt-0.5 truncate font-medium text-slate-700">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        {(crm.leads.length > 0 || crm.events.length > 0) && (
          <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => {
                if (confirm("Erase every lead, note and event stored in this browser? This cannot be undone.")) {
                  clearCrm();
                  setSelected(null);
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-ember"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
              Erase everything stored here
            </button>
          </div>
        )}
      </Panel>
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ parts */

/** Where a lead came from, said in words rather than a bare path. */
function origin(lead: Lead) {
  return lead.source === "website"
    ? `${ago(lead.at)} · from ${lead.path}`
    : `${ago(lead.at)} · logged by hand`;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function EmptyLeads({ hasAny, onAdd }: { hasAny: boolean; onAdd: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 text-center">
      <p className="font-display text-sm font-bold text-slate-900">
        {hasAny ? "No leads at this stage" : "No leads captured in this browser"}
      </p>
      <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-500">
        {hasAny
          ? "Clear the stage filter above to see the rest."
          : `This is expected and is not a fault. Quote requests are emailed to ${business.email} and are recorded in the visitor's own browser, not here. Use this pipeline for calls you take yourself.`}
      </p>
      {!hasAny && (
        <button
          type="button"
          onClick={onAdd}
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-blue px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue/90"
        >
          <Phone className="size-3.5" aria-hidden="true" />
          Log a phone lead
        </button>
      )}
    </div>
  );
}

function ManualLead({ onDone }: { onDone: () => void }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = Object.fromEntries(
          new FormData(e.currentTarget),
        ) as Record<string, string>;
        if (!data.name?.trim() && !data.phone?.trim()) return;
        captureLead({ ...data, source: "phone", path: "logged by hand" });
        onDone();
      }}
      className="mt-5 rounded-xl bg-slate-50 p-5 ring-1 ring-slate-200"
    >
      <p className="font-display text-sm font-bold text-slate-900">
        Log a lead you took by phone
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Saved in this browser so it can be worked through the pipeline.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field name="name" label="Name" required />
        <Field name="phone" label="Phone" type="tel" />
        <Field name="email" label="Email" type="email" />
        <Pick name="city" label="City" options={locations.map((l) => l.city)} />
        <Pick
          name="service"
          label="What they need"
          options={services.map((s) => s.name)}
          className="sm:col-span-2"
        />
        <label className="sm:col-span-2">
          <span className="text-xs font-semibold text-slate-600">Notes</span>
          <textarea
            name="message"
            rows={2}
            className="mt-1 w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-blue"
          />
        </label>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="rounded-full bg-blue px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue/90"
        >
          Save lead
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-full px-4 py-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-300 transition-colors hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="min-w-0">
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-blue"
      />
    </label>
  );
}

function Pick({
  name,
  label,
  options,
  className,
}: {
  name: string;
  label: string;
  options: string[];
  className?: string;
}) {
  return (
    <label className={cn("min-w-0", className)}>
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      <select
        name={name}
        className="mt-1 w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-blue"
      >
        <option value="">—</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function LeadDetail({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const [note, setNote] = useState("");

  return (
    <Panel
      title={lead.name}
      subtitle={origin(lead)}
      action={
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold text-slate-400 hover:text-slate-700"
        >
          Close
        </button>
      }
    >
      <label className="block">
        <span className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-slate-400">
          Stage
        </span>
        <select
          value={lead.stage}
          onChange={(e) => updateLead(lead.id, { stage: e.target.value as Stage })}
          className="mt-1.5 w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-blue"
        >
          {STAGES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label} — {s.blurb}
            </option>
          ))}
        </select>
      </label>

      <dl className="mt-5 border-t border-slate-100 pt-4 text-xs">
        {[
          ["Phone", lead.phone],
          ["Email", lead.email],
          ["City", lead.city],
          ["Service", lead.service],
        ]
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k} className="flex gap-3 border-b border-slate-100 py-2 last:border-0">
              <dt className="w-16 shrink-0 text-slate-400">{k}</dt>
              <dd className="min-w-0 flex-1 break-words font-medium text-slate-800">
                {k === "Phone" ? (
                  <a href={`tel:${v}`} className="text-blue hover:underline">
                    {v}
                  </a>
                ) : k === "Email" ? (
                  <a href={`mailto:${v}`} className="text-blue hover:underline">
                    {v}
                  </a>
                ) : (
                  v
                )}
              </dd>
            </div>
          ))}
      </dl>

      {lead.message && (
        <blockquote className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
          {lead.message}
        </blockquote>
      )}

      <p className="mt-6 font-display text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-slate-400">
        Call log
      </p>
      {lead.notes.length > 0 && (
        <ol className="mt-3 space-y-2.5">
          {lead.notes.map((n) => (
            <li key={n.at} className="border-l-2 border-cyan pl-3">
              <p className="text-xs leading-relaxed text-slate-700">{n.text}</p>
              <p className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-slate-400">
                {ago(n.at)}
              </p>
            </li>
          ))}
        </ol>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addNote(lead.id, note);
          setNote("");
        }}
        className="mt-3"
      >
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Left a voicemail, calling back Thursday…"
          className="w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-xs text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-blue"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <button
            type="submit"
            disabled={!note.trim()}
            className="rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-30"
          >
            Add note
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete the lead for ${lead.name}?`)) {
                deleteLead(lead.id);
                onClose();
              }
            }}
            className="text-xs font-semibold text-slate-400 transition-colors hover:text-ember"
          >
            Delete
          </button>
        </div>
      </form>
    </Panel>
  );
}
