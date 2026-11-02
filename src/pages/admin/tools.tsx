import { CircleCheck, CircleDashed, CircleX, Clock, Plug } from "lucide-react";
import { TOOL_GROUPS, tools, type Tool, type ToolGroup } from "@/content/tools";
import { AdminShell } from "@/components/admin/shell";
import { Instrument, Panel, StatCard } from "@/components/admin/ui";
import { env, useDetected } from "@/lib/detect";
import { cn } from "@/lib/utils";

/**
 * The stack.
 *
 * Two statuses, kept visually apart: what the code can verify and what has
 * been recorded by hand. Anyone reading this should be able to tell at a
 * glance which is which, because a green tick that nobody checked is how a
 * month of missing analytics happens.
 */

const STATE = {
  live: {
    label: "Live",
    Icon: CircleCheck,
    cls: "bg-emerald-500/12 text-emerald-700 ring-emerald-500/25",
    dot: "bg-emerald-500",
  },
  configured: {
    label: "Configured",
    Icon: CircleDashed,
    cls: "bg-cyan/18 text-[#0a5b7d] ring-cyan/40",
    dot: "bg-cyan",
  },
  "in-progress": {
    label: "In progress",
    Icon: Clock,
    cls: "bg-gold/20 text-amber-800 ring-gold/40",
    dot: "bg-gold",
  },
  connected: {
    label: "Connected",
    Icon: CircleCheck,
    cls: "bg-emerald-500/12 text-emerald-700 ring-emerald-500/25",
    dot: "bg-emerald-500",
  },
  blocked: {
    label: "Blocked",
    Icon: CircleX,
    cls: "bg-ember/10 text-ember ring-ember/25",
    dot: "bg-ember",
  },
  off: {
    label: "Not set",
    Icon: CircleX,
    cls: "bg-navy/8 text-navy/55 ring-navy/15",
    dot: "bg-navy/35",
  },
} as const;

export default function AdminTools() {
  const blocked = tools.filter((t) => t.declared === "blocked");
  const pending = tools.filter((t) => t.declared === "in-progress");

  return (
    <AdminShell
      title="Connected tools"
      lead="Every piece of the stack and where it stands. Statuses the code can verify are marked as checked; the rest are recorded by hand and labelled that way."
    >
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Tools in the stack" value={tools.length} icon={<Plug />} hint="Across four groups" />
        <StatCard
          label="Verified by the code"
          value={tools.filter((t) => t.detect).length}
          tone="good"
          icon={<CircleCheck />}
          hint="Checked live on this page"
        />
        <StatCard
          label="In progress"
          value={pending.length}
          tone="warn"
          icon={<Clock />}
          hint="Recorded, not yet complete"
        />
        <StatCard
          label="Blocked"
          value={blocked.length}
          tone={blocked.length ? "bad" : "good"}
          icon={<CircleX />}
          hint="Waiting on a document"
        />
      </div>

      {/* The one thing holding everything else up. */}
      <Instrument
        label="The one outstanding item"
        footnote="Postcard verification runs 5 to 14 days. Nothing downstream can be brought forward."
      >
        <p className="mt-3 font-display text-[1.3rem] font-extrabold leading-tight">
          Everything is connected except the Google Business Profile.
        </p>
        <p className="mt-3 max-w-2xl text-[0.88rem] leading-relaxed text-white/75">
          It gates more than its share: the map pack, the location asset on
          every ad, the review link the whole request sequence runs on, and
          Local Services Ads. The Google Ads build is complete and paused
          behind it rather than behind anything of ours.
        </p>
      </Instrument>

      <MissingKeys />

      {(Object.keys(TOOL_GROUPS) as ToolGroup[]).map((group) => (
        <Panel
          key={group}
          title={TOOL_GROUPS[group]}
          subtitle={
            group === "measurement"
              ? "Checked live every time this page loads."
              : undefined
          }
        >
          <ul className="grid gap-3 lg:grid-cols-2">
            {tools
              .filter((t) => t.group === group)
              .map((t) => (
                <ToolCard key={t.key} tool={t} />
              ))}
          </ul>
        </Panel>
      ))}
    </AdminShell>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const detected = useDetected(tool.detect);
  const key = detected ? detected.state : (tool.declared ?? "off");
  const s = STATE[key];
  const checking = Boolean(tool.detect) && !detected;

  return (
    <li className="min-w-0 rounded-xl bg-navy/[0.025] p-4 ring-1 ring-inset ring-navy/8">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="font-display text-[0.92rem] font-extrabold text-navy">
          {tool.name}
        </p>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.64rem] font-bold ring-1 ring-inset",
            checking ? "bg-navy/6 text-navy/45 ring-navy/12" : s.cls,
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              checking ? "animate-pulse bg-navy/40" : s.dot,
            )}
            aria-hidden="true"
          />
          {checking ? "Checking" : s.label}
        </span>
      </div>

      <p className="mt-2 text-[0.8rem] leading-relaxed text-navy/65">{tool.what}</p>

      <p className="mt-2.5 border-t border-navy/8 pt-2.5 text-[0.76rem] leading-relaxed text-navy/60">
        <span className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-navy/40">
          {tool.detect ? "Checked · " : "Recorded · "}
        </span>
        {detected ? detected.note : checking ? "Running the check…" : tool.declaredNote}
      </p>

      {tool.consequence && (
        <p className="mt-2 text-[0.74rem] leading-relaxed text-navy/50">
          {tool.consequence}
        </p>
      )}
    </li>
  );
}

