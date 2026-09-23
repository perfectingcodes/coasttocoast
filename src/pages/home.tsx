import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  Check,
  Phone,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import {
  bestServiceMonths,
  business,
  cleanAndTune,
  countyList,
  generalFaqs,
  googleReviews,
  locations,
  process,
  services,
  testimonials,
  whyUs,
  type Service,
} from "@/content/site";
import { Icon } from "@/components/icon";
import { Wave } from "@/components/wave";
import { Reveal } from "@/components/reveal";
import { PaymentTeaser } from "@/components/payment-teaser";
import { GoogleBadge, GoogleSeal } from "@/components/google-reviews";
import {
  ArrowLink,
  CityMarquee,
  Pill,
  SectionEyebrow,
  TrustStrip,
} from "@/components/brand";
import { SeasonScrubber } from "@/components/season-scrubber";
import { SystemAgeCard } from "@/components/system-age";
import { ServiceMap } from "@/components/service-map";
import { CtaBand } from "@/components/cta-band";
import { FaqList } from "@/components/faq-list";
import { ButtonLink } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Seo, breadcrumbNode, faqNode } from "@/lib/seo";
import { cn } from "@/lib/utils";

/** Matching flat colours, for marks that cannot carry a gradient. */
const ACCENT_TEXT: Record<Service["accent"], string> = {
  orange: "text-ember",
  cyan: "text-cyan",
  slate: "text-slateish",
  blue: "text-blue",
  gold: "text-gold",
};

const accents: Record<Service["accent"], string> = {
  orange: "bg-gradient-to-br from-orange-light to-ember",
  cyan: "bg-gradient-to-br from-cyan to-blue",
  slate: "bg-gradient-to-br from-slateish to-navy",
  blue: "bg-gradient-to-br from-blue-bright to-blue",
  gold: "bg-gradient-to-br from-gold to-orange",
};

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Seo
        title={`HVAC in Southwest Florida | ${business.name}`}
        description={`Licensed HVAC across ${business.city}, Naples, Cape Coral and all of Southwest Florida. Repair, replacement, ${cleanAndTune.price} Clean & Tune, 24/7 emergency. Call ${business.phone}.`}
        path="/"
        nodes={[
          faqNode("/", generalFaqs),
          breadcrumbNode("/", [{ name: "Home", path: "/" }]),
        ]}
      />
      <Navbar />

      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <ServicesSection />
        <CleanAndTuneSection />
        <FinancingSection />
        <WhyUsSection />
        <TestimonialsSection />
        <ServiceMap />
        <FaqSection />
        <HowItWorks />
        <CtaBand mascot />
      </main>

      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------- hero */

/**
 * Hero proof points. Every line is a promise the rest of the site already
 * makes — same-day booking, a written price before work starts, and the
 * published Clean & Tune rate — so the strip reads as the start of the job,
 * not as a list of statistics.
 */
const HERO_PROOF = [
  { v: "Same-day", k: "Appointments" },
  { v: cleanAndTune.price, k: "Clean & Tune" },
] as const;

