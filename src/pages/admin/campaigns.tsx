import { ExternalLink } from "lucide-react";
import { campaigns } from "@/content/marketing";
import { landingPages } from "@/content/landing";
import { AdminShell } from "@/components/admin/shell";
import { CampaignBoard } from "@/components/admin/kanban";
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Campaigns planned" value={campaigns.length} />
        <StatCard label="Proposed monthly" value={`$${monthly.toLocaleString()}`} />
        <StatCard label="Live campaigns" value={0} tone="warn" hint="Nothing running yet" />
      </div>

      <Panel
        title="Campaign board"
        subtitle="The same campaigns as the table below, arranged by where each one stands."
      >
        <CampaignBoard
          cards={campaigns.map((c) => ({
            id: c.name,
            title: c.name,
            meta: c.platform,
            note: c.objective,
            footer: `${c.budget} · ${c.window}`,
            status: c.status,
          }))}
        />
      </Panel>

      <Panel
        title="Landing pages"
        subtitle="Where each paid campaign sends its clicks. Sending ad traffic to a service page that carries the full site navigation is how a budget leaks."
      >
        <ul className="space-y-2.5">
          {landingPages.map((lp) => {
            const campaign = campaigns.find((c) => c.name === lp.campaign);
            return (
              <li
                key={lp.path}
                className="min-w-0 rounded-xl bg-navy/[0.025] p-4 ring-1 ring-inset ring-navy/8"
              >
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <div className="min-w-0">
                    <a
                      href={lp.path}
                      className="inline-flex items-center gap-1.5 font-display text-[0.9rem] font-extrabold text-navy hover:text-blue"
                    >
                      {lp.path}
                      <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                    </a>
                    <p className="mt-1 text-[0.78rem] text-navy/55">
                      {lp.campaign} · {lp.platform}
                    </p>
                  </div>
                  {campaign && <StatusPill status={campaign.status} />}
                </div>

                <p className="mt-3 border-t border-navy/8 pt-3 text-[0.8rem] leading-relaxed text-navy/70">
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-navy/40">
                    Ad headline
                  </span>
                  <br />
                  {lp.adHeadline}
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {lp.terms.map((t) => (
                    <li
                      key={t}
                      className="rounded-full bg-white px-2.5 py-1 font-mono text-[0.62rem] text-navy/55 ring-1 ring-navy/10"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-[0.74rem] leading-relaxed text-navy/50">
          Every landing page carries <code className="font-mono">noindex</code> and
          is excluded from the sitemap, so it cannot compete with the organic
          city and service pages for the same terms. They are deliberately{" "}
          <strong className="font-semibold text-navy/70">not</strong> blocked in
          robots.txt — AdsBot has to be able to fetch a landing page or the ad
          is disapproved.
        </p>
      </Panel>

      <Panel title="All campaigns" subtitle="Planned, not running.">
        <Table columns={["Campaign", "Platform", "Status", "Budget", "Window", "KPI"]}>
          {campaigns.map((c) => (
            <tr key={c.name}>
              <Td className="font-medium text-navy">
                {c.name}
                <span className="mt-0.5 block text-xs font-normal text-navy/50">
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
            <div key={c.name} className="rounded-lg border border-navy/10 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display text-sm font-bold text-navy">{c.name}</p>
                <StatusPill status={c.status} />
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-navy/60">{c.objective}</p>
              <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 border-t border-navy/8 pt-3 text-xs">
                <div className="flex gap-1.5">
                  <dt className="text-navy/50">Audience</dt>
                  <dd className="text-navy">{c.audience}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="text-navy/50">Budget</dt>
                  <dd className="font-semibold text-navy">{c.budget}</dd>
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
        <ul className="space-y-2.5 text-sm text-navy/75">
          {[
            "The husky mascot is genuinely distinctive in a category of stock photos and blue gradients — it should carry the social creative.",
            "The wrapped van shot is the strongest owned asset for awareness. Reshoot it once the wrap shows the real phone number.",
            "The $89 Clean & Tune is a concrete, checkable price. Ads with a real number outperform 'call for a quote' in this category.",
            "Licence #CMC1251768 and 24/7 answering are the trust levers — use them in ad copy, not just on the site.",
          ].map((n) => (
            <li key={n} className="flex gap-2.5">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-navy/35" aria-hidden="true" />
              {n}
            </li>
          ))}
        </ul>
      </Panel>
    </AdminShell>
  );
}