/**
 * The gap between "we have a GA4 property" and "the site is sending to it".
 *
 * These are almost always set up on the vendor side and then never pasted
 * into the host, which is how a month of analytics quietly goes missing. The
 * accounts may well exist — the site just does not have the IDs, and nothing
 * loads without them.
 */
function MissingKeys() {
  const missing = [
    {
      key: "VITE_GA4_ID",
      tool: "Google Analytics 4",
      where: "Admin → Data streams → your web stream. Starts with G-",
      set: Boolean(env.ga4),
    },
    {
      key: "VITE_META_PIXEL_ID",
      tool: "Meta Pixel",
      where: "Events Manager → Data sources. A 15-16 digit number",
      set: Boolean(env.pixel),
    },
    {
      key: "VITE_LEADS_ENDPOINT",
      tool: "Lead and event forwarding",
      where: "Any URL that accepts a JSON POST — a form service, a Worker, a CRM webhook",
      set: Boolean(env.leads),
    },
    {
      key: "VITE_QUOTE_ENDPOINT",
      tool: "Quote form delivery",
      where: "Same shape. Without it the form falls back to a prefilled email",
      set: Boolean(env.quote),
    },
  ].filter((m) => !m.set);

  if (!missing.length) return null;

  return (
    <Panel
      title="Finish the connection"
      subtitle="These accounts may already exist — the site just does not have their IDs. Nothing loads without them, which is how a month of analytics quietly goes missing."
    >
      <ol className="space-y-2.5">
        {missing.map((m) => (
          <li
            key={m.key}
            className="min-w-0 rounded-xl bg-gold/8 p-4 ring-1 ring-inset ring-gold/35"
          >
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <code className="rounded bg-white px-2 py-0.5 font-mono text-[0.76rem] font-bold text-navy ring-1 ring-navy/10">
                {m.key}
              </code>
              <span className="text-[0.82rem] font-semibold text-navy">{m.tool}</span>
            </p>
            <p className="mt-1.5 text-[0.76rem] leading-relaxed text-navy/60">
              {m.where}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-[0.78rem] leading-relaxed text-navy/60">
        Paste them into the host's environment variables — Netlify under Site
        configuration, Vercel under Settings → Environment Variables — then
        redeploy. They are build-time values, so a redeploy is required; setting
        them without one changes nothing. This page re-checks on every load, so
        the statuses above flip to green on their own once it is done.
      </p>
    </Panel>
  );
}
