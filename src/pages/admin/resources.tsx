import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  AtSign,
  Check,
  Copy,
  ExternalLink,
  Link2,
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
import { landingPages } from "@/content/landing";
import { AdminShell } from "@/components/admin/shell";
import { Micro, NotConnected, Panel, StatCard } from "@/components/admin/ui";
import { ago, toggleReviewStep, useCrm, type Lead } from "@/lib/leads";
import {
  checkReviewLink,
  loadSettings,
  saveSettings,
  useSettings,
} from "@/lib/admin-settings";
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
  const settings = useSettings();
  const link = settings.reviewLink || reviewLink.url;
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
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
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
          label="Landing pages"
          value={landingPages.length}
          icon={<ExternalLink className="size-4" />}
          hint="Indexed below"
        />
        <StatCard
          label="Review link"
          value={link ? "Ready" : "Not set"}
          tone={link ? "good" : "bad"}
          hint={link ? "Every template fills in from it" : "Google profile must be claimed first"}
        />
      </div>

      <ReviewLinkSetup />

      {/* Every landing page in one place. This is what somebody comes to
          this page for when they ask "what is the link for the tune-up ad?",
          so it sits above the review sequence rather than under it. */}
      <Panel
        title="Landing pages"
        subtitle="Every paid page on the site, what it is bought against, and what it has to carry."
      >
        {(["google-ads", "meta"] as const).map((plan) => {
          const pages = landingPages.filter((p) => p.plan === plan);
          if (!pages.length) return null;
          return (
            <div key={plan} className="mt-6 first:mt-0">
              <Micro>
                {plan === "google-ads"
                  ? "Google Ads build sheet · Naples, Bonita Springs, Estero"
                  : "Meta — our own plan"}
              </Micro>
              <ul className="mt-3 grid gap-3 lg:grid-cols-2">
                {pages.map((lp) => (
                  <li
                    key={lp.path}
                    className="min-w-0 rounded-xl bg-navy/[0.025] p-4 ring-1 ring-inset ring-navy/8"
                  >
                    <a
                      href={lp.path}
                      className="inline-flex items-center gap-1.5 font-display text-[0.92rem] font-extrabold text-navy hover:text-blue"
                    >
                      {lp.path}
                      <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                    </a>
                    <p className="mt-1 text-[0.76rem] text-navy/55">
                      {lp.campaign} · {lp.platform}
                    </p>
                    <p className="mt-2.5 border-t border-navy/8 pt-2.5 text-[0.78rem] leading-relaxed text-navy/70">
                      {lp.adHeadline}
                    </p>
                    {lp.adGroups.length > 0 && (
                      <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-navy/40">
                        {lp.adGroups.join(" · ")}
                      </p>
                    )}
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {lp.requirements.map((r) => {
                        const open = /NOT CONFIRMED|NOT SET/i.test(r);
                        return (
                          <li
                            key={r}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.66rem] font-semibold ring-1 ring-inset",
                              open
                                ? "bg-gold/15 text-amber-800 ring-gold/40"
                                : "bg-white text-navy/60 ring-navy/10",
                            )}
                          >
                            {open ? (
                              <ShieldAlert className="size-3 shrink-0" aria-hidden="true" />
                            ) : (
                              <Check className="size-3 shrink-0 text-emerald-600" aria-hidden="true" />
                            )}
                            {r}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        <p className="mt-5 text-[0.74rem] leading-relaxed text-navy/50">
          Emergency AC is call-only and has no page by design. Every page here
          is <code className="font-mono">noindex</code> and out of the sitemap
          so it cannot compete with the organic city pages, and deliberately
          not blocked in robots.txt so AdsBot can fetch it. Full detail and the
          open decisions sit on{" "}
          <Link href="/admin/google-ads" className="font-semibold text-blue hover:underline">
            Google Ads build
          </Link>
          .
        </p>
      </Panel>

      {/* What "automated" does and does not mean here. Stated before the
          sequence, not after it. */}
      <Panel
        title="What runs itself, and what does not"
        subtitle="The schedule is fixed. The sending is not — this build has no server, no SMS account and no job-completion feed."
      >
        <ul className="grid gap-3 md:grid-cols-2">
          {automationGaps.map((g) => (
            <li key={g.what} className="rounded-xl bg-navy/[0.035] p-4">
              <p className="flex items-start gap-2 text-sm font-semibold text-navy">
                <ShieldAlert
                  className="mt-0.5 size-3.5 shrink-0 text-amber-600"
                  aria-hidden="true"
                />
                {g.what}
              </p>
              <p className="mt-1.5 pl-5 text-xs leading-relaxed text-navy/60">
                {g.needs}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-navy/50">
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
          <div className="rounded-xl border border-dashed border-navy/15 bg-navy/[0.02] px-6 py-8 text-center">
            <p className="font-display text-sm font-bold text-navy">
              {won.length === 0 ? "No jobs marked won yet" : "Nothing due right now"}
            </p>
            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-navy/50">
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
        <p className="text-sm leading-relaxed text-navy/60">{unhappyBranch.body}</p>
        <Template className="mt-4" body={fillGeneric(unhappyBranch.template)} />
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
                <p className="text-sm font-semibold text-navy">{r.rule}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-navy/60">
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
            <div key={r.label} className="min-w-0 rounded-xl bg-navy/[0.035] p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-display text-sm font-bold text-navy">
                  {r.label}
                </p>
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-navy/40">
                  {r.when}
                </p>
              </div>
              <Template className="mt-3" body={fillGeneric(r.body)} plain />
            </div>
          ))}
        </div>
      </Panel>

      {/* ------------------------------------------------------------- link */}
      <Panel title="The review link" subtitle="Every message above depends on it.">
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="break-all font-mono text-sm text-blue hover:underline"
          >
            {link}
          </a>
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
        <p className="mt-4 text-xs leading-relaxed text-navy/50">
          Placeholders used across this page:{" "}
          <code className="rounded bg-navy/8 px-1 py-0.5 font-mono">{"{{first}}"}</code>{" "}
          <code className="rounded bg-navy/8 px-1 py-0.5 font-mono">{"{{tech}}"}</code>{" "}
          <code className="rounded bg-navy/8 px-1 py-0.5 font-mono">{"{{city}}"}</code>{" "}
          <code className="rounded bg-navy/8 px-1 py-0.5 font-mono">{"{{link}}"}</code>.
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
          className="absolute left-[1.3rem] top-10 bottom-0 w-px bg-navy/15"
          aria-hidden="true"
        />
      )}
      <span
        className={cn(
          "relative grid size-11 shrink-0 place-items-center rounded-full",
          ending ? "bg-navy/8 text-navy/40" : c.tint,
        )}
      >
        <c.Icon className="size-4" aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="font-display text-sm font-bold text-navy">
            {index}. {step.title}
          </p>
          <span className="rounded-full bg-navy/8 px-2 py-0.5 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-navy/50">
            {step.day === 0 ? "Same day" : `Day ${step.day}`}
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-navy/40">
            {c.label} · {step.by}
          </span>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-navy/60">{step.why}</p>
        {step.template && (
          <Template className="mt-3" body={fillGeneric(step.template)} />
        )}
      </div>
    </li>
  );
}

function DueRow({ lead, step, at }: { lead: Lead; step: ReviewStep; at: number }) {
  const c = CHANNEL[step.channel];
  return (
    <li className="flex flex-wrap items-start gap-3 rounded-xl bg-navy/[0.035] p-3.5">
      <span className={cn("grid size-8 shrink-0 place-items-center rounded-full", c.tint)}>
        <c.Icon className="size-3.5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-navy">
          {lead.name}
          <span className="ml-2 font-normal text-navy/50">{step.title}</span>
        </p>
        <p className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-navy/40">
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
        className="shrink-0 rounded-full bg-navy px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-navy-soft"
      >
        Mark sent
      </button>
    </li>
  );
}

/** Fills what the dashboard actually knows. Anything it does not know stays
 *  a visible placeholder rather than becoming an empty gap in a real message. */
function fill(template: string, lead: Lead) {
  const s = loadSettings();
  const first = lead.name.trim().split(/\s+/)[0] || "{{first}}";
  return template
    .replaceAll("{{first}}", first)
    .replaceAll("{{city}}", lead.city || "{{city}}")
    .replaceAll("{{tech}}", s.techName || "{{tech}}")
    .replaceAll("{{link}}", s.reviewLink || reviewLink.url || "{{link}}");
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
          "whitespace-pre-wrap pr-10 text-xs leading-relaxed text-navy/75",
          !plain && "rounded-xl bg-navy/[0.035] p-3.5 ring-1 ring-navy/10",
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
            : "text-navy/40 hover:bg-white hover:text-navy/75",
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

/**
 * Fills the placeholders the dashboard knows regardless of which lead is in
 * front of it. {{first}} and {{city}} stay visible — those are per customer
 * and guessing at them is how a message goes out saying "Hi {{first}}".
 */
function fillGeneric(template: string) {
  const s = loadSettings();
  return template
    .replaceAll("{{tech}}", s.techName || "{{tech}}")
    .replaceAll("{{link}}", s.reviewLink || reviewLink.url || "{{link}}");
}

/**
 * The one thing that has to be typed in for the review sequence to work.
 *
 * Paste the Google review link here and every template on this page, every
 * due row below, and the sequence copy all fill in with it. That is the whole
 * setup — there is nothing else to configure.
 */
function ReviewLinkSetup() {
  const settings = useSettings();
  const [url, setUrl] = useState("");
  const [tech, setTech] = useState("");
  const [touched, setTouched] = useState(false);

  // Seed the inputs once the stored values arrive after mount.
  useEffect(() => {
    if (touched) return;
    setUrl(settings.reviewLink);
    setTech(settings.techName);
  }, [settings, touched]);

  const check = checkReviewLink(url);
  const live = Boolean(settings.reviewLink);

  return (
    <Panel
      title="Review link"
      subtitle="Paste it once. Every template, every due row and the whole sequence fill in from here."
      action={
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[0.64rem] font-bold ring-1 ring-inset",
            live
              ? "bg-emerald-500/12 text-emerald-700 ring-emerald-500/25"
              : "bg-ember/10 text-ember ring-ember/25",
          )}
        >
          {live ? "Live" : "Not set"}
        </span>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveSettings({ reviewLink: url.trim(), techName: tech.trim() });
          setTouched(false);
        }}
        className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem_auto] lg:items-end"
      >
        <label className="min-w-0">
          <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-navy/45">
            Google review link
          </span>
          <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-navy/[0.035] px-3 ring-1 ring-inset ring-navy/10 focus-within:ring-2 focus-within:ring-blue">
            <Link2 className="size-4 shrink-0 text-navy/35" aria-hidden="true" />
            <input
              value={url}
              onChange={(e) => {
                setTouched(true);
                setUrl(e.target.value);
              }}
              inputMode="url"
              placeholder="https://g.page/r/…/review"
              className="w-full border-0 bg-transparent py-2.5 font-mono text-[0.78rem] text-navy outline-none placeholder:text-navy/30"
            />
          </div>
        </label>

        <label className="min-w-0">
          <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-navy/45">
            Default technician name
          </span>
          <input
            value={tech}
            onChange={(e) => {
              setTouched(true);
              setTech(e.target.value);
            }}
            placeholder="e.g. Dave"
            className="mt-1.5 w-full rounded-lg border-0 bg-navy/[0.035] px-3 py-2.5 text-[0.82rem] text-navy ring-1 ring-inset ring-navy/10 outline-none placeholder:text-navy/30 focus:ring-2 focus:ring-blue"
          />
        </label>

        <button
          type="submit"
          className="h-[2.85rem] shrink-0 rounded-full bg-blue px-6 font-display text-[0.8rem] font-bold text-white transition-colors hover:bg-blue/90"
        >
          Save
        </button>
      </form>

      {url.trim() && (
        <p
          className={cn(
            "mt-3 flex gap-2 text-[0.78rem] leading-relaxed",
            check.ok ? "text-emerald-700" : "text-ember",
          )}
        >
          {check.ok ? (
            <Check className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <ShieldAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          )}
          {check.note}
        </p>
      )}

      <div className="mt-5 grid gap-4 border-t border-navy/8 pt-4 md:grid-cols-2">
        <div>
          <Micro>Where to find it</Micro>
          <ol className="mt-2 space-y-1.5 text-[0.78rem] leading-relaxed text-navy/65">
            <li>1. Open the Business Profile on Google Search or Maps while signed in as the owner.</li>
            <li>2. Choose <strong className="font-semibold text-navy">Ask for reviews</strong>.</li>
            <li>
              3. Copy the short link it gives you. It looks like{" "}
              <code className="font-mono text-[0.72rem]">g.page/r/…/review</code> and opens
              the star box directly.
            </li>
          </ol>
        </div>
        <div>
          <Micro>Why this one and not the profile URL</Micro>
          <p className="mt-2 text-[0.78rem] leading-relaxed text-navy/65">
            The profile URL drops people on the listing, where they have to
            scroll, find the reviews, and press a button before they can type
            anything. Most do not. The review link opens the five stars with
            the cursor in the box, and that difference is most of the
            conversion rate on the whole sequence.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-[0.74rem] leading-relaxed text-navy/50">
        <p>
          Stored in this browser, like everything else on this dashboard. It is
          a public URL rather than a secret, so the only cost of that is
          pasting it again on another machine.
        </p>
        <p className="rounded-lg bg-gold/10 p-3 text-navy/70 ring-1 ring-inset ring-gold/30">
          <strong className="font-semibold">One thing this does not reach.</strong>{" "}
          The link-in-bio page at{" "}
          <a href="/links" className="font-semibold text-blue hover:underline">
            /links
          </a>{" "}
          is a public page, so it cannot read a value stored in your browser.
          To put a "Leave us a review" button there, the same URL has to go
          into <code className="font-mono text-[0.7rem]">reviewLink.url</code>{" "}
          in <code className="font-mono text-[0.7rem]">content/reviews.ts</code>{" "}
          and be redeployed. Until then the button is hidden rather than
          pointing somewhere wrong.
        </p>
      </div>
    </Panel>
  );
}
