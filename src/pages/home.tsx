import { Link } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  MapPin,
  Phone,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  business,
  cleanAndTune,
  generalFaqs,
  heroBadges,
  locations,
  services,
  whyUs,
  type Service,
} from "@/content/site";
import { Icon } from "@/components/icon";
import { Wave } from "@/components/wave";
import { Reveal } from "@/components/reveal";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { GoogleBadge, GoogleReviewCard } from "@/components/google-reviews";
import { CityMarquee, Pill, SeasonCard, TrustStrip } from "@/components/brand";
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
        <AtAGlance />
        <ServicesSection />
        <CleanAndTuneSection />
        <WhyUsSection />
        <TestimonialsSection />
        <AreasSection />
        <FaqSection />
        <CtaBand />
      </main>

      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------- hero */

function Hero() {
  return (
    <section className="band-navy grain grid-lines relative isolate overflow-hidden">
      {/* Photograph sits under the brand ground, not the other way round —
          it reads as texture and light, never as stock imagery. */}
      <picture>
        <source media="(min-width: 1024px)" srcSet="/brand/hero-coast.webp" />
        <source media="(min-width: 640px)" srcSet="/brand/hero-coast-1200.webp" />
        <img
          src="/brand/hero-coast-760.webp"
          alt=""
          fetchPriority="high"
          className="absolute inset-0 -z-20 size-full object-cover object-center opacity-30 mix-blend-luminosity"
        />
      </picture>

      <div className="shell relative grid items-center gap-12 pb-10 pt-12 md:pt-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:pb-14">
        <div>
          <Pill icon={<ShieldCheck className="size-3.5 text-cyan" />}>
            Licensed in Florida · {business.license}
          </Pill>

          <h1 className="display mt-6 text-[clamp(2.6rem,9.4vw,5rem)] text-white">
            <span className="block">Heating</span>
            <span className="block text-chill">Cooling</span>
            <span className="block">
              Mechanical<span className="text-orange">.</span>
            </span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/80">
            Trusted HVAC experts keeping Southwest Florida comfortable — from{" "}
            <span className="swoosh font-semibold text-white">coast to coast</span>.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/contact" size="lg">
              Schedule Service
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/contact#quote" variant="outline" size="lg">
              Get a Free Quote
            </ButtonLink>
            <ButtonLink href="/financing" variant="gold" size="lg">
              Financing
            </ButtonLink>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-7 gap-y-4">
            {heroBadges.map((b) => (
              <li key={b.title} className="flex items-center gap-2.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/8 text-cyan ring-1 ring-cyan/30">
                  <Icon name={b.icon} className="size-4" />
                </span>
                <span className="font-display text-[0.68rem] font-extrabold uppercase leading-tight tracking-[0.1em] text-white">
                  {b.title}
                  <span className="block font-bold text-white/55">{b.sub}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <GoogleBadge onDark />
          </div>
        </div>

        {/* ------------------------------- lockup with floating data cards */}
        <div className="relative hidden lg:block">
          <div
            className="absolute inset-8 -z-10 rounded-full bg-cyan/12 blur-3xl"
            aria-hidden="true"
          />
          <img
            src="/brand/logo-mascot.webp"
            alt={`${business.name} — heating, cooling, mechanical and air quality`}
            width={1200}
            height={1034}
            fetchPriority="high"
            className="mx-auto w-full max-w-lg drop-shadow-[0_28px_56px_rgb(5_15_38/0.75)]"
          />

          <SeasonCard className="absolute -right-3 top-2 w-56 xl:w-60" />

          <p className="script mt-1 text-right text-4xl text-white drop-shadow-[0_3px_10px_rgb(5_15_38/0.8)] xl:text-5xl">
            {business.promise}
            <span className="ml-auto mt-1 block h-1 w-44 rounded-full bg-gradient-to-r from-gold to-orange" />
          </p>
        </div>
      </div>

      <CityMarquee className="relative mt-4 border-t border-white/10 pb-6 pt-4" />

      <Wave fill="white" swell="#2bd9ff" height={80} className="relative -mb-px" />
    </section>
  );
}

/* ------------------------------------------------------------- at a glance */

/**
 * One self-contained paragraph stating who we are, what we do, where, under
 * which licence and at what price — written to survive being lifted out of the
 * page by a search snippet or an answer engine. `data-answer` is what the
 * page's speakable schema points at.
 */
function AtAGlance() {
  return (
    <section className="border-b border-navy/8 bg-white py-10 md:py-12">
      <div className="shell grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <p data-answer="" className="text-lg leading-relaxed text-navy/80">
          <strong className="font-display font-extrabold text-navy">
            {business.name}
          </strong>{" "}
          is a licensed, insured HVAC contractor based in {business.city},
          Florida, serving {locations.length} cities across Lee, Collier and
          Charlotte counties. We handle heating, cooling, mechanical, commercial
          HVAC and indoor air quality, hold Florida Mechanical Contractor licence
          #{business.license}, quote flat rates before work begins, and answer{" "}
          {business.emergency.toLowerCase()} at{" "}
          <a href={business.phoneHref} className="font-semibold text-blue">
            {business.phone}
          </a>
          . Routine maintenance is the {cleanAndTune.price} {cleanAndTune.name},
          a 10-point service.
        </p>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-2">
          {[
            { k: "Licence", v: `#${business.license}` },
            { k: "Cities served", v: String(locations.length) },
            { k: "Clean & Tune", v: cleanAndTune.price },
            { k: "Emergency", v: "24/7" },
          ].map((r) => (
            <div key={r.k}>
              <dt className="font-display text-[0.65rem] font-bold uppercase tracking-[0.16em] text-navy/45">
                {r.k}
              </dt>
              <dd className="mt-1 font-display text-lg font-extrabold text-blue">
                {r.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
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
            <h2 className="mt-4 text-3xl leading-[1.08] md:text-[2.9rem]">
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

          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.04} className="h-full">
              <Link
                href={`/services/${s.slug}`}
                className="card card-hover group relative flex h-full flex-col overflow-hidden p-6"
              >
                {/* accent rail, revealed on hover */}
                <span
                  className={cn(
                    "absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                    accents[s.accent],
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "grid size-12 place-items-center rounded-2xl text-white shadow-[0_10px_22px_-10px_rgb(10_35_82/0.7)] ring-1 ring-inset ring-white/25",
                    accents[s.accent],
                  )}
                >
                  <Icon name={s.icon} className="size-6" />
                </span>
                <h3 className="mt-5 text-lg">{s.name}</h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-navy/65">
                  {s.blurb}
                </p>
                <span className="link-arrow mt-5">
                  Learn more
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- clean & tune */

function CleanAndTuneSection() {
  return (
    <section className="bg-foam py-16 md:py-20">
      <div className="shell">
        <div className="card overflow-hidden lg:grid lg:grid-cols-[0.85fr_1.15fr]">
          <div className="band-navy relative flex flex-col justify-center overflow-hidden p-8 text-white md:p-10">
            <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.22em] text-cyan">
              Limited-time offer
            </p>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="display text-6xl text-white md:text-7xl">
                {cleanAndTune.price}
              </span>
              <span className="text-sm font-semibold text-white/60">
                {cleanAndTune.unit}
              </span>
            </p>
            <h2 className="mt-3 text-2xl text-white md:text-3xl">{cleanAndTune.name}</h2>
            <p className="mt-4 leading-relaxed text-white/70">{cleanAndTune.summary}</p>
            <div className="mt-7">
              <ButtonLink href="/contact" size="md">
                Book a Clean &amp; Tune
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <p className="eyebrow">What's included</p>
            <h3 className="mt-3 text-xl md:text-2xl">A 10-point service, every visit</h3>
            <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {cleanAndTune.checklist.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <Check className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden="true" />
                  <span className="text-navy/75">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- why us */

function WhyUsSection() {
  return (
    <section className="band-navy relative overflow-hidden">
      <Wave fill="#f2f7fd" swell="#2bd9ff" flip height={56} className="relative -mt-px" />

      <div className="shell relative grid items-center gap-12 py-16 md:py-20 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="relative mx-auto w-full max-w-md">
          <div
            className="absolute -inset-3 -rotate-2 rounded-card bg-cyan/15"
            aria-hidden="true"
          />
          <img
            src="/brand/photo-condenser.webp"
            srcSet="/brand/photo-condenser-640.webp 640w, /brand/photo-condenser.webp 1024w"
            sizes="(min-width: 1024px) 448px, 90vw"
            alt="A Coast to Coast Air condenser unit installed outside a Southwest Florida home"
            width={1024}
            height={688}
            loading="lazy"
            className="relative w-full rounded-card object-cover shadow-[0_24px_48px_-16px_rgb(4_16_29/0.7)]"
          />
          <img
            src="/brand/badge-locally-owned.webp"
            alt="Locally owned — your neighbors, your comfort, our commitment"
            width={640}
            height={636}
            loading="lazy"
            className="absolute -bottom-8 -right-4 w-28 drop-shadow-[0_10px_24px_rgb(4_16_29/0.6)] md:-right-8 md:w-36"
          />
        </div>

        <div>
          <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.24em] text-cyan">
            Why choose {business.name}
          </p>
          <h2 className="mt-3 text-3xl leading-tight text-white md:text-[2.6rem]">
            Florida's HVAC Partner
            <span className="block italic text-cyan">You Can Count On</span>
          </h2>

          <ul className="mt-10 grid gap-8 sm:grid-cols-2">
            {whyUs.map((w) => (
              <li key={w.title} className="flex gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/8 text-cyan ring-1 ring-cyan/25">
                  <Icon name={w.icon} className="size-5" />
                </span>
                <div>
                  <h3 className="text-base text-white">{w.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/65">{w.body}</p>
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
    <section className="bg-white py-16 md:py-24">
      <div className="shell grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="eyebrow">What our customers say</p>
          <h2 className="mt-3 text-3xl leading-tight md:text-[2.6rem]">
            Real People. Real Comfort.
          </h2>
          <div className="mt-8">
            <TestimonialCarousel />
          </div>
          <GoogleReviewCard className="mt-10" />
        </div>

        <div className="relative">
          <div
            className="absolute -inset-3 rotate-2 rounded-card bg-gradient-to-br from-blue/12 to-cyan/25"
            aria-hidden="true"
          />
          <img
            src="/brand/photo-van.webp"
            srcSet="/brand/photo-van-640.webp 640w, /brand/photo-van.webp 1024w"
            sizes="(min-width: 1024px) 520px, 92vw"
            alt="A wrapped Coast to Coast Air service van on the road in Southwest Florida"
            width={1024}
            height={688}
            loading="lazy"
            className="relative w-full rounded-card object-cover shadow-[0_24px_48px_-18px_rgb(11_37_69/0.45)]"
          />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- areas */

function AreasSection() {
  return (
    <section className="bg-foam py-16 md:py-20">
      <div className="shell">
        <div className="text-center">
          <p className="eyebrow">Areas we serve</p>
          <h2 className="mt-3 text-3xl md:text-[2.4rem]">
            Serving All of Southwest Florida
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-navy/65">
            Lee, Collier and Charlotte counties — licensed, insured and local to
            every one of them.
          </p>
        </div>

        <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {locations.map((l) => (
            <li key={l.slug}>
              <Link
                href={`/locations/${l.slug}`}
                className="card card-hover flex items-center gap-2.5 px-4 py-3.5 text-sm font-semibold text-navy transition-colors hover:text-blue"
              >
                <MapPin className="size-4 shrink-0 text-cyan" aria-hidden="true" />
                {l.city}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- faq */

function FaqSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="shell max-w-3xl">
        <div className="text-center">
          <p className="eyebrow">Common questions</p>
          <h2 className="mt-3 text-3xl md:text-[2.4rem]">Answers Before You Call</h2>
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
