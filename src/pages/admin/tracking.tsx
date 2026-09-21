import { business } from "@/content/site";
import { trackingStack } from "@/content/marketing";
import { AdminShell } from "@/components/admin/shell";
import { NotConnected, Panel, StatCard, StatusPill } from "@/components/admin/ui";

export default function AdminTracking() {
  const connected = trackingStack.filter((t) => t.status === "live").length;

  return (
    <AdminShell
      title="Tracking"
      lead="Nothing is measurable yet. No analytics, pixel or call tracking is installed, which means no ad spend can be judged and no conversion rate is known."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Tools connected" value={`${connected} / ${trackingStack.length}`} tone="bad" />
        <StatCard label="Visitor data collected" value="None" tone="bad" hint="No analytics installed" />
        <StatCard label="Lead destination" value="Email fallback" tone="warn" hint="VITE_QUOTE_ENDPOINT unset" />
      </div>

      <Panel
        title="Why this comes first"
        subtitle="Order of operations matters more here than anywhere else in the plan."
      >
        <ol className="space-y-2.5 text-sm text-slate-700">
          {[
            "Verify Search Console and submit the sitemap — free, and it is the only view of how Google actually sees the site.",
            "Install GA4 and confirm pageviews arrive.",
            "Define conversions: phone taps, form submissions, Clean & Tune bookings.",
            "Point the quote form at a real destination so leads are recorded, not just emailed.",
            "Add call tracking with dynamic number insertion — most leads in this business are phone calls.",
            "Only then start paid spend. Before this, a budget cannot be evaluated.",
          ].map((t, i) => (
            <li key={t} className="flex gap-3">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-slate-900 text-[0.65rem] font-bold text-white">
                {i + 1}
              </span>
              {t}
            </li>
          ))}
        </ol>
      </Panel>

      {trackingStack.map((t) => (
        <Panel
          key={t.name}
          title={t.name}
          subtitle={t.purpose}
          action={<StatusPill status={t.status} />}
        >
          <p className="text-sm leading-relaxed text-slate-700">{t.note}</p>
          <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 border-t border-slate-100 pt-4 text-sm">
            <div className="flex gap-2">
              <dt className="text-slate-500">Identifier</dt>
              <dd className="font-mono text-xs text-slate-900">{t.idLabel}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-slate-500">Value</dt>
              <dd className="font-mono text-xs text-slate-400">not set</dd>
            </div>
          </dl>
        </Panel>
      ))}

      <Panel title="A note on call tracking and local SEO">
        <NotConnected
          service="Call tracking"
          what={`The site publishes ${business.phone} in the header, footer, every CTA and the structured data. Swapping that for a tracking number in the markup would break NAP consistency and damage local ranking.`}
          steps={[
            "Use dynamic number insertion: the real number stays in the HTML and schema",
            "Only the rendered number changes per visitor source, after page load",
            `Keep ${business.phone} as the NAP of record everywhere off-site`,
          ]}
        />
      </Panel>

      <Panel title="Privacy and consent">
        <p className="text-sm leading-relaxed text-slate-700">
          Adding analytics and a Meta Pixel means collecting visitor data. Before
          either goes live the site needs a cookie/consent notice and the privacy
          policy needs updating to name the tools, what they collect and how long
          it is kept. Florida has no state privacy law requiring this today, but
          the policy on the site currently describes a site that collects nothing
          — which stops being true the moment tracking is installed.
        </p>
      </Panel>
    </AdminShell>
  );
}
