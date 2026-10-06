import { useState } from "react";
import { Link } from "wouter";
import {
  AtSign,
  Check,
  Copy,
  Handshake,
  MessageSquare,
  ShieldAlert,
  Star,
} from "lucide-react";
import {
  automationGaps,
  replyTemplates,
  reviewLink,
  reviewRules,
  reviewSequence,
  unhappyBranch,
  type Channel,
  type ReviewStep,
} from "@/content/reviews";
import { AdminShell } from "@/components/admin/shell";
import { NotConnected, Panel, StatCard } from "@/components/admin/ui";
import { ago, toggleReviewStep, useCrm, type Lead } from "@/lib/leads";
import { cn } from "@/lib/utils";

/**
 * Resources — the review request sequence and the copy that goes with it.
 *
 * The sequence is fully defined: trigger, timing, channel, wording and the
 * branch for an unhappy reply. What it cannot do on a static build is send
 * itself, and this page says that plainly rather than implying a cron job
 * exists somewhere. Mark a lead won in the CRM and the due dates below are
 * computed for you; sending is still a person pressing send.
 */

const CHANNEL: Record<Channel, { label: string; Icon: typeof AtSign; tint: string }> = {
  "in person": { label: "In person", Icon: Handshake, tint: "bg-gold/15 text-amber-700" },
  sms: { label: "SMS", Icon: MessageSquare, tint: "bg-cyan/15 text-sky-700" },
  email: { label: "Email", Icon: AtSign, tint: "bg-blue/10 text-blue" },
};

const DAY = 86_400_000;

