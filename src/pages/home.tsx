import { Link } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Phone,
  Quote,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import {
  business,
  cleanAndTune,
  generalFaqs,
  locations,
  process,
  testimonials,
  services,
  whyUs,
  type Service,
} from "@/content/site";
import { Icon } from "@/components/icon";
import { Wave } from "@/components/wave";
import { Reveal } from "@/components/reveal";
import { GoogleBadge, GoogleReviewCard } from "@/components/google-reviews";
import { CityMarquee, Pill, TrustStrip } from "@/components/brand";
import { ServiceMap } from "@/components/service-map";
import { CtaBand } from "@/components/cta-band";
import { FaqList } from "@/components/faq-list";
import { ButtonLink } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Seo, breadcrumbNode, faqNode } from "@/lib/seo";
import { cn } from "@/lib/utils";

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

function Hero() {
  return (
    <section className="band-ember grain relative isolate overflow-hidden">
      <div className="shell relative grid items-center gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.98fr)] lg:gap-6 lg:py-12">
        <div className="max-w-xl">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-white">
            Southwest Florida HVAC
            <span className="h-3 w-px bg-white/40" aria-hidden="true" />
            <span className="text-gold">Lic. {business.license}</span>
          </p>

          <h1 className="poster mt-4 text-[clamp(2.9rem,6.6vw,5.2rem)] text-white drop-shadow-[0_4px_18px_rgb(150_50_0/0.4)]">
            Comfort
            <br />
            lives <span className="text-ice">here</span>
            <span className="text-gold">.</span>
          </h1>

          <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-white/90">
            Home AC repair, replacement and maintenance across Lee, Collier and
            Charlotte counties. A{" "}
            <span className="font-semibold text-white">
              flat price in writing before we start
            </span>{" "}
            — and a real person answers, day or night.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <ButtonLink href="/contact" variant="sky" size="lg">
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
                <span className="block font-display text-[0.58rem] font-extrabold uppercase tracking-[0.18em] text-gold">
                  A person answers · 24/7
                </span>
                <span className="block font-display text-lg font-extrabold text-white transition-colors group-hover:text-cyan-light">
                  {business.phone}
                </span>
              </span>
            </a>
          </div>

          {/* Proof and social sit on one line so the block stays compact. */}
          <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-white/25 pt-5">
            <img
              src="/brand/badge-locally-owned.webp"
              alt="Locally owned and operated"
              width={640}
              height={632}
              className="size-16 shrink-0 drop-shadow-[0_8px_18px_rgb(150_50_0/0.45)]"
            />
            <dl className="flex flex-wrap gap-x-7 gap-y-3">
              {[
                { v: String(locations.length), k: "Cities" },
                { v: "24/7", k: "Emergency" },
                { v: cleanAndTune.price, k: "Clean & Tune" },
              ].map((p) => (
                <div key={p.k}>
                  <dt className="poster text-xl text-white">{p.v}</dt>
                  <dd className="mt-0.5 font-display text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-white/70">
                    {p.k}
                  </dd>
                </div>
              ))}
            </dl>
            <GoogleBadge className="ml-auto" />
          </div>
        </div>

        <div className="relative">
          <img
            src="/brand/hero-map-mascot.webp"
            srcSet="/brand/hero-map-mascot-sm.webp 600w, /brand/hero-map-mascot.webp 1200w"
            sizes="(min-width: 1024px) 560px, 92vw"
            alt="Coast to Coast Air serves Southwest Florida, with focus markets in Naples, Estero and Bonita Springs"
            width={1200}
            height={1064}
            fetchPriority="high"
            className="mx-auto w-full max-w-lg drop-shadow-[0_28px_56px_rgb(150_50_0/0.45)]"
          />
        </div>
      </div>

      <CityMarquee className="relative border-t border-white/25 pb-4 pt-3" />
    </section>
  );
}

/* --------------------------------------------------------------- services */

