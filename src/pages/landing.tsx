import { Link } from "wouter";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Clock,
  Phone,
  ShieldCheck,
  Wind,
} from "lucide-react";
import { business, cleanAndTune, locations, testimonials } from "@/content/site";

/** Cities the Meta storm campaign is segmented on. */
const stormCities = locations.filter((l) => l.conditions.stormImpact);
import {
  adMarketLine,
  adMarkets,
  landingByPath,
  type LandingPage,
} from "@/content/landing";
import { QuickQuote, QuoteForm } from "@/components/quote-form";
import { PaymentCalculator } from "@/components/payment-calculator";
import { FaqList } from "@/components/faq-list";
import { ButtonLink } from "@/components/ui/button";
import { Seo } from "@/lib/seo";
import { track } from "@/lib/leads";
import { cn } from "@/lib/utils";
import NotFound from "./not-found";

/**
 * Paid landing page.
 *
 * Deliberately NOT built on SiteLayout. A page bought with ad money has one
 * job, and the site header — six services, nine cities, an about page — is a
 * list of ways to leave before converting. What is here instead: the promise
 * the ad made, two ways to act on it, the proof that makes acting reasonable,
 * and nothing else to click until the bottom.
 *
 * The five variants are genuinely different pages, not a palette swap. An
 * emergency search at 11pm and a financing comparison on a Sunday afternoon
 * are not the same visitor and should not get the same screen: the emergency
 * page leads with the phone on a dark ground, the replacement page leads with
 * the payment calculator, the offer page leads with the price.
 */

const GROUND: Record<LandingPage["variant"], string> = {
  repair: "band-abyss",
  offer: "band-azure",
  plans: "band-navy",
  replacement: "band-navy",
  storm: "band-abyss",
  commercial: "band-navy",
};

export default function LandingPageView({ path }: { path: string }) {
  const page = landingByPath(path);
  if (!page) return <NotFound />;

  const form = <QuoteForm defaultService={serviceFor(page)} />;

  return (
    <>
      <Seo
        title={page.title}
        description={page.description}
        path={page.path}
        // Noindexed on purpose: these would compete with the organic city and
        // service pages for the same terms. Not disallowed in robots.txt —
        // AdsBot must be able to fetch a landing page.
        noindex
      />

      <div className="min-h-dvh bg-white pb-20 md:pb-0">
        <AdHeader />

        <Hero page={page} form={form} />

        <Steps page={page} />

        {page.variant === "repair" && <CommonCauses />}
        {page.variant === "offer" && <OfferDetail />}
        {page.variant === "plans" && <PlanTiers />}
        {page.variant === "replacement" && <FinanceBlock />}
        {page.variant === "storm" && <StormCities />}
        {page.variant === "commercial" && <SectorGrid />}

        {/* Tab 10 asks for reviews on the repair page. Only quotes we
            actually hold are rendered — see the note in site.ts. */}
        {page.variant === "repair" && <Reviews />}

        <Reasons page={page} />

        <section className="shell py-14 md:py-18">
          <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="min-w-0">
              <h2 className="poster text-[clamp(1.6rem,3vw,2.2rem)]">
                Questions people ask
                <span className="text-ember">.</span>
              </h2>
              <FaqList faqs={page.faqs} />
            </div>
            <div id="book" className="scroll-mt-24">
              <p className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-blue">
                {page.close.title}
              </p>
              <p className="mt-2 max-w-md leading-relaxed text-navy/70">
                {page.close.body}
              </p>
              <div className="mt-5">{form}</div>
            </div>
          </div>
        </section>

        <AdFooter page={page} />
        <StickyCall />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ chrome */

/** No navigation. The logo, the licence and the phone number — that is all. */
function AdHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-navy/8 bg-white/92 backdrop-blur-md">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src="/brand/logo-badge-sm.webp"
            alt={business.name}
            width={400}
            height={369}
            className="h-9 w-auto shrink-0"
          />
          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-[0.9rem] font-extrabold text-navy">
              {business.name}
            </p>
            <p className="truncate font-mono text-[0.58rem] uppercase tracking-[0.12em] text-navy/45">
              Lic. {business.license}
            </p>
          </div>
        </div>
        <a
          href={business.phoneHref}
          onClick={() => track("call", "Landing header")}
          className="hidden shrink-0 items-center gap-2 rounded-full bg-navy px-5 py-2.5 font-display text-[0.85rem] font-extrabold text-white transition-colors hover:bg-navy-soft sm:inline-flex"
        >
          <Phone className="size-4" aria-hidden="true" />
          {business.phone}
        </a>
      </div>
    </header>
  );
}

