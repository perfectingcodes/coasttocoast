import { business, googleReviews, hasReviewData, locations } from "@/content/site";
import { campaigns } from "@/content/marketing";
import { AdminShell } from "@/components/admin/shell";
import { NotConnected, Panel, StatCard, StatusPill, Table, Td } from "@/components/admin/ui";

export default function AdminGoogle() {
  const googleCampaigns = campaigns.filter((c) => c.platform.startsWith("Google"));

  return (
    <AdminShell
      title="Google"
      lead="Business Profile, Ads, Local Services and Search Console. For a local contractor the Business Profile matters more than everything else here combined."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Profile status" value="Unclaimed" tone="bad" hint="Highest priority" />
        <StatCard
          label="Verified reviews"
          value={hasReviewData() ? googleReviews.count! : "None"}
          tone={hasReviewData() ? "good" : "warn"}
          hint={hasReviewData() ? `${googleReviews.rating} average` : "Site shows no rating by design"}
        />
        <StatCard label="Service areas to set" value={locations.length} hint="Match the site exactly" />
      </div>

      <Panel
        title="Google Business Profile"
        subtitle="The single highest-ROI asset in local search. Posts, photos and Q&A all feed local pack ranking."
        action={<StatusPill status="blocked" />}
      >
        <NotConnected
          service="Google Business Profile"
          what="The profile has not been claimed or verified, so the business cannot appear in the local pack or on Maps. Everything else in this plan depends on it."
          steps={[
            `Claim the profile for ${business.street}, ${business.city}, ${business.state} ${business.zip}`,
            "Complete postcard or phone verification",
            `Set the service areas to exactly the ${locations.length} cities the site covers`,
            "Add the licence number, hours and the 24/7 emergency attribute",
            "Upload the logo, van and job photos",
          ]}
        />

        <div className="mt-5 rounded-lg border border-slate-200 p-4">
          <p className="font-display text-sm font-bold text-slate-900">
            NAP consistency
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Name, address and phone must match character-for-character across
            the profile, the site and every directory. Inconsistency is one of
            the most common causes of weak local ranking.
          </p>
          <dl className="mt-3 space-y-1.5 text-sm">
            {[
              ["Name", business.name],
              ["Address", `${business.street}, ${business.city}, ${business.state} ${business.zip}`],
              ["Phone", business.phone],
              ["Licence", business.license],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <dt className="w-20 shrink-0 text-xs text-slate-500">{k}</dt>
                <dd className="font-mono text-xs text-slate-900">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Panel>

      <Panel
        title="Reviews"
        subtitle="Feeds both local ranking and conversion rate."
        action={<StatusPill status={hasReviewData() ? "live" : "ready"} />}
      >
        <p className="text-sm leading-relaxed text-slate-700">
          The site is already built to display a rating and emit{" "}
          <code className="rounded bg-slate-100 px-1 text-xs">aggregateRating</code>{" "}
          the moment there is a verified one. Until then it shows a neutral
          &ldquo;Reviews on Google&rdquo; link and no stars — deliberately, because
          publishing an invented rating is a Google policy violation and a
          manual-action risk.
        </p>
        <div className="mt-4 rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-semibold text-slate-900">To switch it on</p>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            Set <code className="text-[0.7rem]">rating</code>,{" "}
            <code className="text-[0.7rem]">count</code>,{" "}
            <code className="text-[0.7rem]">profileUrl</code> and{" "}
            <code className="text-[0.7rem]">reviewUrl</code> in{" "}
            <code className="text-[0.7rem]">src/content/site.ts</code>. The
            badges, the stars and the structured data all follow from that one
            object.
          </p>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          {[
            "Send a review request by SMS the same day the job closes — same-day requests convert far better than next-week ones",
            "Respond to every review within 48 hours, positive or not",
            "Never gate requests on the customer being happy; that violates Google's policy",
          ].map((t) => (
            <li key={t} className="flex gap-2.5">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Google Ads & Local Services" action={<StatusPill status="not-connected" />}>
        <NotConnected
          service="Google Ads"
          what="No ad account is linked, so there is no spend, impression or conversion data. Local Services Ads additionally require licence and insurance verification, which takes time — start that early."
          steps={[
            `Apply for Local Services Ads and verify licence ${business.license}`,
            "Create the Ads account and link it to Search Console and Analytics",
            "Install conversion tracking before the first dollar is spent",
            "Launch the emergency campaign first; it has the clearest intent",
          ]}
        />
        <div className="mt-5">
          <Table columns={["Campaign", "Status", "Budget", "KPI"]}>
            {googleCampaigns.map((c) => (
              <tr key={c.name}>
                <Td className="font-medium text-slate-900">{c.name}</Td>
                <Td>
                  <StatusPill status={c.status} />
                </Td>
                <Td muted>{c.budget}</Td>
                <Td muted>{c.kpi}</Td>
              </tr>
            ))}
          </Table>
        </div>
      </Panel>

      <Panel title="Search Console" action={<StatusPill status="not-connected" />}>
        <NotConnected
          service="Google Search Console"
          what="Not verified, so there is no index coverage, query or structured-data error reporting. This is free and should be the very first thing set up once the domain is live."
          steps={[
            "Verify the domain property via DNS",
            "Submit /sitemap.xml",
            "Check the Enhancements panel for FAQ and LocalBusiness validity",
            "Watch Coverage for anything unexpectedly excluded",
          ]}
        />
      </Panel>
    </AdminShell>
  );
}