export default function AdminResources() {
  const crm = useCrm();
  const won = crm.leads.filter((l) => l.stage === "won" && l.wonAt);

  const due = won.flatMap((lead) =>
    reviewSequence
      .filter((s) => s.id !== "stop" && s.by !== "Technician")
      .map((step) => ({ lead, step, at: lead.wonAt! + step.day * DAY }))
      .filter(({ at, step, lead: l }) => at <= Date.now() && !(l.reviewSteps ?? []).includes(step.id)),
  );

  return (
    <AdminShell
      title="Resources"
      lead="The review request sequence, the message copy that goes with it, and the rules that keep a Google profile out of trouble."
    >
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Steps in the sequence"
          value={reviewSequence.filter((s) => s.id !== "stop").length}
          icon={<Star className="size-4" />}
          hint="Ends at day 7, every time"
        />
        <StatCard
          label="Jobs won"
          value={won.length}
          icon={<Handshake className="size-4" />}
          hint="Marked won in the CRM"
        />
        <StatCard
          label="Requests due"
          value={due.length}
          tone={due.length ? "warn" : "default"}
          icon={<MessageSquare className="size-4" />}
          hint="Waiting to be sent by hand"
        />
        {/* No icon tile on this one: the value is a word, and the tile left
            it 72px to render in. */}
        <StatCard
          label="Review link"
          value={reviewLink.url ? "Ready" : "Not set"}
          tone={reviewLink.url ? "good" : "bad"}
          hint="Google profile must be claimed first"
        />
      </div>

      {/* What "automated" does and does not mean here. Stated before the
          sequence, not after it. */}
      <Panel
        title="What runs itself, and what does not"
        subtitle="The schedule is fixed. The sending is not — this build has no server, no SMS account and no job-completion feed."
      >
        <ul className="grid gap-3 md:grid-cols-2">
          {automationGaps.map((g) => (
            <li key={g.what} className="rounded-xl bg-slate-50 p-4">
              <p className="flex items-start gap-2 text-sm font-semibold text-slate-900">
                <ShieldAlert
                  className="mt-0.5 size-3.5 shrink-0 text-amber-600"
                  aria-hidden="true"
                />
                {g.what}
              </p>
              <p className="mt-1.5 pl-5 text-xs leading-relaxed text-slate-600">
                {g.needs}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Until those exist this page does the half a dashboard can honestly
          do: it works out who is due, today, from the jobs marked won in the{" "}
          <Link href="/admin/leads" className="font-semibold text-blue hover:underline">
            CRM
          </Link>
          , and hands over the exact words to send.
        </p>
      </Panel>

      {/* ----------------------------------------------------------- due now */}
      <Panel
        title="Due to send"
        subtitle="Computed from the date each job was marked won. Tick a step once it has gone out."
      >
        {due.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-8 text-center">
            <p className="font-display text-sm font-bold text-slate-900">
              {won.length === 0 ? "No jobs marked won yet" : "Nothing due right now"}
            </p>
            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-500">
              {won.length === 0 ? (
                <>
                  Mark a lead <strong>Won</strong> in the CRM and its review
                  steps appear here on the right days.
                </>
              ) : (
                "Every step that has come due has been ticked off. The next one appears on its day."
              )}
            </p>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {due.map(({ lead, step, at }) => (
              <DueRow key={lead.id + step.id} lead={lead} step={step} at={at} />
            ))}
          </ul>
        )}
      </Panel>

      {/* --------------------------------------------------------- sequence */}
      <Panel
        title="The sequence"
        subtitle="Triggered when a job is marked complete. Three asks, then it stops — whether or not they reviewed."
      >
        <ol className="relative">
          {reviewSequence.map((step, i) => (
            <SequenceStep
              key={step.id}
              step={step}
              index={i + 1}
              last={i === reviewSequence.length - 1}
            />
          ))}
        </ol>
      </Panel>

      {/* ----------------------------------------------------------- branch */}
      <Panel title={unhappyBranch.title}>
        <p className="text-sm leading-relaxed text-slate-600">{unhappyBranch.body}</p>
        <Template className="mt-4" body={unhappyBranch.template} />
      </Panel>

      {/* ------------------------------------------------------------ rules */}
      <Panel
        title="Rules, not suggestions"
        subtitle="Each of these is a published Google policy or a US telecoms rule. Breaking them costs the profile, not just the review."
      >
        <ul className="space-y-3">
          {reviewRules.map((r, i) => (
            <li key={r.rule} className="flex gap-3.5">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-ember/10 font-mono text-[0.65rem] font-bold text-ember">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{r.rule}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                  {r.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      {/* ---------------------------------------------------------- replies */}
      <Panel
        title="Replying to reviews"
        subtitle="Written in advance, because the reply that needs the most care is the one written angry."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {replyTemplates.map((r) => (
            <div key={r.label} className="min-w-0 rounded-xl bg-slate-50 p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-display text-sm font-bold text-slate-900">
                  {r.label}
                </p>
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-slate-400">
                  {r.when}
                </p>
              </div>
              <Template className="mt-3" body={r.body} plain />
            </div>
          ))}
        </div>
      </Panel>

      {/* ------------------------------------------------------------- link */}
      <Panel title="The review link" subtitle="Every message above depends on it.">
        {reviewLink.url ? (
          <p className="break-all font-mono text-sm text-blue">{reviewLink.url}</p>
        ) : (
          <NotConnected
            service="Google Business Profile"
            what={reviewLink.note}
            steps={[
              "Client claims and verifies the Business Profile",
              "Copy the review link Google issues (g.page/r/…)",
              "Paste it into content/reviews.ts so every template picks it up",
              "Print it as a QR code for the vans and the invoice",
            ]}
          />
        )}
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Placeholders used across this page:{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">{"{{first}}"}</code>{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">{"{{tech}}"}</code>{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">{"{{city}}"}</code>{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">{"{{link}}"}</code>.
          Copying a message fills in what this dashboard knows and leaves the
          rest for you.
        </p>
      </Panel>
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ parts */

function SequenceStep({
  step,
  index,
  last,
}: {
  step: ReviewStep;
  index: number;
  last: boolean;
}) {
  const c = CHANNEL[step.channel];
  const ending = step.id === "stop";

  return (
    <li className="relative flex gap-4 pb-6 last:pb-0">
      {!last && (
        <span
          className="absolute left-[1.3rem] top-10 bottom-0 w-px bg-slate-200"
          aria-hidden="true"
        />
      )}
      <span
        className={cn(
          "relative grid size-11 shrink-0 place-items-center rounded-full",
          ending ? "bg-slate-100 text-slate-400" : c.tint,
        )}
      >
        <c.Icon className="size-4" aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="font-display text-sm font-bold text-slate-900">
            {index}. {step.title}
          </p>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
            {step.day === 0 ? "Same day" : `Day ${step.day}`}
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-slate-400">
            {c.label} · {step.by}
          </span>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{step.why}</p>
        {step.template && <Template className="mt-3" body={step.template} />}
      </div>
    </li>
  );
}

function DueRow({ lead, step, at }: { lead: Lead; step: ReviewStep; at: number }) {
  const c = CHANNEL[step.channel];
  return (
    <li className="flex flex-wrap items-start gap-3 rounded-xl bg-slate-50 p-3.5">
      <span className={cn("grid size-8 shrink-0 place-items-center rounded-full", c.tint)}>
        <c.Icon className="size-3.5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">
          {lead.name}
          <span className="ml-2 font-normal text-slate-500">{step.title}</span>
        </p>
        <p className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-slate-400">
          Due {ago(at)} · {c.label}
          {lead.phone && ` · ${lead.phone}`}
        </p>
        <Template
          className="mt-2.5"
          body={fill(step.template, lead)}
        />
      </div>
      <button
        type="button"
        onClick={() => toggleReviewStep(lead.id, step.id)}
        className="shrink-0 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700"
      >
        Mark sent
      </button>
    </li>
  );
}

/** Fills what the dashboard actually knows. Anything it does not know stays
 *  a visible placeholder rather than becoming an empty gap in a real message. */
function fill(template: string, lead: Lead) {
  const first = lead.name.trim().split(/\s+/)[0] || "{{first}}";
  return template
    .replaceAll("{{first}}", first)
    .replaceAll("{{city}}", lead.city || "{{city}}")
    .replaceAll("{{link}}", reviewLink.url || "{{link}}");
}

function Template({
  body,
  className,
  plain = false,
}: {
  body: string;
  className?: string;
  plain?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className={cn("relative min-w-0", className)}>
      <p
        className={cn(
          "whitespace-pre-wrap pr-10 text-xs leading-relaxed text-slate-700",
          !plain && "rounded-xl bg-slate-50 p-3.5 ring-1 ring-slate-200",
        )}
      >
        {body}
      </p>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(body).then(
            () => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            },
            () => {
              /* Clipboard blocked — the text is on screen to select. */
            },
          );
        }}
        aria-label={copied ? "Copied" : "Copy this message"}
        className={cn(
          "absolute right-1 top-1 grid size-9 place-items-center rounded-lg transition-colors",
          copied
            ? "bg-emerald-50 text-emerald-600"
            : "text-slate-400 hover:bg-white hover:text-slate-700",
        )}
      >
        {copied ? (
          <Check className="size-3.5" aria-hidden="true" />
        ) : (
          <Copy className="size-3.5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