/** Phones convert on a thumb-reachable call button, not on a header link. */
function StickyCall() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-navy/95 px-4 py-2.5 backdrop-blur md:hidden">
      <div className="flex items-center gap-3">
        <a
          href={business.phoneHref}
          onClick={() => track("call", "Sticky bar")}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-orange-light to-ember font-display text-[0.9rem] font-extrabold text-white"
        >
          <Phone className="size-4" aria-hidden="true" />
          Call {business.phone}
        </a>
        <a
          href="#book"
          className="flex h-12 shrink-0 items-center rounded-full border-2 border-cyan/60 px-5 font-display text-[0.8rem] font-extrabold text-white"
        >
          Book
        </a>
      </div>
    </div>
  );
}

function AdFooter({ page }: { page: LandingPage }) {
  return (
    <footer className="border-t border-navy/8 bg-foam py-10">
      <div className="shell flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-sm font-extrabold text-navy">
            {business.name}
          </p>
          <p className="mt-1 font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.1em] text-navy/45">
            {business.street}, {business.city}, {business.state} {business.zip}
            <br />
            Lic. {business.license} · {business.hours}
          </p>
          {/* The paid service area, which is narrower than the organic one.
              Tab 3: Naples, Bonita Springs, Estero and North Naples only. */}
          {page.plan === "google-ads" && (
            <p className="mt-2 text-[0.7rem] font-semibold text-navy/55">
              Serving {adMarketLine}
              <span className="sr-only"> and {adMarkets[3]}</span>
            </p>
          )}
        </div>
        {/* min-h-11 on every one: these are thumb targets on a phone, not
            desktop footer text. */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 text-[0.72rem] font-semibold text-navy/55 sm:justify-end">
          <a
            href={business.phoneHref}
            onClick={() => track("call", "Landing footer")}
            className="inline-flex min-h-11 items-center text-blue"
          >
            {business.phone}
          </a>
          <Link href="/privacy" className="inline-flex min-h-11 items-center">
            Privacy
          </Link>
          <Link href="/terms" className="inline-flex min-h-11 items-center">
            Terms
          </Link>
          {/* One way back to the full site, at the very bottom, where it
              costs nothing. */}
          <Link href="/" className="inline-flex min-h-11 items-center">
            Main site
          </Link>
        </div>
      </div>
      <p className="shell mt-6 text-center font-mono text-[0.55rem] uppercase tracking-[0.12em] text-navy/30 sm:text-left">
        {page.platform} · {page.campaign}
      </p>
    </footer>
  );
}

/* -------------------------------------------------------------------- hero */

function Hero({ page, form }: { page: LandingPage; form: React.ReactNode }) {
  const callFirst = page.lead === "call";

  return (
    <section
      className={cn(
        "grain relative overflow-hidden text-white",
        GROUND[page.variant],
      )}
    >
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="shell relative grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="min-w-0">
          <p className="flex items-center gap-3 font-display text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-cyan">
            {page.eyebrow}
            <span className="thermal-rule inline-block h-[2px] w-10" aria-hidden="true" />
          </p>

          <h1 className="poster mt-5 text-[clamp(2.1rem,5vw,3.4rem)]">{page.h1}</h1>

          <p className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-white/80 md:text-lg">
            {page.sub}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {callFirst ? (
              <>
                <a
                  href={business.phoneHref}
                  onClick={() => track("call", "Landing hero")}
                  className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-gradient-to-b from-orange-light to-ember px-8 font-display text-[0.95rem] font-extrabold text-white shadow-[var(--shadow-orange)] ring-1 ring-inset ring-white/25 transition-transform hover:-translate-y-0.5"
                >
                  <Phone className="size-4.5" aria-hidden="true" />
                  {business.phone}
                </a>
                <ButtonLink href="#book" variant="outline" size="lg">
                  Or book online
                </ButtonLink>
              </>
            ) : (
              <>
                <ButtonLink href="#book" size="lg">
                  {page.close.title}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
                <a
                  href={business.phoneHref}
                  onClick={() => track("call", "Landing hero")}
                  className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full border-2 border-cyan/60 px-7 font-display text-[0.9rem] font-extrabold text-white transition-colors hover:bg-cyan/12"
                >
                  <Phone className="size-4" aria-hidden="true" />
                  {business.phone}
                </a>
              </>
            )}
          </div>

          {/* Tab 10: the $89 offer as a secondary CTA on the repair page. */}
          {page.variant === "repair" && (
            <Link
              href="/ac-tune-up"
              className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-white/10 py-2 pl-2 pr-4 ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/16"
            >
              <span className="rounded-full bg-gold px-2.5 py-1 font-display text-[0.72rem] font-extrabold text-navy">
                {cleanAndTune.price}
              </span>
              <span className="text-[0.82rem] font-semibold text-white/85">
                Not an emergency? Book the {cleanAndTune.name}
              </span>
              <ArrowRight className="size-3.5 shrink-0 text-cyan" aria-hidden="true" />
            </Link>
          )}

          <ul className="mt-9 grid gap-x-7 gap-y-3 border-t border-white/15 pt-6 sm:grid-cols-3">
            {page.proof.map((p) => (
              <li key={p} className="flex items-start gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden="true" />
                <span className="text-[0.85rem] font-semibold leading-snug text-white/90">
                  {p}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tab 10: a 2-field form above the fold on the repair page. The
            commercial page leads with the phone and gets the readout card
            instead; everything else puts the full form in the first screen. */}
        <div className="min-w-0">
          {page.variant === "repair" ? (
            <QuickQuote
              service="Repairs & Maintenance"
              heading="AC out? We will call you straight back."
            />
          ) : callFirst ? (
            <ResponseCard />
          ) : (
            <div className="lg:-mb-6">{form}</div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Emergency hero aside — what happens after the call connects. */
function ResponseCard() {
  return (
    <div className="glass-instrument relative overflow-hidden p-7">
      <div className="thermal-rule absolute inset-x-0 top-0 rounded-none" aria-hidden="true" />
      <p className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-cyan">
        Right now
      </p>
      <p className="poster mt-4 text-[3.4rem] leading-[0.82] text-white">
        24/7
      </p>
      <p className="mt-3 text-sm leading-relaxed text-white/75">
        A person answers and dispatches, every hour of every day — there is no
        answering service taking a message for the morning.
      </p>
      <dl className="mt-6 border-t border-white/15 pt-5">
        {[
          ["Answered by", "A person, every hour"],
          ["Dispatch", "Same day across the coast"],
          ["Price", "Flat, agreed before work starts"],
          ["Licence", business.license],
        ].map(([k, v]) => (
          <div
            key={k}
            className="flex flex-col gap-0.5 border-t border-white/10 py-2.5 first:border-t-0 first:pt-0 sm:flex-row sm:items-baseline sm:gap-4"
          >
            <dt className="font-display text-[0.55rem] font-extrabold uppercase tracking-[0.16em] text-white/50 sm:w-[6.5rem] sm:shrink-0">
              {k}
            </dt>
            <dd className="font-mono text-[0.76rem] leading-relaxed text-white/85">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ----------------------------------------------------------------- blocks */

function Steps({ page }: { page: LandingPage }) {
  return (
    <section className="border-b border-navy/8 bg-foam py-12 md:py-16">
      <div className="shell grid gap-8 md:grid-cols-3">
        {page.steps.map((s, i) => (
          <div key={s.title} className="min-w-0">
            <p className="flex items-center gap-3">
              <span className="font-mono text-[0.8rem] font-bold tabular-nums text-ember">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="h-px flex-1 bg-navy/12" aria-hidden="true" />
            </p>
            <h2 className="mt-4 font-display text-lg font-extrabold leading-tight text-navy">
              {s.title}
            </h2>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-navy/65">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Reasons({ page }: { page: LandingPage }) {
  return (
    <section className="shell py-14 md:py-18">
      <h2 className="poster max-w-2xl text-[clamp(1.6rem,3vw,2.2rem)]">
        Why this company
        <span className="text-ember">.</span>
      </h2>
      <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
        {page.reasons.map((r) => (
          <div key={r.title} className="flex min-w-0 gap-4">
            <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-xl bg-blue/10 text-blue">
              <BadgeCheck className="size-4.5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-[1.02rem] font-extrabold text-navy">
                {r.title}
              </h3>
              <p className="mt-1.5 text-[0.9rem] leading-relaxed text-navy/65">{r.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Repair page only.
 *
 * The AC Not Cooling ad group points here, and tab 10 asks for an H2 covering
 * the common causes so the ad-to-page message matches. Somebody who searched
 * "ac blowing warm air" should see those words on the page they land on.
 */
function CommonCauses() {
  const causes = [
    {
      name: "A failed capacitor",
      tell: "The outdoor fan hums but will not start, or starts if you nudge it.",
      note: "The most common single failure on this coast and an inexpensive part. Usually fixed in one visit.",
    },
    {
      name: "A dirty or iced evaporator coil",
      tell: "Air is blowing but it is barely cool, or there is ice on the line set.",
      note: "Airflow or refrigerant. The ice has to be melted before anything can be measured properly.",
    },
    {
      name: "A blocked condensate drain line",
      tell: "Water around the air handler, or the system shuts itself off.",
      note: "Extremely common in Florida humidity. A safety switch is doing its job — the fix is clearing and treating the line.",
    },
    {
      name: "Low refrigerant",
      tell: "Cools for a while, then stops. Worse on the hottest days.",
      note: "Refrigerant does not get used up, so low means a leak. Topping it up without finding the leak is money spent twice.",
    },
  ];

  return (
    <section className="shell py-14 md:py-18">
      <h2 className="poster max-w-2xl text-[clamp(1.6rem,3vw,2.2rem)]">
        AC running but not cooling? It is usually one of four things
        <span className="text-ember">.</span>
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-navy/70">
        None of these needs guessing at. A technician measures the system and
        tells you which it is, with the price, before anything is opened.
      </p>
      <ul className="mt-8 grid gap-x-10 gap-y-7 md:grid-cols-2">
        {causes.map((c, i) => (
          <li key={c.name} className="flex min-w-0 gap-4">
            <span className="mt-1 font-mono text-[0.72rem] font-bold tabular-nums text-ember">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-[1.02rem] font-extrabold text-navy">
                {c.name}
              </h3>
              <p className="mt-1.5 text-[0.9rem] font-semibold leading-relaxed text-navy/75">
                {c.tell}
              </p>
              <p className="mt-1 text-[0.88rem] leading-relaxed text-navy/60">{c.note}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Tab 10 asks for three reviews on the repair page.
 *
 * It renders what the site actually holds and no more. There is no verified
 * Google rating and no review count anywhere on this site, by design — see
 * the note in content/site.ts — so there are no stars here either. Inventing
 * them on a page bought with ad money is both a Google policy violation and
 * the kind of thing that is very hard to walk back.
 */
function Reviews() {
  if (!testimonials.length) return null;
  return (
    <section className="bg-foam py-14 md:py-18">
      <div className="shell">
        <h2 className="poster text-[clamp(1.6rem,3vw,2.2rem)]">
          What customers say
          <span className="text-ember">.</span>
        </h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t) => (
            <li
              key={t.name}
              className="relative min-w-0 rounded-card bg-white p-6 ring-1 ring-navy/10"
            >
              <span
                className="thermal-rule absolute inset-x-6 top-0 h-[2px] rounded-none"
                aria-hidden="true"
              />
              <p className="text-[0.92rem] leading-relaxed text-navy/80">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-4 font-display text-[0.82rem] font-extrabold text-navy">
                {t.name}
              </p>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-navy/45">
                {t.city}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Maintenance plan page only.
 *
 * Plan pricing is an open item on the build sheet, so there is no price on
 * this page. A made-up number on a page people enrol from is worse than no
 * number: it is the figure they will hold you to. The tiers and what each
 * covers are real; the rate is a phone call until the client sets it.
 */
function PlanTiers() {
  const tiers = [
    {
      name: "Single system",
      who: "One air handler and one condenser — most homes.",
      includes: [
        "Two visits a year, spring and autumn",
        "The full ten-point service each visit",
        "Written condition report each visit",
        "Priority scheduling in season",
        "No overtime charge on after-hours calls",
      ],
    },
    {
      name: "Multi-system",
      who: "Two or more systems at one address.",
      includes: [
        "Everything in the single-system plan, per unit",
        "One visit covering every system",
        "One report covering the whole house",
        "Per-unit rate below the single-system price",
      ],
    },
    {
      name: "Property or HOA",
      who: "Several addresses, or a board that needs reporting.",
      includes: [
        "Every unit listed, aged and photographed",
        "Visit frequency set in the agreement",
        "A response window written in, not implied",
        "One contact, one invoice, reporting a board can read",
      ],
    },
  ];

  return (
    <section className="shell py-14 md:py-18">
      <h2 className="poster max-w-2xl text-[clamp(1.6rem,3vw,2.2rem)]">
        Three plans, depending on what you have
        <span className="text-ember">.</span>
      </h2>
      <ul className="mt-8 grid gap-5 lg:grid-cols-3">
        {tiers.map((t, i) => (
          <li
            key={t.name}
            className={cn(
              "relative flex min-w-0 flex-col overflow-hidden rounded-card p-6",
              i === 0
                ? "band-navy grain text-white"
                : "bg-white ring-1 ring-navy/10",
            )}
          >
            {i === 0 && (
              <div
                className="thermal-rule absolute inset-x-0 top-0 rounded-none"
                aria-hidden="true"
              />
            )}
            <p
              className={cn(
                "font-display text-[0.6rem] font-extrabold uppercase tracking-[0.2em]",
                i === 0 ? "text-cyan" : "text-blue",
              )}
            >
              {i === 0 ? "Most homes" : `Plan ${i + 1}`}
            </p>
            <h3
              className={cn(
                "mt-3 font-display text-xl font-extrabold",
                i === 0 ? "text-white" : "text-navy",
              )}
            >
              {t.name}
            </h3>
            <p
              className={cn(
                "mt-1.5 text-[0.85rem] leading-relaxed",
                i === 0 ? "text-white/70" : "text-navy/60",
              )}
            >
              {t.who}
            </p>
            <ul className="mt-5 space-y-2.5">
              {t.includes.map((line) => (
                <li
                  key={line}
                  className={cn(
                    "flex items-start gap-2.5 text-[0.85rem] leading-snug",
                    i === 0 ? "text-white/85" : "text-navy/70",
                  )}
                >
                  <Check
                    className={cn(
                      "mt-0.5 size-3.5 shrink-0",
                      i === 0 ? "text-cyan" : "text-blue",
                    )}
                    aria-hidden="true"
                  />
                  {line}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p className="mt-7 max-w-2xl text-[0.9rem] leading-relaxed text-navy/60">
        Plan rates depend on the number of systems and are quoted on the call —
        we would rather give you the right number for your house than a
        headline price with conditions under it. The {cleanAndTune.price}{" "}
        {cleanAndTune.name} is available on its own if you would rather start
        there.
      </p>
    </section>
  );
}

/** Offer page only — the ten points, since the price is the whole pitch. */
function OfferDetail() {
  return (
    <section className="shell py-14 md:py-18">
      <div className="relative overflow-hidden rounded-card bg-navy p-8 text-white md:p-12">
        <div className="thermal-rule absolute inset-x-0 top-0 rounded-none" aria-hidden="true" />
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="min-w-0">
            <p className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-cyan">
              {cleanAndTune.name}
            </p>
            <p className="poster mt-4 text-[clamp(3rem,7vw,4.5rem)] leading-[0.8]">
              {cleanAndTune.price}
            </p>
            <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-cyan">
              {cleanAndTune.unit}
            </p>
            <ButtonLink href="#book" className="mt-7" size="lg">
              Book it
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
            {cleanAndTune.checklist.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 border-t border-white/10 py-2.5 text-[0.85rem] leading-snug text-white/80 first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
              >
                <Check className="mt-0.5 size-3.5 shrink-0 text-cyan" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Replacement page only — the number people actually decide on. */
function FinanceBlock() {
  return (
    <section className="shell py-14 md:py-18">
      <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <div className="min-w-0">
          <p className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-blue">
            Work the monthly figure
          </p>
          <h2 className="poster mt-4 text-[clamp(1.6rem,3vw,2.2rem)]">
            Decide on the month, not the sticker
            <span className="text-ember">.</span>
          </h2>
          <p className="mt-4 leading-relaxed text-navy/70">
            Move the sliders to whatever you are considering. These are
            illustrative figures, not an offer — the real terms come with the
            application, and no quote on this site depends on financing.
          </p>
          <ul className="mt-6 space-y-2.5 text-[0.88rem] text-navy/70">
            {[
              "No obligation to finance anything",
              "The installed quote is flat either way",
              "Permit, haul-away and start-up included",
            ].map((l) => (
              <li key={l} className="flex items-start gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-blue" aria-hidden="true" />
                {l}
              </li>
            ))}
          </ul>
        </div>
        <PaymentCalculator />
      </div>
    </section>
  );
}

/** Storm page only — says where, which is what the audience is segmented on. */
function StormCities() {
  const hit = stormCities;
  return (
    <section className="shell py-14 md:py-18">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div className="min-w-0">
          <p className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-ember">
            Still catching up
          </p>
          <h2 className="poster mt-4 text-[clamp(1.6rem,3vw,2.2rem)]">
            Where the work still is
            <span className="text-ember">.</span>
          </h2>
          <p className="mt-4 leading-relaxed text-navy/70">
            These are the cities where a large share of the mechanical work is
            still storm repair that never finished — units back on the
            original slab, mounts that were never rated, ductwork that got wet
            once and dried in place.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {hit.map((l) => (
            <li
              key={l.slug}
              className="min-w-0 rounded-card bg-white p-4 ring-1 ring-navy/10"
            >
              <p className="font-display text-[0.95rem] font-extrabold text-navy">
                {l.city}
              </p>
              <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-navy/45">
                {l.county} · {l.zips.slice(0, 3).join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Commercial page only — says who this is for before the pitch. */
function SectorGrid() {
  const sectors = [
    { name: "Restaurants & retail", note: "Makeup air, kitchen loads, trading-hours work", Icon: Wind },
    { name: "Medical & professional offices", note: "Humidity control and quiet operation", Icon: ShieldCheck },
    { name: "HOA & multi-building", note: "Several addresses, one agreement, one contact", Icon: BadgeCheck },
    { name: "Assisted living & senior housing", note: "Resident comfort and documented response times", Icon: Clock },
  ];
  return (
    <section className="bg-foam py-14 md:py-18">
      <div className="shell">
        <h2 className="poster text-[clamp(1.6rem,3vw,2.2rem)]">
          Who this is for
          <span className="text-ember">.</span>
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sectors.map(({ name, note, Icon }) => (
            <li key={name} className="min-w-0 rounded-card bg-white p-5 ring-1 ring-navy/10">
              <span className="grid size-10 place-items-center rounded-xl bg-blue/10 text-blue">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-4 font-display text-[0.95rem] font-extrabold leading-tight text-navy">
                {name}
              </p>
              <p className="mt-1.5 text-[0.82rem] leading-relaxed text-navy/60">{note}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-navy/55">
          Covering {locations.map((l) => l.city).join(", ")}.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ utils */

/** Preselects the form so the visitor is not re-stating what the ad promised. */
function serviceFor(page: LandingPage) {
  switch (page.variant) {
    case "repair":
    case "offer":
    case "plans":
      return "Repairs & Maintenance";
    case "replacement":
    case "storm":
      return "Mechanical Services";
    case "commercial":
      return "Commercial HVAC";
  }
}