function ServicesSection() {
  return (
    <section className="bg-white py-16 md:py-24" id="services">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow">Our Services</p>
            <h2 className="poster mt-4 text-[clamp(2.1rem,5vw,3.5rem)]">
              Complete HVAC solutions
              <span className="block text-ember">for homes &amp; businesses</span>
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-navy/65">
            Whether you need a new system, a fast repair, or routine maintenance,{" "}
            {business.name} delivers reliable HVAC solutions backed by exceptional
            service and Florida values.
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
              <div className="mt-auto pt-8">
                <ButtonLink href={business.phoneHref} variant="onDark">
                  <Phone className="size-4" aria-hidden="true" />
                  {business.phone}
                </ButtonLink>
              </div>
            </div>
          </Reveal>

          {services.filter((x) => x.featured).map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.04} className="h-full">
              <Link
                href={`/services/${s.slug}`}
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-card border border-navy/10 bg-white p-6",
                  "transition-[background-color,border-color,transform,box-shadow] duration-300",
                  "hover:-translate-y-1 hover:border-navy hover:bg-navy hover:shadow-[var(--shadow-lift)]",
                )}
              >
                {/* Index numeral, drawn as an outline so it sits behind the
                    content rather than competing with it. */}
                <span
                  className="numeral-ghost pointer-events-none absolute -right-1 -top-4 select-none text-[5rem] transition-colors duration-300 group-hover:text-white/15"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span
                  className={cn(
                    "grid size-12 place-items-center rounded-xl text-white shadow-[0_10px_20px_-10px_rgb(10_35_82/0.8)] ring-1 ring-inset ring-white/25 transition-transform duration-300 group-hover:scale-105",
                    accents[s.accent],
                  )}
                >
                  <Icon name={s.icon} className="size-6" />
                </span>

                <h3 className="poster mt-6 text-xl leading-[1.05] text-navy transition-colors duration-300 group-hover:text-white">
                  {s.name}
                </h3>

                <span
                  className={cn(
                    "mt-3.5 block h-[3px] w-9 rounded-full transition-all duration-300 group-hover:w-16",
                    accents[s.accent],
                  )}
                  aria-hidden="true"
                />

                <p className="mt-4 flex-1 text-sm leading-relaxed text-navy/60 transition-colors duration-300 group-hover:text-white/70">
                  {s.blurb}
                </p>

                <span className="link-arrow mt-6 text-blue transition-colors duration-300 group-hover:text-cyan">
                  {s.short}
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* The rest of the catalogue, still linked from the home page. */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-navy/10 pt-7">
          <span className="font-display text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-navy/45">
            Also from us
          </span>
          {services
            .filter((x) => !x.featured)
            .map((x) => (
              <Link
                key={x.slug}
                href={`/services/${x.slug}`}
                className="group inline-flex items-center gap-2 font-display text-sm font-extrabold text-navy transition-colors hover:text-blue"
              >
                <span className={cn("size-2 rounded-full", accents[x.accent])} aria-hidden="true" />
                {x.name}
                <ArrowUpRight
                  className="size-3.5 text-blue transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            ))}
          <Link href="/services" className="link-arrow ml-auto">
            All services
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- clean & tune */

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
        {/* A framed, ribboned panel rather than a flat band — it has to read as
            a promotion, not as another section. */}
        <div className="band-navy grain relative overflow-hidden rounded-[2rem] px-6 py-12 shadow-[0_40px_80px_-30px_rgb(5_15_38/0.6)] ring-1 ring-white/12 md:px-12 md:py-14">
          <div
            className="pointer-events-none absolute -right-24 -top-24 size-[28rem] rounded-full bg-gold/16 blur-[110px]"
            aria-hidden="true"
          />
          {/* Diagonal sash across the corner — long enough to cross the
              checklist card and clip the offer card's top edge. */}
          {savings && (
            <div
              className="pointer-events-none absolute -right-20 top-10 z-20 w-[26rem] rotate-[38deg] bg-gradient-to-r from-gold via-orange-light to-ember py-2.5 text-center shadow-[0_14px_30px_-10px_rgb(120_40_0/0.8)] ring-1 ring-white/30 sm:-right-16 sm:top-12"
              aria-hidden="true"
            >
              <span className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-white sm:text-sm">
                Save {savings}
              </span>
            </div>
          )}

        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
          {/* ------------------------------------------------ the offer */}
          <div>
            <span className="pill pill-dark border-gold/40 bg-gold/12 text-gold">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Limited-time offer
            </span>

            <div className="mt-6 flex items-end gap-3">
              <span className="poster text-[clamp(3.5rem,9vw,5.5rem)] leading-[0.8] text-white">
                {cleanAndTune.price}
              </span>
              <span className="pb-2 font-display text-sm font-bold text-white/55">
                {cleanAndTune.unit}
              </span>
              {cleanAndTune.regularPrice && (
                <span className="pb-2.5 font-display text-lg font-bold text-white/40 line-through">
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

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ButtonLink href="/contact" size="lg">
                Book a Clean &amp; Tune
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <a
                href={business.phoneHref}
                className="font-display text-sm font-extrabold text-white/75 underline decoration-white/25 underline-offset-4 transition-colors hover:text-cyan hover:decoration-cyan"
              >
                or call {business.phone}
              </a>
            </div>
          </div>

          {/* --------------------------------------------- the checklist */}
          <div className="glass edge-lit p-6 md:p-8">
            <p className="font-display text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-cyan">
              Every visit · all ten points
            </p>
            <ol className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {cleanAndTune.checklist.map((item, i) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white/10 font-display text-[0.65rem] font-extrabold text-cyan ring-1 ring-cyan/30">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-white/80">{item}</span>
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

/* ----------------------------------------------------------------- why us */

function WhyUsSection() {
  return (
    <section className="band-navy grain relative overflow-hidden">
      <Wave fill="white" swell="#2bd9ff" flip height={56} className="relative -mt-px" />

      <div className="shell relative grid items-center gap-14 py-14 md:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        {/* Stacked, overlapping frames — one image was not carrying the space. */}
        <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
          <div className="relative aspect-[5/4]">
            <img
              src="/brand/photo-home.webp"
              srcSet="/brand/photo-home-560.webp 560w, /brand/photo-home.webp 900w"
              sizes="(min-width: 1024px) 380px, 70vw"
              alt="A Southwest Florida home"
              width={900}
              height={720}
              loading="lazy"
              className="absolute left-0 top-0 w-[72%] rotate-[-4deg] rounded-card object-cover shadow-[0_26px_50px_-18px_rgb(5_15_38/0.85)] ring-1 ring-white/15"
            />
            <img
              src="/brand/photo-hvac-unit.webp"
              srcSet="/brand/photo-hvac-unit-760.webp 760w, /brand/photo-hvac-unit.webp 1280w"
              sizes="(min-width: 1024px) 340px, 62vw"
              alt="An outdoor condenser installed beside a home"
              width={1280}
              height={853}
              loading="lazy"
              className="absolute bottom-0 right-0 w-[64%] rotate-[3deg] rounded-card object-cover shadow-[0_26px_50px_-18px_rgb(5_15_38/0.9)] ring-1 ring-white/15"
            />
            <img
              src="/brand/badge-locally-owned.webp"
              alt="Locally owned and operated"
              width={640}
              height={632}
              loading="lazy"
              className="absolute -left-2 bottom-4 w-24 drop-shadow-[0_14px_28px_rgb(5_15_38/0.8)] sm:w-28"
            />
          </div>
        </div>

        <div>
          <p className="eyebrow text-cyan">Why Coast to Coast</p>
          <h2 className="poster mt-4 text-[clamp(2rem,4.4vw,3.1rem)] text-white">
            Built on
            <span className="block text-chill">second opinions.</span>
          </h2>

          <ul className="mt-9 space-y-5">
            {whyUs.map((w) => (
              <li key={w.title} className="flex gap-4 border-t border-white/10 pt-5">
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-white/8 text-cyan ring-1 ring-cyan/25">
                  <Icon name={w.icon} className="size-4" />
                </span>
                <div>
                  <h3 className="font-display text-base font-extrabold text-white">
                    {w.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">
                    {w.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Wave fill="white" height={56} className="relative -mb-px" />
    </section>
  );
}

/* ---------------------------------------------------------- testimonials */

function TestimonialsSection() {
  return (
    <section className="bg-foam py-16 md:py-20">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <div>
            <p className="eyebrow">Reviews</p>
            <h2 className="poster mt-4 text-[clamp(2rem,4.4vw,3.1rem)]">
              Real people.
              <span className="block text-ember">Real comfort.</span>
            </h2>
          </div>
          <GoogleBadge />
        </div>

        {/* Three reviews shown at once. A one-at-a-time carousel meant most of
            the proof was hidden behind a control nobody presses. */}
        <ul className="mt-11 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <li key={t.name}>
              <Reveal delay={i * 0.06} className="h-full">
                <figure className="card relative flex h-full flex-col p-7">
                  <Quote
                    className="absolute right-6 top-6 size-8 text-blue/10"
                    aria-hidden="true"
                  />
                  <div className="flex gap-0.5" aria-label="Rated 5 out of 5">
                    {Array.from({ length: 5 }, (_, n) => (
                      <Star
                        key={n}
                        className="size-4 fill-gold text-gold"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-navy/75">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-navy/8 pt-4">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-bright to-blue font-display text-xs font-extrabold text-white">
                      {t.name.charAt(0)}
                    </span>
                    <span className="leading-tight">
                      <span className="block font-display text-sm font-extrabold text-navy">
                        {t.name}
                      </span>
                      <span className="block text-xs text-navy/50">{t.city}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="card mt-6 flex flex-col items-center gap-6 overflow-hidden p-6 md:flex-row md:p-0">
          <img
            src="/brand/mascot-bust.webp"
            srcSet="/brand/mascot-bust-sm.webp 400w, /brand/mascot-bust.webp 800w"
            sizes="(min-width: 768px) 200px, 160px"
            alt=""
            width={800}
            height={849}
            loading="lazy"
            className="w-40 shrink-0 self-end md:-mb-4 md:ml-6 md:w-48"
          />
          <div className="flex-1 md:py-6 md:pr-6">
            <GoogleReviewCard className="border-0 bg-transparent shadow-none ring-0 !p-0" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- faq */

function FaqSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="shell max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <img
            src="/brand/avatar-husky.webp"
            alt=""
            width={256}
            height={289}
            loading="lazy"
            className="size-20 object-contain drop-shadow-[0_12px_24px_rgb(10_35_82/0.25)]"
          />
          <p className="eyebrow eyebrow-center mt-5">Common questions</p>
          <h2 className="poster mt-4 text-[clamp(1.9rem,4.2vw,3rem)]">
            Answers before you call
          </h2>
        </div>
        <FaqList faqs={generalFaqs} />
        <p className="mt-8 text-center text-navy/65">
          Still have a question?{" "}
          <a
            href={business.phoneHref}
            className="inline-flex items-center gap-1.5 font-semibold text-blue underline underline-offset-4"
          >
            <Phone className="size-4" aria-hidden="true" />
            {business.phone}
          </a>
        </p>
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
function HowItWorks() {
  return (
    <section className="band-abyss grain relative overflow-hidden py-16 md:py-20">
      <div className="shell relative">
        <div className="max-w-2xl">
          <p className="eyebrow text-cyan">What happens next</p>
          <h2 className="poster mt-4 text-[clamp(2rem,4.4vw,3.1rem)] text-white">
            From your call to
            <span className="block text-chill">cold air, in four.</span>
          </h2>
        </div>

        <ol className="relative mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <span
            className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-orange via-cyan to-blue opacity-45 lg:block"
            aria-hidden="true"
          />
          {process.map((step, i) => (
            <li key={step.title} className="relative">
              <span className="relative z-10 flex size-12 items-center justify-center rounded-full bg-navy-deep font-display text-base font-extrabold text-cyan ring-1 ring-cyan/35">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 font-display text-lg font-extrabold text-white">
                {step.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-white/60">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <p
          data-answer=""
          className="mt-14 max-w-3xl border-t border-white/10 pt-7 text-sm leading-relaxed text-white/50"
        >
          {business.name} is a licensed, insured HVAC contractor in{" "}
          {business.city}, Florida, serving {locations.length} cities across Lee,
          Collier and Charlotte counties under Florida Mechanical Contractor
          licence #{business.license}.
        </p>
      </div>
    </section>
  );
}
