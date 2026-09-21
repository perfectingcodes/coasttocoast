import { business, cleanAndTune, locations } from "@/content/site";
import {
  channels,
  contentCalendar,
  objectives,
  planMeta,
} from "@/content/marketing";
import { AdminShell } from "@/components/admin/shell";
import { Panel, StatCard, StatusPill, Table, Td } from "@/components/admin/ui";

export default function AdminMarketing() {
  const proposed = channels
    .map((c) => Number(c.budget.replace(/[^0-9]/g, "")) || 0)
    .reduce((a, b) => a + b, 0);

  return (
    <AdminShell
      title="Marketing plan"
      lead={`${planMeta.version} — drafted ${planMeta.drafted} from the site's own content. Budgets and targets are proposals for ${business.name} to confirm, not commitments.`}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Proposed monthly spend"
          value={`$${proposed.toLocaleString()}`}
          hint="Paid channels only, excludes labour"
        />
        <StatCard label="Channels in plan" value={channels.length} />
        <StatCard
          label="Lead offer"
          value={cleanAndTune.price}
          hint={`${cleanAndTune.name}, 10-point service`}
        />
      </div>

      {channels.map((c) => (
        <Panel
          key={c.key}
          title={c.name}
          subtitle={c.role}
          action={<StatusPill status={c.status} />}
        >
          <dl className="flex flex-wrap gap-x-8 gap-y-2 border-b border-slate-100 pb-4 text-sm">
            <div className="flex gap-2">
              <dt className="text-slate-500">Budget</dt>
              <dd className="font-semibold text-slate-900">{c.budget}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-slate-500">Owner</dt>
              <dd className="font-semibold text-slate-900">{c.owner}</dd>
            </div>
          </dl>
          <ul className="mt-4 space-y-2">
            {c.actions.map((a) => (
              <li key={a} className="flex gap-2.5 text-sm text-slate-700">
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-slate-400"
                  aria-hidden="true"
                />
                {a}
              </li>
            ))}
          </ul>
        </Panel>
      ))}

      <Panel
        title="Content calendar"
        subtitle="One substantial piece a month, each tied to a campaign rather than published in isolation."
      >
        <Table columns={["Month", "Piece", "Channel", "Supports"]}>
          {contentCalendar.map((c) => (
            <tr key={c.month}>
              <Td className="font-medium text-slate-900">{c.month}</Td>
              <Td>{c.piece}</Td>
              <Td muted className="uppercase">{c.channel}</Td>
              <Td muted>{c.ties}</Td>
            </tr>
          ))}
        </Table>
      </Panel>

      <Panel title="Objectives and measures">
        <Table columns={["Objective", "Metric", "Target", "Horizon"]}>
          {objectives.map((o) => (
            <tr key={o.title}>
              <Td className="font-medium text-slate-900">{o.title}</Td>
              <Td muted>{o.metric}</Td>
              <Td className="font-semibold">{o.target}</Td>
              <Td muted>{o.horizon}</Td>
            </tr>
          ))}
        </Table>
      </Panel>

      <Panel
        title="Geographic priority"
        subtitle="Not every city deserves equal spend. Population, competition and proximity to the Fort Myers base all differ."
      >
        <Table columns={["City", "County", "ZIPs", "Conditions"]}>
          {locations.map((l) => (
            <tr key={l.slug}>
              <Td className="font-medium text-slate-900">{l.city}</Td>
              <Td muted>{l.county}</Td>
              <Td muted>{l.zips.length}</Td>
              <Td muted>
                {l.conditions.salt}
                {l.conditions.seasonal && " · seasonal homes"}
                {l.conditions.stormImpact && " · storm-affected"}
              </Td>
            </tr>
          ))}
        </Table>
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Seasonal-home cities (Naples, North Naples, Bonita Springs) shift
          spend toward the winter months. Storm-affected cities carry more
          replacement and insurance work.
        </p>
      </Panel>
    </AdminShell>
  );
}
