import { useState } from "react";
import { Link } from "wouter";
import {
  Clock,
  ArrowRight,
  ArrowUpRight,
  Check,
  Phone,
  Zap,
} from "lucide-react";
import {
  business,
  segments,
  countyList,
  generalFaqs,
  locations,
  process,
  services,
  whyUs,
  type Service,
} from "@/content/site";
import { Icon } from "@/components/icon";
import { Wave } from "@/components/wave";
import { Reveal } from "@/components/reveal";
import { GoogleSeal } from "@/components/google-reviews";
import {
  CityMarquee,
  Pill,
  SectionEyebrow,
  TrustStrip,
} from "@/components/brand";
import { SeasonScrubber } from "@/components/season-scrubber";
import { SystemAgeCard } from "@/components/system-age";
import { AssetSheet } from "@/components/asset-sheet";
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
        title={`Commercial & Mechanical HVAC | ${business.name}`}
        description={`Commercial and mechanical HVAC across ${countyList} counties — rooftop units, air handlers, ductwork and service agreements with a written response window. Licensed ${business.license}. Call ${business.phone}.`}
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
        {/* Ordered as an argument, and so that no two dark bands touch: what
            we do, how we start, who it is for, how it runs, the questions,
            where. */}
        <ServicesSection />
        <WhyUsSection />
        <SegmentsSection />
        <HowItWorks />
        <FaqSection />
        <ServiceMap />
        <CtaBand mascot />
      </main>

      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------- hero */

/**
 * Hero proof points. What somebody who answers to an owner or a board checks
 * before they pick up the phone: is the line actually answered, and can this
 * contractor produce the paperwork.
 */
const HERO_PROOF = [
  { v: "24/7", k: "Answered live" },
  { v: "COI", k: "On request" },
] as const;

