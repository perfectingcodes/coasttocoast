import { useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Download,
  MessageSquarePlus,
  Phone,
  Plus,
  Trash2,
  ShieldCheck,
  Upload,
  UserPlus,
} from "lucide-react";
import { locations, services } from "@/content/site";
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
  useCrmSyncState,
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
 * The page hydrates from PostgreSQL and retains a local cache for recovery.
 */

const STAGE_STYLE: Record<Stage, { pill: string; dot: string; bar: string }> = {
  new: { pill: "bg-blue/10 text-blue", dot: "bg-blue", bar: "bg-blue" },
  contacted: { pill: "bg-cyan/15 text-sky-700", dot: "bg-cyan", bar: "bg-cyan" },
  quoted: { pill: "bg-gold/20 text-amber-700", dot: "bg-gold", bar: "bg-gold" },
  won: { pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500", bar: "bg-emerald-500" },
  lost: { pill: "bg-navy/8 text-navy/50", dot: "bg-navy/35", bar: "bg-navy/25" },
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
  const syncState = useCrmSyncState();
  const [filter, setFilter] = useState<Stage | "all">("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const importInput = useRef<HTMLInputElement>(null);

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

  async function importBackup(file?: File) {
    if (!file) return;
    try {
      const backup = JSON.parse(await file.text());
      if (!Array.isArray(backup.leads) || !Array.isArray(backup.events)) {
        throw new Error("That file is not a CRM JSON backup.");
      }
      const response = await fetch("/api/crm/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: backup.leads, events: backup.events }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Import failed.");
      window.location.reload();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Could not import this backup.");
    } finally {
      if (importInput.current) importInput.current.value = "";
    }
  }

  return (
    <AdminShell
      title="Leads & CRM"
      lead="Every enquiry the website captures, the stage each one is at, and what visitors did before they got in touch."
    >
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-inset ring-navy/10">
        <div className="flex gap-3 px-5 py-4">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-700" aria-hidden="true" />
          <div className="min-w-0">
            <p className="font-display text-sm font-bold text-navy">
              Leads are stored in the shared CRM database
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-navy/60">
              Website enquiries save centrally. The browser also keeps a cache and retries queued changes after a connection returns. Export a JSON backup periodically.
            </p>
          </div>
          <span className={cn("ml-auto h-fit shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase", syncState === "saved" ? "bg-emerald-50 text-emerald-700" : syncState === "syncing" ? "bg-blue/10 text-blue" : "bg-amber-100 text-amber-800")}>
            {syncState === "saved" ? "Synced" : syncState === "syncing" ? "Syncing" : "Offline"}
          </span>
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
            <input
              ref={importInput}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(event) => void importBackup(event.currentTarget.files?.[0])}
            />
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
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-navy/60 ring-1 ring-navy/15 transition-colors hover:bg-navy/6 disabled:opacity-40"
            >
              <Download className="size-3.5" aria-hidden="true" />
              Export
            </button>
            <button
              type="button"
              onClick={() => importInput.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-navy/60 ring-1 ring-navy/15 transition-colors hover:bg-navy/6"
            >
              <Upload className="size-3.5" aria-hidden="true" />
              Import
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
                    : "bg-navy/[0.025] ring-navy/10 hover:bg-navy/6",
                )}
              >
                <span
                  className={cn("block h-1 w-8 rounded-full", STAGE_STYLE[s.id].bar)}
                  aria-hidden="true"
                />
                <span className="mt-2.5 block font-display text-2xl font-extrabold leading-none tabular-nums text-navy">
                  {n}
                </span>
                <span className="mt-1 block text-xs font-semibold text-navy/75">
                  {s.label}
                </span>
                <span className="mt-0.5 block text-[0.68rem] leading-snug text-navy/40">
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
                        : "bg-white ring-navy/10 hover:bg-navy/[0.03]",
                    )}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy/8 font-display text-xs font-extrabold text-navy/50">
                      {initials(l.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <span className="text-sm font-semibold text-navy">
                          {l.name}
                        </span>
                        <StagePill stage={l.stage} />
                        {l.source !== "website" && (
                          <span className="rounded-full bg-navy/8 px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wide text-navy/50">
                            {l.source}
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-xs text-navy/50">
                        {[l.service, l.city].filter(Boolean).join(" · ") ||
                          "No service or city given"}
                      </span>
                      <span className="mt-1.5 block font-mono text-[0.62rem] uppercase tracking-[0.08em] text-navy/40">
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
              <p className="text-xs leading-relaxed text-navy/50">
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
              <p className="font-display text-xl font-extrabold tabular-nums text-navy">
                {n as number}
              </p>
              <p className="mt-0.5 text-[0.7rem] font-medium leading-snug text-navy/50">
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
              className="flex h-full min-w-0 flex-1 items-end overflow-hidden rounded-sm bg-navy/8"
            >
              <div
                className="w-full rounded-sm bg-blue"
                style={{ height: `${(d.count / peakDay) * 100}%` }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
        <p className="mt-1.5 flex justify-between font-mono text-[0.6rem] uppercase tracking-[0.08em] text-navy/40">
          <span>{t.byDay[0]?.day}</span>
          <span>Today</span>
        </p>

        <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="min-w-0">
            <p className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-navy/40">
              Most viewed pages
            </p>
            {t.topPages.length ? (
              <ul className="mt-3 space-y-1.5">
                {t.topPages.map((p) => (
                  <li
                    key={p.path}
                    className="flex items-center gap-3 border-b border-navy/8 pb-1.5 text-xs last:border-0"
                  >
                    <span className="min-w-0 flex-1 truncate font-mono text-navy/60">
                      {p.path}
                    </span>
                    <span className="shrink-0 tabular-nums font-semibold text-navy">
                      {p.count}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-navy/40">
                Nothing recorded yet. Open the public site in this browser and
                these fill in.
              </p>
            )}
          </div>

          <div className="min-w-0">
            <p className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-navy/40">
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
                      <span className="text-navy/75">{EVENT_LABELS[e.kind]}</span>
                      {e.label && (
                        <span className="text-navy/40"> — {e.label}</span>
                      )}
                      <span className="mt-0.5 block font-mono text-[0.6rem] uppercase tracking-[0.08em] text-navy/40">
                        {ago(e.at)} · {e.path}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 text-xs text-navy/40">No activity recorded yet.</p>
            )}
          </div>
        </div>

        {crm.visitor && (
          <dl className="mt-7 grid gap-x-8 gap-y-2 border-t border-navy/8 pt-5 text-xs sm:grid-cols-3">
            {[
              ["This browser first seen", new Date(crm.visitor.first).toLocaleDateString()],
              ["Sessions", String(crm.visitor.visits)],
              ["Arrived from", crm.visitor.referrer || "Typed or bookmarked"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-navy/40">{k}</dt>
                <dd className="mt-0.5 truncate font-medium text-navy/75">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        {(crm.leads.length > 0 || crm.events.length > 0) && (
          <div className="mt-6 flex justify-end border-t border-navy/8 pt-4">
            <button
              type="button"
              onClick={() => {
                if (confirm("Clear this device's cached copy? The shared CRM database will keep all records.")) {
                  clearCrm();
                  setSelected(null);
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy/40 transition-colors hover:text-ember"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
              Clear local cache
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
    <div className="rounded-xl border border-dashed border-navy/15 bg-navy/[0.02] px-6 py-10 text-center">
      <p className="font-display text-sm font-bold text-navy">
        {hasAny ? "No leads at this stage" : "No leads captured yet"}
      </p>
      <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-navy/50">
        {hasAny
          ? "Clear the stage filter above to see the rest."
          : "Website enquiries and phone leads are saved to the shared CRM. New enquiries appear here after they are received."}
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
      className="mt-5 rounded-xl bg-navy/[0.035] p-5 ring-1 ring-navy/10"
    >
      <p className="font-display text-sm font-bold text-navy">
        Log a lead you took by phone
      </p>
      <p className="mt-1 text-xs text-navy/50">
        Saved to the shared CRM so the team can work it through the pipeline.
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
          <span className="text-xs font-semibold text-navy/60">Notes</span>
          <textarea
            name="message"
            rows={2}
            className="mt-1 w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-navy ring-1 ring-inset ring-navy/10 focus:ring-2 focus:ring-blue"
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
          className="rounded-full px-4 py-2 text-xs font-semibold text-navy/60 ring-1 ring-navy/15 transition-colors hover:bg-navy/6"
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
      <span className="text-xs font-semibold text-navy/60">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-navy ring-1 ring-inset ring-navy/10 focus:ring-2 focus:ring-blue"
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
      <span className="text-xs font-semibold text-navy/60">{label}</span>
      <select
        name={name}
        className="mt-1 w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-navy ring-1 ring-inset ring-navy/10 focus:ring-2 focus:ring-blue"
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
          className="text-xs font-semibold text-navy/40 hover:text-navy/75"
        >
          Close
        </button>
      }
    >
      <label className="block">
        <span className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-navy/40">
          Stage
        </span>
        <select
          value={lead.stage}
          onChange={(e) => updateLead(lead.id, { stage: e.target.value as Stage })}
          className="mt-1.5 w-full rounded-lg border-0 bg-navy/[0.035] px-3 py-2 text-sm font-medium text-navy/85 ring-1 ring-inset ring-navy/10 focus:ring-2 focus:ring-blue"
        >
          {STAGES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label} — {s.blurb}
            </option>
          ))}
        </select>
      </label>

      <dl className="mt-5 border-t border-navy/8 pt-4 text-xs">
        {[
          ["Phone", lead.phone],
          ["Email", lead.email],
          ["City", lead.city],
          ["Service", lead.service],
        ]
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k} className="flex gap-3 border-b border-navy/8 py-2 last:border-0">
              <dt className="w-16 shrink-0 text-navy/40">{k}</dt>
              <dd className="min-w-0 flex-1 break-words font-medium text-navy/85">
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
        <blockquote className="mt-4 rounded-lg bg-navy/[0.035] p-3 text-xs leading-relaxed text-navy/75">
          {lead.message}
        </blockquote>
      )}

      <p className="mt-6 font-display text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-navy/40">
        Call log
      </p>
      {lead.notes.length > 0 && (
        <ol className="mt-3 space-y-2.5">
          {lead.notes.map((n) => (
            <li key={n.at} className="border-l-2 border-cyan pl-3">
              <p className="text-xs leading-relaxed text-navy/75">{n.text}</p>
              <p className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-navy/40">
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
          className="w-full rounded-lg border-0 bg-navy/[0.035] px-3 py-2 text-xs text-navy ring-1 ring-inset ring-navy/10 placeholder:text-navy/40 focus:ring-2 focus:ring-blue"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <button
            type="submit"
            disabled={!note.trim()}
            className="rounded-full bg-navy px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-navy-soft disabled:opacity-30"
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
            className="text-xs font-semibold text-navy/40 transition-colors hover:text-ember"
          >
            Delete
          </button>
        </div>
      </form>
    </Panel>
  );
}

/**
 * Shown when leads exist and nothing is forwarding them off this device.
 *
 * The CRM banner below explains the architecture. This says the thing that
 * actually matters today: there are N records here, they exist nowhere else,
 * and clearing site data destroys them. One button fixes it.
 */