function Hero() {
  return (
    <section className="band-azure grain grid-lines relative isolate overflow-hidden">
      <div className="shell relative grid grid-cols-1 items-center gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.98fr)] lg:gap-6 lg:pb-12 lg:pt-24">
        <span
          className="pointer-events-none absolute inset-y-24 left-[calc(50%-0.75rem)] hidden w-px bg-gradient-to-b from-transparent via-white/18 to-transparent lg:block"
          aria-hidden="true"
        />
        <div className="max-w-xl">
          {/* The divider only appears once both halves are on one line —
              wrapped, it left a pipe hanging off the end of the first line. */}
          <p className="font-display text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-white">
            Southwest Florida HVAC
            <span className="mx-3 hidden h-3 w-px align-middle sm:inline-block sm:bg-cyan/70" aria-hidden="true" />
            <span className="block text-orange-light sm:inline">Lic. {business.license}</span>
          </p>
          <div className="thermal-rule mt-5 w-20" aria-hidden="true" />

          {/* The break was after "Comfort", which left a short line over a
              long one and split the subject from its verb. Long over short
              rags better, and it drops the accent word onto its own line
              where it can carry the weight. */}
          <h1 className="poster mt-5 text-[clamp(2.7rem,5vw,4.2rem)] leading-[0.88] text-white drop-shadow-[0_4px_18px_rgb(3_18_48/0.45)]">
            Comfort lives
            <span className="mt-1 block">
              <span className="text-pop">here</span>
              <span className="text-cyan">.</span>
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-white/90">
            Home AC repair, replacement and maintenance across {countyList}{" "}
            counties. A{" "}
            <span className="font-semibold text-white">
              flat price in writing before we start
            </span>{" "}
            — and a real person answers, day or night.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <ButtonLink href="/contact" variant="primary" size="lg">
              Book Service Today
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>

            <a href={business.phoneHref} className="group flex items-center gap-2.5">
              <span className="relative">
                <img
                  src="/brand/avatar-husky.webp"
                  alt=""
                  width={256}
                  height={289}
                  className="size-11 object-contain transition-transform duration-300 group-hover:-translate-y-0.5"
                />
                <span
                  className="absolute -right-0.5 bottom-0.5 size-2.5 rounded-full bg-cyan ring-2 ring-white/80"
                  aria-hidden="true"
                />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-[0.58rem] font-extrabold uppercase tracking-[0.18em] text-orange-light">
                  A person answers · 24/7
                </span>
                <span className="block font-display text-lg font-extrabold text-white transition-colors group-hover:text-orange-light">
                  {business.phone}
                </span>
              </span>
            </a>
          </div>

          {/* What a homeowner actually wants to know before they call: how
              fast, what it costs, and who they are dealing with. Counting
              cities and counties is a map fact, not a reason to book. */}
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-4 border-t border-white/25 pt-5 sm:gap-x-6">
            <img
              src="/brand/badge-locally-owned.webp"
              alt="Locally owned and operated"
              width={640}
              height={632}
              className="size-14 shrink-0 drop-shadow-[0_8px_18px_rgb(3_18_48/0.5)] sm:size-[4.25rem]"
            />
            {/* Stacked on a phone, one divided line from `sm` up — three
                poster numerals side by side do not survive a 375px column. */}
            {/* `contents` lets the terms and definitions become cells of the
                phone grid, so the labels line up in a column instead of
                starting wherever the value above them happened to end. */}
            <dl className="grid min-w-0 flex-1 grid-cols-[max-content_1fr] items-baseline gap-x-3 gap-y-2 sm:flex sm:flex-none sm:flex-wrap sm:items-center sm:gap-x-5">
              {HERO_PROOF.map((p, i) => (
                <div key={p.k} className="contents sm:flex sm:items-center sm:gap-5">
                  {i > 0 && (
                    <span className="hidden h-8 w-px bg-white/30 sm:block" aria-hidden="true" />
                  )}
                  <div className="contents sm:block">
                    <dt className="poster text-[1.15rem] leading-none text-white sm:text-[1.35rem]">
                      {p.v}
                    </dt>
                    <dd className="font-display text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-orange-light sm:mt-1">
                      {p.k}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            {/* Social proof as a mark rather than a pill, standing in the row
                of proof beside the locally-owned seal. */}
            <span className="hidden h-9 w-px bg-white/30 xl:block" aria-hidden="true" />
            <GoogleSeal className="basis-full sm:basis-auto" />
          </div>

          <div className="mt-8 hidden items-center gap-3 lg:flex" aria-hidden="true">
            <span className="scroll-rail" />
            <span className="font-display text-[0.55rem] font-extrabold uppercase tracking-[0.22em] text-white/55">
              Scroll
            </span>
          </div>
        </div>

        <div className="relative">
          {/* Two readings a homeowner can act on, above the artwork so they
              are part of the first screen rather than something found by
              scrolling: what the season is doing to every system in the
              region, and where theirs sits against how long one lasts here. */}
          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SeasonScrubber />
            <SystemAgeCard />
          </div>

          <div className="rays-burst relative">
          {/* Warm core the rays radiate from, sitting under the artwork. */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/35 blur-[80px]"
            aria-hidden="true"
          />
          <img
            src="/brand/hero-map-mascot.webp"
            srcSet="/brand/hero-map-mascot-sm.webp 600w, /brand/hero-map-mascot.webp 1200w"
            sizes="(min-width: 1024px) 560px, 92vw"
            alt="Coast to Coast Air covers Florida coast to coast from Fort Myers, with focus markets in Naples, Estero and Bonita Springs"
            width={1200}
            height={1026}
            fetchPriority="high"
            className="mx-auto w-full max-w-md drop-shadow-[0_28px_56px_rgb(3_18_48/0.55)] xl:max-w-lg"
          />

          {/* Social proof rides on the artwork rather than in the promise
              strip: the strip is what we commit to, this is what other people
              say, and keeping them apart buys the hero a line of height. */}
          {/* Where the trucks actually leave from. */}
          <p className="mt-4 hidden text-right font-mono text-[0.62rem] uppercase tracking-[0.14em] text-white/52 lg:block">
            {business.city}, {business.state} · {business.lat.toFixed(4)}° N{" "}
            {Math.abs(business.lng).toFixed(4)}° W
          </p>
          </div>
        </div>
      </div>

      <CityMarquee className="relative border-t border-white/25 pb-4 pt-3" />
    </section>
  );
}

/* --------------------------------------------------------------- services */

function ServicesSection() {
  return (
    <section
      className="grid-lines-light relative overflow-hidden bg-white py-16 md:py-24"
      id="services"
    >
      {/* The hero's two blooms, at light-ground strength: the section is the
          warm end of the site meeting the cold end, which is the whole
          business. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-40 -top-40 size-[34rem] rounded-full bg-cyan/12 blur-[130px]" />
        <div className="absolute -bottom-48 -left-40 size-[32rem] rounded-full bg-orange/10 blur-[130px]" />
      </div>

      <div className="shell relative">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <SectionEyebrow index={1}>Our Services</SectionEyebrow>
            <h2 className="poster mt-4 text-[clamp(1.75rem,3.4vw,2.5rem)]">
              HVAC for homes
              <span className="block text-ember">&amp; businesses</span>
            </h2>
            <div className="thermal-rule mt-5 w-24" aria-hidden="true" />
          </div>
          <p className="leading-relaxed text-navy/65 md:text-lg">
            Six services, one crew, and a{" "}
            <span className="font-semibold text-navy">
              flat price in writing
            </span>{" "}
            before anything is opened. Repairs finish the same visit whenever
            the part is on the truck.
          </p>
        </div>

        {/* Bento: one tall promise panel, then the six services. */}
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <Reveal className="lg:row-span-2">
            <div className="band-navy grain edge-lit relative flex h-full flex-col overflow-hidden rounded-card p-8">
              <Pill icon={<Zap className="size-3.5 text-gold" />}>The promise</Pill>
              <h3 className="mt-6 text-3xl leading-[1.05] text-white">
                Flat price
                <span className="block text-chill">before we start.</span>
              </h3>
              <p className="mt-4 leading-relaxed text-white/70">
                A technician finds the actual fault and puts the number in
                writing before anything is opened. It does not move because the
                job ran long.
              </p>
              <ul className="mt-6 space-y-2.5">
                {[
                  "No diagnostic surprises",
                  "No overtime markup",
                  "Permits pulled on every replacement",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden="true" />
                    <span className="text-sm text-white/80">{t}</span>
                  </li>
                ))}
              </ul>
              <div className="relative z-10 mt-auto pt-8">
                <ButtonLink href={business.phoneHref} variant="onDark">
                  <Phone className="size-4" aria-hidden="true" />
                  {business.phone}
                </ButtonLink>
              </div>

              {/* He leans in from the corner the card has spare. Clipped by the
                  panel edge, so he reads as part of the card rather than as a
                  sticker dropped on it. */}
              <img
                src="/brand/mascot-bust.webp"
                srcSet="/brand/mascot-bust-sm.webp 400w, /brand/mascot-bust.webp 800w"
                sizes="200px"
                alt=""
                width={800}
                height={849}
                loading="lazy"
                className="pointer-events-none absolute -bottom-8 -right-2 hidden w-40 opacity-95 drop-shadow-[0_18px_36px_rgb(3_18_48/0.6)] sm:block lg:hidden xl:block xl:w-[9.5rem]"
              />
            </div>
          </Reveal>

          {services.filter((x) => x.featured).map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.04} className="h-full">
              <Link
                href={`/services/${s.slug}`}
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-card border border-navy/10 bg-white p-6 pt-7",
                  "transition-[background-color,border-color,transform,box-shadow] duration-300",
                  "hover:-translate-y-1 hover:border-navy hover:bg-navy hover:shadow-[var(--shadow-lift)]",
                )}
              >
                {/* Each card wears its own point on the hot-to-cold ramp, as a
                    rule across the top edge. Read as a set, the four of them
                    are the thermal rule broken into pieces. */}
                <span
                  className={cn(
                    "absolute inset-x-0 top-0 h-[3px] origin-left scale-x-[0.35] transition-transform duration-500 group-hover:scale-x-100",
                    accents[s.accent],
                  )}
                  aria-hidden="true"
                />

                {/* Index numeral, drawn as an outline so it sits behind the
                    content rather than competing with it. */}
                <span
                  className="numeral-ghost pointer-events-none absolute right-4 top-3 select-none text-[4.25rem] transition-colors duration-300 group-hover:text-white/15 sm:text-[5rem]"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="relative w-fit">
                  {/* Glow under the chip, so the icon reads as lit rather than
                      as a coloured square. */}
                  <span
                    className={cn(
                      "absolute inset-1 -z-10 rounded-xl opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-70",
                      accents[s.accent],
                    )}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      "grid size-12 place-items-center rounded-xl text-white shadow-[0_10px_20px_-10px_rgb(10_35_82/0.8)] ring-1 ring-inset ring-white/25 transition-transform duration-300 group-hover:scale-105",
                      accents[s.accent],
                    )}
                  >
                    <Icon name={s.icon} className="size-6" />
                  </span>
                </span>

                <h3 className="poster mt-6 text-xl leading-[1.05] text-navy transition-colors duration-300 group-hover:text-white">
                  {s.name}
                </h3>

                <p className="mt-3.5 flex-1 text-sm leading-relaxed text-navy/60 transition-colors duration-300 group-hover:text-white/70">
                  {s.blurb}
                </p>

                {/* One real line off the service page. Generic blurbs make six
                    cards look like one card six times; this is the part that
                    differs. */}
                <p className="mt-4 flex items-start gap-2.5 border-t border-navy/8 pt-4 transition-colors duration-300 group-hover:border-white/15">
                  <Check
                    className={cn(
                      "mt-0.5 size-4 shrink-0 transition-colors duration-300 group-hover:text-cyan",
                      ACCENT_TEXT[s.accent],
                    )}
                    aria-hidden="true"
                  />
                  <span className="text-[0.8rem] leading-snug text-navy/55 transition-colors duration-300 group-hover:text-white/60">
                    {s.bullets[0]}
                  </span>
                </p>

                <span className="link-arrow mt-5 text-blue transition-colors duration-300 group-hover:text-cyan">
                  {s.short}
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* The rest of the catalogue, still linked from the home page. */}
        <div className="mt-8 flex flex-col items-start gap-3 border-t border-navy/10 pt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
          <span className="font-display text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-navy/45">
            Also from us
          </span>
          {services
            .filter((x) => !x.featured)
            .map((x) => (
              <Link
                key={x.slug}
                href={`/services/${x.slug}`}
                className="group inline-flex min-h-9 items-center gap-2 font-display text-sm font-extrabold text-navy transition-colors hover:text-blue"
              >
                <span className={cn("size-2 rounded-full", accents[x.accent])} aria-hidden="true" />
                {x.name}
                <ArrowUpRight
                  className="size-3.5 text-blue transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            ))}
          <Link href="/services" className="link-arrow sm:ml-auto">
            All services
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- clean & tune */

/**
 * A promotion drawn as the thing it is: a ticket.
 *
 * The brand is built out of badges and plates, so the offer gets the same
 * treatment — two halves divided by a perforation, notched where the card
 * would tear, with the price struck in gold on navy. A flat panel with a
 * price on it is a price list; this is an offer.
 */
function CleanAndTuneSection() {
  // Derived, never hard-coded, so the sash cannot drift from the prices shown.
  const savings = (() => {
    const num = (v?: string) => Number((v ?? "").replace(/[^0-9.]/g, ""));
    const was = num(cleanAndTune.regularPrice);
    const now = num(cleanAndTune.price);
    return was > now ? `$${Math.round(was - now)}` : null;
  })();

  return (
    <section className="relative isolate z-10 bg-white py-16 md:py-20">
      <div className="shell">
        <div className="band-navy grain relative overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-30px_rgb(5_15_38/0.6)] ring-1 ring-white/12">
          {/* Warm light behind the price, cool light behind the checklist. */}
          <div
            className="pointer-events-none absolute -left-32 -top-40 size-[34rem] rounded-full bg-gold/20 blur-[120px]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-40 -right-32 size-[30rem] rounded-full bg-cyan/12 blur-[120px]"
            aria-hidden="true"
          />

          {savings && (
            <>
              {/* Phone: a compact corner flag. The long sash is 26rem wide —
                  on a 327px card it crossed the pill, the price and the
                  heading instead of an empty corner. */}
              <div
                className="pointer-events-none absolute -right-12 top-4 z-30 w-44 rotate-45 bg-gradient-to-r from-gold via-orange-light to-ember py-1.5 text-center shadow-[0_10px_22px_-8px_rgb(120_40_0/0.8)] ring-1 ring-white/30 sm:hidden"
                aria-hidden="true"
              >
                <span className="font-display text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-white">
                  Save {savings}
                </span>
              </div>
              {/* Desktop: the long sash that crosses both halves. */}
              <div
                className="pointer-events-none absolute -right-16 top-12 z-30 hidden w-[26rem] rotate-[38deg] bg-gradient-to-r from-gold via-orange-light to-ember py-2.5 text-center shadow-[0_14px_30px_-10px_rgb(120_40_0/0.8)] ring-1 ring-white/30 sm:block"
                aria-hidden="true"
              >
                <span className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-white">
                  Save {savings}
                </span>
              </div>
            </>
          )}

          <div className="relative grid lg:grid-cols-[minmax(0,0.94fr)_auto_minmax(0,1.06fr)]">
            {/* ---------------------------------------------- the offer */}
            <div className="px-6 pb-10 pt-10 md:px-10 md:pb-12 md:pt-12 lg:py-14">
              <span className="pill pill-dark border-gold/40 bg-gold/12 text-gold">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Limited-time offer
              </span>

              <div className="mt-6 flex items-end gap-3">
                <span className="poster text-bullion text-[clamp(4rem,10vw,6.5rem)] leading-[0.78] drop-shadow-[0_10px_30px_rgb(255_140_20/0.28)]">
                  {cleanAndTune.price}
                </span>
                <span className="pb-3 font-display text-sm font-bold text-white/55">
                  {cleanAndTune.unit}
                </span>
                {cleanAndTune.regularPrice && (
                  <span className="pb-3.5 font-display text-lg font-bold text-white/55 line-through decoration-ember/70 decoration-2">
                    {cleanAndTune.regularPrice}
                  </span>
                )}
              </div>

              <h2 className="poster mt-3 text-[clamp(1.75rem,3.4vw,2.5rem)] text-white">
                {cleanAndTune.name}
              </h2>
              <div className="thermal-rule mt-5 w-24" aria-hidden="true" />
              <p className="mt-5 max-w-md leading-relaxed text-white/70">
                {cleanAndTune.summary}
              </p>

              {/* Which months, taken off the same seasonal table the hero
                  reads. The shoulder months either side of the heat are the
                  answer to "when should I book it?". */}
              {bestServiceMonths.length === 2 && (
                <p className="mt-5 flex items-start gap-2.5 text-sm leading-relaxed text-white/72">
                  <CalendarCheck
                    className="mt-0.5 size-4 shrink-0 text-cyan"
                    aria-hidden="true"
                  />
                  <span>
                    Best booked in{" "}
                    <span className="font-semibold text-white">
                      {bestServiceMonths[0]}
                    </span>{" "}
                    or{" "}
                    <span className="font-semibold text-white">
                      {bestServiceMonths[1]}
                    </span>{" "}
                    — the two months either side of the heat.
                  </span>
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <ButtonLink href="/contact" size="lg">
                  Book a Clean &amp; Tune
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
                <a
                  href={business.phoneHref}
                  className="flex min-h-11 items-center font-display text-sm font-extrabold text-white/75 underline decoration-white/25 underline-offset-4 transition-colors hover:text-cyan hover:decoration-cyan"
                >
                  or call {business.phone}
                </a>
              </div>

              <p className="mt-8 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/48">
                10 points · twice a year · {locations.length} cities
              </p>
            </div>

            <Perforation />

            {/* ------------------------------------------- the checklist */}
            <div className="px-6 pb-10 pt-9 md:px-10 md:pb-12 md:pt-10 lg:py-14 lg:pl-12">
              <p className="font-display text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-cyan">
                Every visit · all ten points
              </p>
              <ol className="mt-6 grid gap-x-8 sm:grid-cols-2">
                {cleanAndTune.checklist.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 border-t border-white/10 py-3 first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
                  >
                    <span className="mt-px font-mono text-[0.7rem] font-semibold tabular-nums text-cyan/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-relaxed text-white/80">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The tear line. A dashed rule with a notch bitten out of the card at each
 * end — vertical between the two halves on a wide screen, horizontal between
 * them when they stack. The notches are discs in the page's own white,
 * clipped in half by the card's `overflow-hidden`.
 */
function Perforation() {
  const notch =
    "absolute size-8 rounded-full bg-white";
  return (
    <div className="relative lg:w-px" aria-hidden="true">
      {/* Stacked: a horizontal tear. */}
      <span className="absolute inset-x-6 top-0 h-px -translate-y-1/2 bg-[repeating-linear-gradient(90deg,rgb(255_255_255/0.3)_0_6px,transparent_6px_14px)] md:inset-x-10 lg:hidden" />
      <span className={cn(notch, "left-0 top-0 -translate-x-1/2 -translate-y-1/2 lg:hidden")} />
      <span className={cn(notch, "left-full top-0 -translate-x-1/2 -translate-y-1/2 lg:hidden")} />

      {/* Side by side: a vertical tear. */}
      <span className="absolute inset-y-12 left-1/2 hidden w-px -translate-x-1/2 bg-[repeating-linear-gradient(180deg,rgb(255_255_255/0.3)_0_6px,transparent_6px_14px)] lg:block" />
      <span className={cn(notch, "left-1/2 top-0 hidden -translate-x-1/2 -translate-y-1/2 lg:block")} />
      <span className={cn(notch, "left-1/2 top-full hidden -translate-x-1/2 -translate-y-1/2 lg:block")} />
    </div>
  );
}

/* ----------------------------------------------------------------- why us */

/**
 * Why us.
 *
 * Every previous version was a photograph on the left and a list of bullets on
 * the right, which is the most template-shaped layout there is. This one is
 * built around its own sentence: the statement runs at display size across the
 * space, the seal sits up with the heading as the mark that backs it, and the
 * four reasons run as a wide band of columns underneath rather than as a stack
 * of rows beside a picture.
 *
 * It was also the one band on the page with no warmth in it at all — navy and
 * cyan throughout — so the ember accents that carry the rest of the site come
 * back here.
 */
function WhyUsSection() {
  return (
    <section className="band-navy grain grid-lines relative overflow-hidden">
      <Wave fill="white" swell="#2bd9ff" flip height={56} className="relative -mt-px" />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -bottom-40 -left-32 size-[34rem] rounded-full bg-orange/12 blur-[130px]" />
        <div className="absolute -right-32 top-0 size-[30rem] rounded-full bg-cyan/12 blur-[130px]" />
      </div>

      <div className="shell relative py-14 md:py-20">
        {/* ------------------------------------------------- heading + seal */}
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
          <div>
            <SectionEyebrow index={3} className="text-cyan">
              Why Coast to Coast
            </SectionEyebrow>
            <h2 className="poster mt-4 text-[clamp(2rem,4.6vw,3.25rem)] text-white">
              Built on
              <span className="block text-chill">second opinions.</span>
            </h2>
          </div>

          <div className="relative shrink-0">
            <span
              className="absolute inset-4 -z-10 rounded-full bg-cyan/25 blur-2xl"
              aria-hidden="true"
            />
            <img
              src="/brand/badge-locally-owned.webp"
              alt="Locally owned and operated"
              width={640}
              height={632}
              loading="lazy"
              className="w-28 drop-shadow-[0_16px_32px_rgb(3_12_32/0.9)] sm:w-36 lg:w-[9.5rem]"
            />
          </div>
        </div>

        <div className="thermal-rule mt-10 w-full opacity-70" aria-hidden="true" />

        {/* -------------------------------------------- statement + picture */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-14">
          <div>
            <p className="font-display text-[0.62rem] font-extrabold uppercase tracking-[0.24em] text-ember">
              How the work starts
            </p>
            <p className="mt-5 font-display text-[clamp(1.4rem,2.6vw,2rem)] font-extrabold leading-[1.22] text-white">
              Most of our work starts as somebody else&rsquo;s quote. We find the
              actual fault,{" "}
              <span className="text-chill">put a price in writing</span>, and let
              you decide what happens next.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <ArrowLink href="/about" className="text-cyan">
                About the company
              </ArrowLink>
              <a
                href={business.phoneHref}
                className="flex min-h-11 items-center gap-2 font-display text-sm font-extrabold text-white/70 transition-colors hover:text-white"
              >
                <Phone className="size-4 text-ember" aria-hidden="true" />
                {business.phone}
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
            {/* Registration marks, the way a plate is positioned on a press
                sheet. */}
            <span
              className="pointer-events-none absolute -left-3 -top-3 size-6 border-l border-t border-ember/50"
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute -bottom-3 -right-3 size-6 border-b border-r border-ember/50"
              aria-hidden="true"
            />

            <img
              src="/brand/photo-home.webp"
              srcSet="/brand/photo-home-700.webp 700w, /brand/photo-home.webp 1100w"
              sizes="(min-width: 1024px) 420px, 82vw"
              alt="A Southwest Florida home with a shaded porch and palms"
              width={1100}
              height={1375}
              loading="lazy"
              className="aspect-[5/4] w-full rounded-card object-cover object-[50%_64%] shadow-[0_30px_60px_-20px_rgb(3_12_32/0.9)] ring-1 ring-white/15"
            />

            {/* The licence, stated on the picture rather than under it. */}
            <div className="absolute bottom-4 left-4 rounded-xl bg-navy-deep/85 px-3.5 py-2 ring-1 ring-white/20 backdrop-blur-sm">
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-white/50">
                FL Mechanical
              </p>
              <p className="font-mono text-[0.72rem] font-semibold tracking-[0.08em] text-white">
                #{business.license}
              </p>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------- the four */}
        <ul className="mt-14 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((w, i) => (
            <li key={w.title} className="group relative pt-5">
              <span
                className="absolute inset-x-0 top-0 h-px bg-white/15"
                aria-hidden="true"
              />
              {/* Short ember segment on the rule: the tick that says this
                  column starts here. */}
              <span
                className="absolute left-0 top-0 h-px w-10 bg-ember transition-all duration-500 group-hover:w-20"
                aria-hidden="true"
              />

              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[0.7rem] tabular-nums text-ember">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="whitespace-nowrap font-mono text-[0.6rem] uppercase tracking-[0.12em] text-white/52">
                  {w.tag}
                </span>
              </div>

              <h3 className="mt-3 font-display text-base font-extrabold leading-tight text-white">
                {w.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/72">
                {w.body}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-12 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-white/58">
          {business.city}, {business.state} · Licensed &amp; insured ·
          Certificates on request
        </p>
      </div>

      <Wave fill="white" height={56} className="relative -mb-px" />
    </section>
  );
}

/**
 * Reviews.
 *
 * A grid of equal cards is a testimonial widget; three of them staggered is
 * the same widget tilted. This is an editorial spread instead — one review at
 * display size carrying the section, and the others as a list you can move
 * between, which is the same "pick from the list, the panel answers" pattern
 * the coverage map uses. Reading a review should feel like reading, not like
 * scanning a row of boxes.
 *
 * No stars. A five-star row under a quote is a rating, and there is no rating
 * attached to any of these quotes — see the note in content/site.ts. They are
 * drawn only when a real one is supplied.
 */
function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  return (
    <section className="grid-lines-light relative overflow-hidden bg-foam py-16 md:py-20">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-40 top-0 size-[32rem] rounded-full bg-orange/10 blur-[130px]" />
        <div className="absolute -bottom-40 -right-32 size-[30rem] rounded-full bg-cyan/12 blur-[130px]" />
      </div>

      <div className="shell relative">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <div>
            <SectionEyebrow index={4}>Reviews</SectionEyebrow>
            <h2 className="poster mt-4 text-[clamp(2rem,4.4vw,3.1rem)]">
              Real people.
              <span className="block text-ember">Real comfort.</span>
            </h2>
          </div>
          <GoogleBadge />
        </div>

        <div className="thermal-rule mt-8 w-full opacity-60" aria-hidden="true" />

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.9fr)] lg:items-stretch">
          {/* ------------------------------------------- the one you read */}
          <figure className="band-ocean grain relative flex flex-col overflow-hidden rounded-[1.75rem] p-8 shadow-[0_34px_70px_-30px_rgb(5_15_38/0.65)] ring-1 ring-white/15 md:p-11">
            <div
              className="pointer-events-none absolute -right-24 -top-28 size-[26rem] rounded-full bg-cyan/14 blur-[110px]"
              aria-hidden="true"
            />

            {/* The opening mark, set as type at a size that makes it part of
                the composition rather than an icon in a corner. */}
            <span
              className="poster pointer-events-none select-none text-[5.5rem] leading-[0.5] text-orange-light md:text-[7rem]"
              aria-hidden="true"
            >
              &ldquo;
            </span>

            {t.rating && (
              <div
                className="relative mt-2 flex gap-1"
                aria-label={`Rated ${t.rating} out of 5`}
              >
                {Array.from({ length: 5 }, (_, n) => (
                  <Star
                    key={n}
                    className={cn(
                      "size-5",
                      n < t.rating! ? "fill-gold text-gold" : "text-white/25",
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
            )}

            <blockquote
              key={t.name}
              className="relative mt-4 flex-1 font-display text-[clamp(1.25rem,2.3vw,1.75rem)] font-extrabold leading-[1.32] text-white"
            >
              {t.quote}
            </blockquote>

            <figcaption className="relative mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-white/15 pt-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/12 font-display text-sm font-extrabold text-white ring-1 ring-white/25">
                {t.name.charAt(0)}
              </span>
              <span className="leading-tight">
                <span className="block font-display text-base font-extrabold text-white">
                  {t.name}
                </span>
                <span className="block font-mono text-[0.64rem] uppercase tracking-[0.12em] text-white/58">
                  {t.city}
                </span>
              </span>
              <span className="ml-auto font-mono text-[0.64rem] uppercase tracking-[0.14em] text-white/45">
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(testimonials.length).padStart(2, "0")}
              </span>
            </figcaption>
          </figure>

          {/* ------------------------------------------------ the others */}
          <div className="flex flex-col gap-5">
            <ul className="grid gap-2.5">
              {testimonials.map((r, i) => (
                <li key={r.name}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-pressed={i === active}
                    className={cn(
                      "group flex w-full items-center gap-3.5 rounded-card px-4 py-3.5 text-left transition-[background-color,box-shadow,transform] duration-300",
                      i === active
                        ? "bg-white shadow-[var(--shadow-soft)] ring-1 ring-navy/10"
                        : "bg-white/55 ring-1 ring-navy/8 hover:bg-white hover:shadow-[var(--shadow-soft)]",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-full font-display text-xs font-extrabold transition-colors duration-300",
                        i === active
                          ? "bg-gradient-to-br from-blue-bright to-blue text-white"
                          : "bg-navy/8 text-navy/55 group-hover:bg-navy/12",
                      )}
                    >
                      {r.name.charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block font-display text-sm font-extrabold text-navy">
                        {r.name}
                      </span>
                      <span className="block truncate font-mono text-[0.6rem] uppercase tracking-[0.1em] text-navy/45">
                        {r.city}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "h-[3px] w-6 shrink-0 rounded-full transition-all duration-300",
                        i === active
                          ? "bg-ember"
                          : "bg-navy/12 group-hover:w-9 group-hover:bg-ember/50",
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </li>
              ))}
            </ul>

            {/* The invitation, with the mascot's head over the top edge. */}
            <div className="card relative mt-14 flex flex-1 flex-col justify-center px-6 pb-6 pt-[5.25rem] text-center">
              <img
                src="/brand/mascot-bust.webp"
                srcSet="/brand/mascot-bust-sm.webp 400w, /brand/mascot-bust.webp 800w"
                sizes="140px"
                alt=""
                width={800}
                height={849}
                loading="lazy"
                className="pointer-events-none absolute -top-[4.25rem] left-1/2 w-[8.25rem] -translate-x-1/2 drop-shadow-[0_16px_30px_rgb(10_35_82/0.35)]"
              />
              <p className="font-display text-base font-extrabold text-navy">
                Worked with us?
              </p>
              <p className="mx-auto mt-1.5 max-w-[15rem] text-sm leading-relaxed text-navy/62">
                A minute of your time helps your neighbours choose.
              </p>
              <div className="mt-5 grid gap-2.5">
                <ButtonLink href={googleReviews.reviewUrl} size="sm">
                  Leave a review
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href={googleReviews.profileUrl} variant="ghost" size="sm">
                  Read reviews
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- financing */

/** A replacement is the big-ticket decision on this page, so the number that
 *  actually governs it gets a section rather than a footnote. */
function FinancingSection() {
  return (
    <section className="bg-foam py-14 md:py-20">
      <div className="shell">
        <PaymentTeaser />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- faq */

/**
 * Answers before you call.
 *
 * Nine questions grouped into three headings rather than six in a flat stack:
 * at that length a list needs an index, and the groups are the three things a
 * homeowner is actually deciding between — whether we cover them, what it
 * costs, and what happens to the equipment.
 *
 * The heading column stays put while the questions scroll past it, and the
 * card at its foot is the fallback for whatever the list did not answer.
 */
function FaqSection() {
  return (
    <section className="grid-lines-light relative overflow-hidden bg-white py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-40 top-10 size-[32rem] rounded-full bg-cyan/12 blur-[130px]" />
        <div className="absolute -bottom-40 -left-32 size-[28rem] rounded-full bg-orange/10 blur-[130px]" />
      </div>

      <div className="shell relative grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionEyebrow index={6}>Common questions</SectionEyebrow>
          <h2 className="poster mt-4 text-[clamp(1.9rem,4.2vw,2.9rem)]">
            Answers
            <span className="block text-ember">before you call.</span>
          </h2>
          <div className="thermal-rule mt-6 w-24" aria-hidden="true" />

          {/* The fallback, with the mascot's head over its top edge — the same
              move the reviews card makes, at a quarter of the size. */}
          <div className="card relative mt-14 p-6 pt-12">
            <img
              src="/brand/avatar-husky.webp"
              alt=""
              width={256}
              height={289}
              loading="lazy"
              className="pointer-events-none absolute -top-9 left-6 size-[4.5rem] object-contain drop-shadow-[0_12px_24px_rgb(10_35_82/0.3)]"
            />
            <p className="font-display text-base font-extrabold text-navy">
              Still have a question?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-navy/65">
              Ask Coast in the corner searches these answers, or talk to
              somebody who actually works here.
            </p>
            <a
              href={business.phoneHref}
              className="mt-4 flex min-h-11 items-center gap-2 font-display text-base font-extrabold text-blue transition-colors hover:text-navy"
            >
              <Phone className="size-4 text-ember" aria-hidden="true" />
              {business.phone}
            </a>
            <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-navy/45">
              {business.emergency}
            </p>
          </div>
        </div>

        <FaqList faqs={generalFaqs} className="mt-0" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ how it works */

/**
 * What happens after you call. Sits after the FAQ: by that point a visitor has
 * their questions answered and wants to know what actually follows. Laid out
 * along a single gradient track rather than four equal boxes, which is the
 * shape that reads as filler.
 */
/**
 * Four accent stops taken off the brand's thermal rule: the run starts hot
 * where the customer is (a house that will not cool) and ends cold where the
 * job does. Each badge borrows the colour of the point it sits at.
 */
const STEP_ACCENT = ["#ff6a13", "#ffb020", "#2bd9ff", "#5cb4ff"] as const;

/** Softens both ends of the desktop rail so it reads as a run, not a bar. */
const RAIL_FADE =
  "linear-gradient(90deg, transparent 0%, black 9%, black 91%, transparent 100%)";

/**
 * The four steps, as a run you can move along.
 *
 * The rail is not decoration: it fills from the first badge to whichever step
 * is being pointed at, so the section behaves like the job it describes —
 * hover the third badge and the line has travelled three quarters of the way.
 * Nothing is hidden behind the interaction; all four steps are always legible,
 * and the rail only says where you are in them.
 *
 * It sits on the site's blue rather than on the near-black it used to, so the
 * band belongs to the same page as everything above it.
 */
function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section className="band-navy grain grid-lines relative overflow-hidden py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-32 top-1/3 size-[34rem] rounded-full bg-orange/14 blur-[130px]" />
        <div className="absolute -right-32 top-1/4 size-[34rem] rounded-full bg-cyan/14 blur-[130px]" />
      </div>

      <div className="shell relative">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-5">
          <div className="max-w-xl">
            <SectionEyebrow index={7} className="text-cyan">
              What happens next
            </SectionEyebrow>
            <h2 className="poster mt-4 text-[clamp(1.9rem,4vw,2.9rem)] text-white">
              From your call to
              <span className="block text-chill">cold air, in four.</span>
            </h2>
          </div>

          {/* Where you are in the run, in words, for anyone not using a
              pointer. */}
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-white/55">
            Step {String(active + 1).padStart(2, "0")} / 04 ·{" "}
            <span className="text-white">{process[active].title}</span>
          </p>
        </div>

        <ol
          className="relative mt-12 grid lg:mt-20 lg:grid-cols-4 lg:gap-x-6"
          onMouseLeave={() => setActive(0)}
        >
          {/* Desktop rail. The track is dim; the run fills over it to the
              active badge. Ends land on the first and last badge centres. */}
          <span
            className="pointer-events-none absolute inset-x-[11.5%] top-20 hidden h-[3px] rounded-full bg-white/15 lg:block"
            style={{ maskImage: RAIL_FADE, WebkitMaskImage: RAIL_FADE }}
            aria-hidden="true"
          />
          <span
            className="thermal-rule pointer-events-none absolute left-[11.5%] top-20 hidden origin-left transition-[width] duration-700 ease-out lg:block"
            style={{ width: `calc(77% * ${active / (process.length - 1)})` }}
            aria-hidden="true"
          />

          {process.map((step, i) => {
            const accent = STEP_ACCENT[i];
            const next = STEP_ACCENT[i + 1];
            const on = i <= active;
            return (
              <li
                key={step.title}
                className="group relative flex gap-5 pb-10 last:pb-0 lg:block lg:pb-0 lg:text-center"
              >
                {/* Phone rail: one segment per gap, each carrying the slice of
                    the ramp between its two steps so the run stays continuous. */}
                {next && (
                  <span
                    className="pointer-events-none absolute bottom-0 left-12 top-12 w-[3px] -translate-x-1/2 rounded-full lg:hidden"
                    style={{ background: `linear-gradient(180deg, ${accent}, ${next})` }}
                    aria-hidden="true"
                  />
                )}

                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-current={i === active ? "step" : undefined}
                  className="relative z-10 w-24 shrink-0 cursor-pointer rounded-full outline-none ring-offset-4 ring-offset-transparent focus-visible:ring-2 focus-visible:ring-cyan lg:mx-auto lg:block lg:w-40"
                >
                  <span className="sr-only">
                    Step {i + 1}: {step.title}
                  </span>
                  <span
                    className={cn(
                      "absolute inset-[12%] -z-10 rounded-full opacity-80 blur-2xl transition-opacity duration-500",
                      !on && "lg:opacity-[0.28]",
                    )}
                    style={{ background: accent }}
                    aria-hidden="true"
                  />
                  {/* Station halo, just outside the ring of the artwork. */}
                  <span
                    className={cn(
                      "absolute rounded-full border opacity-70 transition-all duration-500",
                      i === active
                        ? "inset-[2%] lg:opacity-90"
                        : "inset-[7%] lg:opacity-25",
                    )}
                    style={{ borderColor: accent }}
                    aria-hidden="true"
                  />
                  <img
                    src={`/brand/${step.image}.webp`}
                    alt=""
                    width={480}
                    height={480}
                    loading="lazy"
                    className={cn(
                      "w-full drop-shadow-[0_18px_34px_rgb(3_10_28/0.75)] transition-[transform,filter] duration-500",
                      i === active
                        ? "lg:-translate-y-2"
                        : "lg:opacity-85 lg:saturate-[0.72]",
                    )}
                  />
                </button>

                <div className="min-w-0 pt-1 lg:mt-6 lg:pt-0">
                  <p
                    className={cn(
                      "font-display text-[0.68rem] font-extrabold uppercase tracking-[0.3em] transition-opacity duration-500",
                      !on && "lg:opacity-60",
                    )}
                    style={{ color: accent }}
                  >
                    Step {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-extrabold leading-tight text-white lg:mt-3 lg:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/72 lg:mx-auto lg:mt-3 lg:max-w-[17rem]">
                    {step.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <p
          data-answer=""
          className="mt-14 max-w-3xl border-t border-white/12 pt-7 text-sm leading-relaxed text-white/58"
        >
          {business.name} is a licensed, insured HVAC contractor in{" "}
          {business.city}, Florida, serving {locations.length} cities across{" "}
          {countyList} counties under Florida Mechanical Contractor licence #
          {business.license}.
        </p>
      </div>
    </section>
  );
}