function Hero() {
  return (
    <section className="band-azure grain grid-lines relative isolate overflow-hidden">
      {/* Only where the copy sits: the same teal, deeper, so white body copy
          clears AA without the band losing its brightness anywhere else. */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(104deg, rgb(6 86 122 / 0.78) 0%, rgb(7 102 142 / 0.5) 34%, transparent 62%)",
        }}
      />

      <div className="shell relative grid grid-cols-1 items-center gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.98fr)] lg:items-start lg:gap-8 lg:pb-10 lg:pt-20">
        <span
          className="pointer-events-none absolute inset-y-24 left-[calc(50%-0.75rem)] hidden w-px bg-gradient-to-b from-transparent via-white/18 to-transparent lg:block"
          aria-hidden="true"
        />
        <div className="max-w-xl">
          {/* The divider only appears once both halves are on one line —
              wrapped, it left a pipe hanging off the end of the first line. */}
          <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white">
            Commercial &amp; Mechanical HVAC
            <span className="mx-3 hidden h-3 w-px align-middle sm:inline-block sm:bg-cyan/70" aria-hidden="true" />
            <span className="block text-orange-light sm:inline">Lic. {business.license}</span>
          </p>
          <div className="thermal-rule mt-5 w-20" aria-hidden="true" />

          {/* A homeowner is buying comfort. A facility manager is buying the
              absence of a problem, so the headline names what goes wrong
              rather than what goes right. Long line over short rags better
              and drops the accent onto its own line. */}
          <h1 className="poster mt-5 text-[clamp(2.3rem,4.4vw,3.6rem)] leading-[1.02] text-white drop-shadow-[0_4px_18px_rgb(3_18_48/0.45)]">
            When it goes down,
            <span className="block">
              <span className="text-pop">business stops</span>
              <span className="text-cyan">.</span>
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-white/90">
            Mechanical and commercial HVAC across {countyList} counties —
            rooftop units, air handlers, ductwork and controls. Service
            agreements with a{" "}
            <span className="font-semibold text-white">
              response window written in, not implied
            </span>
            , and every unit on your site documented.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <ButtonLink href="/contact" variant="primary" size="lg">
              Book an equipment walk
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
                <span className="block font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-orange-light">
                  A person answers · 24/7
                </span>
                <span className="block font-display text-lg font-extrabold text-white transition-colors group-hover:text-orange-light">
                  {business.phone}
                </span>
              </span>
            </a>
          </div>

          {/* The paperwork questions, answered before they are asked. */}
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
                    <dd className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-orange-light sm:mt-1">
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

        </div>

        <div className="relative">
          {/* Two readings a building owner can act on, above and below the
              artwork: what the season is doing to every system in the region
              — which is also when planned work is cheapest to schedule — and
              where their equipment sits against how long it lasts here. */}
          <SeasonScrubber className="relative z-10 mb-3 sm:mb-0 sm:w-[76%]" />

          <div className="rays-burst relative sm:-mt-4 lg:-mt-8">
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

          </div>

          {/* The second reading sits under the graphic rather than stacked on
              top of it, so the artwork has a card at each end. */}
          <SystemAgeCard className="relative z-10 mt-3 sm:ml-auto sm:mt-0 sm:w-[58%] lg:-mt-4" />
        </div>
      </div>

      {/* Title block. A drawing is signed along its bottom edge; this band had
          two loose marks at opposite corners instead — the scroll cue and the
          shop's coordinates. One rule, three entries. */}
      <div className="shell relative hidden border-t border-white/20 pb-5 pt-4 lg:block">
        <div className="flex items-center justify-between gap-8">
          <span className="flex items-center gap-3" aria-hidden="true">
            <span className="scroll-rail" />
            <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white/55">
              Scroll
            </span>
          </span>

          <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-white/45">
            Lic. {business.license} · {business.emergency}
          </span>

          <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-white/45">
            {business.city}, {business.state} · {business.lat.toFixed(4)}° N{" "}
            {Math.abs(business.lng).toFixed(4)}° W
          </span>
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
            <SectionEyebrow index={1}>What we do</SectionEyebrow>
            <h2 className="poster mt-4 text-[clamp(1.75rem,3.4vw,2.6rem)]">
              Mechanical systems,
              <span className="block text-ember">serviced and built.</span>
            </h2>
            <div className="thermal-rule mt-5 w-24" aria-hidden="true" />
          </div>
          <p className="leading-relaxed text-navy/65 md:text-lg">
            Rooftop units, air handlers, ductwork and controls — maintained
            under agreement, repaired fast when they fail, and installed to
            code when they are new. All of it under{" "}
            <span className="font-semibold text-navy">
              mechanical licence {business.license}
            </span>
            .
          </p>
        </div>

        {/* Bento: one tall promise panel, then the six services. */}
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <Reveal className="lg:row-span-2">
            <div className="band-navy grain edge-lit relative flex h-full flex-col overflow-hidden rounded-card p-8">
              <Pill icon={<Zap className="size-3.5 text-gold" />} className="relative">
                The agreement
              </Pill>
              <h3 className="mt-6 text-3xl leading-[1.08] text-white">
                A response window
                <span className="block text-chill">in writing.</span>
              </h3>
              <p className="mt-4 leading-relaxed text-white/70">
                A service agreement names the visit frequency, what each visit
                covers, and the window we answer a breakdown in. That last
                part is the one you can hold a contractor to.
              </p>
              <ul className="mt-6 space-y-2.5">
                {[
                  "Every unit on site documented",
                  "No overtime charge on agreement calls",
                  "Permits pulled, inspections met",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden="true" />
                    <span className="text-sm text-white/80">{t}</span>
                  </li>
                ))}
              </ul>
              {/* The one photograph in the library that is unmistakably this
                  company's equipment. The previous image here was a European
                  heat pump carrying another manufacturer's name. */}
              <div className="relative z-10 mt-8 overflow-hidden rounded-xl ring-1 ring-white/15">
                <img
                  src="/brand/photo-condenser.webp"
                  srcSet="/brand/photo-condenser-640.webp 640w, /brand/photo-condenser.webp 1024w"
                  sizes="(min-width: 1280px) 340px, 90vw"
                  alt="A Coast to Coast Air unit in Southwest Florida"
                  width={1024}
                  height={688}
                  loading="lazy"
                  className="h-28 w-full object-cover object-[50%_45%] xl:h-32"
                />
              </div>

              <div className="relative z-10 mt-6 flex flex-wrap gap-2.5">
                <ButtonLink href="/contact" variant="onDark">
                  Book an equipment walk
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
          <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-navy/45">
            Residential
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

/**
 * Who this business is for, now that it leads with mechanical work.
 *
 * Six segments rather than one "commercial" claim, because what a restaurant
 * needs is nothing like what an HOA board needs and a page that addresses
 * both addresses neither. Each card names the buyer, what is actually broken
 * for them, and the sales cycle — which is the number that stops anyone
 * expecting commercial work to close like a same-day repair.
 */
