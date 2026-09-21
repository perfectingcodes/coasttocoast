import { campaigns } from "@/content/marketing";
import { AdminShell } from "@/components/admin/shell";
import { NotConnected, Panel, StatCard, StatusPill, Table, Td } from "@/components/admin/ui";

export default function AdminCampaigns() {
  const monthly = campaigns
    .map((c) => Number(c.budget.replace(/[^0-9]/g, "")) || 0)
    .reduce((a, b) => a + b, 0);
  const meta = campaigns.filter((c) => c.platform === "Meta");

  return (
    <AdminShell
      title="Campaigns"
      lead="Planned campaigns across Google, Meta and email. No platform is connected, so there is no performance data here — only the plan."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Campaigns planned" value={campaigns.length} />
        <StatCard label="Proposed monthly" value={`$${monthly.toLocaleString()}`} />
        <StatCard label="Live campaigns" value={0} tone="warn" hint="Nothing running yet" />
      </div>

      <Panel title="All campaigns" subtitle="Planned, not running.">
        <Table columns={["Campaign", "Platform", "Status", "Budget", "Window", "KPI"]}>
          {campaigns.map((c) => (
            <tr key={c.name}>
              <Td className="font-medium text-slate-900">
                {c.name}
                <span className="mt-0.5 block text-xs font-normal text-slate-500">
                  {c.objective}
                </span>
              </Td>
              <Td muted>{c.platform}</Td>
              <Td>
                <StatusPill status={c.status} />
              </Td>
              <Td muted>{c.budget}</Td>
              <Td muted>{c.window}</Td>
              <Td muted>{c.kpi}</Td>
            </tr>
          ))}
        </Table>
      </Panel>

      <Panel
        title="Meta (Facebook & Instagram)"
        subtitle="Demand generation and retargeting. People do not scroll Instagram looking for an HVAC contractor — they remember one when the unit dies."
      >
        <NotConnected
          service="Meta Business"
          what="No ad account, Page or Pixel is connected, so there is no spend, reach or conversion data to show. Connecting requires the client's Meta Business Manager and a server to hold the access token — this build has neither."
          steps={[
            "Client grants access to the Meta Business Manager and Facebook Page",
            "Create the ad account and install the Pixel on the site",
            "Let the Pixel collect 30 days before building retargeting audiences",
            "Wire the Marketing API once a backend exists",
          ]}
        />
        <div className="mt-5 space-y-3">
          {meta.map((c) => (
            <div key={c.name} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display text-sm font-bold text-slate-900">{c.name}</p>
                <StatusPill status={c.status} />
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{c.objective}</p>
              <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 border-t border-slate-100 pt-3 text-xs">
                <div className="flex gap-1.5">
                  <dt className="text-slate-500">Audience</dt>
                  <dd className="text-slate-900">{c.audience}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="text-slate-500">Budget</dt>
                  <dd className="font-semibold text-slate-900">{c.budget}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        title="Creative notes"
        subtitle="What this brand has that most HVAC competitors do not."
      >
        <ul className="space-y-2.5 text-sm text-slate-700">
          {[
            "The husky mascot is genuinely distinctive in a category of stock photos and blue gradients — it should carry the social creative.",
            "The wrapped van shot is the strongest owned asset for awareness. Reshoot it once the wrap shows the real phone number.",
            "The $89 Clean & Tune is a concrete, checkable price. Ads with a real number outperform 'call for a quote' in this category.",
            "Licence #CMC1251768 and 24/7 answering are the trust levers — use them in ad copy, not just on the site.",
          ].map((n) => (
            <li key={n} className="flex gap-2.5">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden="true" />
              {n}
            </li>
          ))}
        </ul>
      </Panel>
    </AdminShell>
  );
}