function SegmentsSection() {
  return (
    <section className="relative isolate overflow-hidden bg-white py-16 md:py-20">
      <div className="grid-lines-light pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="shell relative">
        <SectionEyebrow index={3}>Who we work with</SectionEyebrow>
        <h2 className="poster mt-4 max-w-3xl text-[clamp(1.9rem,3.8vw,2.9rem)]">
          Six kinds of building, six different problems
          <span className="text-ember">.</span>
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-navy/70">
          Commercial work is not residential work at a larger scale. Each of
          these buys differently, on a different cycle, for a different
          reason — so we have said what the cycle actually is rather than
          implying everything closes this week.
        </p>

        <ul className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {segments.map((seg, i) => (
            <li
              key={seg.slug}
              className="group relative flex min-w-0 flex-col overflow-hidden rounded-card bg-white p-6 ring-1 ring-navy/10 transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-22px_rgb(7_26_61/0.5)] hover:ring-blue/35"
            >
              <span
                className="absolute inset-x-6 top-0 h-[3px] rounded-b-full bg-gradient-to-r from-cyan to-blue opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
              <p className="flex items-baseline gap-3">
                <span className="font-mono text-[0.7rem] font-bold tabular-nums text-ember">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-[1.05rem] font-extrabold leading-tight text-navy">
                  {seg.name}
                </span>
              </p>
              <p className="mt-1 pl-8 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-blue">
                {seg.buyer}
              </p>

              <p className="mt-4 text-[0.9rem] leading-relaxed text-navy/70">
                {seg.pain}
              </p>
              <p className="mt-3 border-t border-navy/10 pt-3 text-[0.9rem] leading-relaxed text-navy/80">
                {seg.offer}
              </p>

              <p className="mt-4 flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-navy/40">
                <Clock className="size-3 shrink-0" aria-hidden="true" />
                {seg.cycle}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <ButtonLink href="/contact" size="lg">
            Book an equipment walk
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
          <p className="max-w-sm text-[0.85rem] leading-relaxed text-navy/55">
            Every unit listed, aged and photographed, with filter and belt
            sizes on file. Most buildings do not have this. No charge and no
            obligation to put us on an agreement.
          </p>
        </div>
      </div>
    </section>
  );
}

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
            <SectionEyebrow index={2} className="text-cyan">
              How we start
            </SectionEyebrow>
            <h2 className="poster mt-4 text-[clamp(2rem,4.4vw,3.1rem)] text-white">
              The first thing we build
              <span className="block text-chill">is the record.</span>
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
              className="w-24 drop-shadow-[0_16px_32px_rgb(3_12_32/0.9)] sm:w-32 lg:w-[8.5rem]"
            />
          </div>
        </div>

        <div className="thermal-rule mt-10 w-full opacity-70" aria-hidden="true" />

        {/* ------------------------------------------ statement + artefact */}
        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div>
            <p className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-orange-light">
              The equipment walk
            </p>
            <p className="mt-5 font-display text-[clamp(1.3rem,2.3vw,1.8rem)] font-bold leading-[1.28] text-white">
              Most buildings have no single list of what is on the roof. The
              first visit builds one —{" "}
              <span className="text-chill">every unit tagged, aged and photographed</span>{" "}
              — and the agreement is written against what is actually there.
            </p>
            <p className="mt-5 max-w-xl leading-relaxed text-white/70">
              The walk is free and the list is yours to keep whether or not
              you sign anything. It is the document an owner, a board and an
              insurer all end up asking for.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <ButtonLink href="/contact" variant="primary">
                Book an equipment walk
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <a
                href={business.phoneHref}
                className="flex min-h-11 items-center gap-2 font-display text-sm font-bold text-white/75 transition-colors hover:text-white"
              >
                <Phone className="size-4 text-orange-light" aria-hidden="true" />
                {business.phone}
              </a>
            </div>
          </div>

          <AssetSheet className="mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none" />
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

function FaqSection() {
  return (
    <section className="grid-lines-light relative overflow-hidden bg-white py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-40 top-10 size-[32rem] rounded-full bg-cyan/12 blur-[130px]" />
        <div className="absolute -bottom-40 -left-32 size-[28rem] rounded-full bg-orange/10 blur-[130px]" />
      </div>

      <div className="shell relative grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionEyebrow index={5}>Common questions</SectionEyebrow>
          <h2 className="poster mt-4 text-[clamp(1.9rem,4.2vw,2.9rem)]">
            What a facility manager
            <span className="block text-ember">asks first.</span>
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
            <SectionEyebrow index={4} className="text-cyan">
              How it runs
            </SectionEyebrow>
            <h2 className="poster mt-4 text-[clamp(1.9rem,4vw,2.9rem)] text-white">
              From first walk to
              <span className="block text-chill">a signed agreement.</span>
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
                      "font-mono text-[0.68rem] font-semibold uppercase tracking-[0.3em] transition-opacity duration-500",
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
