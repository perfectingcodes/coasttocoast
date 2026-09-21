import { Link } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Phone,
  Zap,
} from "lucide-react";
import {
  business,
  cleanAndTune,
  generalFaqs,

  locations,
  services,
  whyUs,
  type Service,
} from "@/content/site";
import { Icon } from "@/components/icon";
import { Wave } from "@/components/wave";
import { Reveal } from "@/components/reveal";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { GoogleReviewCard } from "@/components/google-reviews";
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
        <ServiceMap />
        <FaqSection />
        <CtaBand mascot />
      </main>

      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------- hero */

function Hero() {
  return (
    <section className="band-navy grain relative isolate overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute -left-40 top-1/3 size-[36rem] rounded-full bg-ember/14 blur-[130px]" />
        <div className="absolute -right-32 -top-32 size-[38rem] rounded-full bg-cyan/16 blur-[130px]" />
      </div>

      <div className="shell relative grid items-center gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-10 lg:py-20">
        <div className="max-w-xl">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-[0.7rem] font-extrabold uppercase tracking-[0.26em] text-cyan">
            Southwest Florida HVAC
            <span className="h-3 w-px bg-white/25" aria-hidden="true" />
            <span className="text-white/45">Lic. {business.license}</span>
          </p>

          <h1 className="poster mt-6 text-[clamp(2.9rem,6.4vw,5.1rem)] text-white">
            Comfort
            <br />
            lives <span className="text-chill">here</span>
            <span className="text-orange">.</span>
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-relaxed text-white/75">
            Heating, cooling and mechanical across Lee, Collier and Charlotte
            counties — flat-rate pricing quoted before work starts, and a real
            person on the phone at 2am.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <ButtonLink href="/contact" size="lg">
              Book My Service
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <a
              href={business.phoneHref}
              className="group inline-flex items-center gap-2.5 font-display text-base font-extrabold text-white transition-colors hover:text-cyan"
            >
              <span className="grid size-10 place-items-center rounded-full ring-1 ring-white/25 transition-colors group-hover:ring-cyan">
                <Phone className="size-4" aria-hidden="true" />
              </span>
              {business.phone}
            </a>
          </div>

          {/* Three quiet proofs on a hairline, not a wall of badges. */}
          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/12 pt-7">
            {[
              { v: String(locations.length), k: "Cities served" },
              { v: "24/7", k: "Emergency line" },
              { v: cleanAndTune.price, k: "Clean & Tune" },
            ].map((p) => (
              <div key={p.k}>
                <dt className="poster text-2xl text-white">{p.v}</dt>
                <dd className="mt-1 font-display text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-white/45">
                  {p.k}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The coverage illustration anchors the hero. It says "coast to
            coast" literally, names the focus markets, and — unlike the mascot
            lockup — does not repeat the wordmark already in the header. */}
        <div className="relative">
          <img
            src="/brand/map-florida.webp"
            srcSet="/brand/map-florida-sm.webp 550w, /brand/map-florida.webp 1100w"
            sizes="(min-width: 1024px) 560px, 88vw"
            alt="Coast to Coast Air serves Southwest Florida, with focus markets in Estero, Bonita Springs and Naples"
            width={1100}
            height={949}
            fetchPriority="high"
            className="mx-auto w-full max-w-lg drop-shadow-[0_30px_60px_rgb(5_15_38/0.8)]"
          />
        </div>
      </div>

      <CityMarquee className="relative border-t border-white/10 pb-5 pt-4" />
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

          {services.map((s, i) => (
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
                  className="numeral-ghost pointer-events-none absolute -right-1 -top-4 select-none text-[5.5rem] transition-colors duration-300 group-hover:[-webkit-text-stroke-color:rgb(255_255_255/0.2)]"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span
                  className={cn(
                    "grid size-12 place-items-center rounded-xl ring-1 transition-colors duration-300",
                    "bg-blue/8 text-blue ring-blue/20",
                    "group-hover:bg-white/10 group-hover:text-cyan group-hover:ring-cyan/40",
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
          <div className="band-navy grain relative flex flex-col justify-center p-8 text-white md:p-10">
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

            <img
              src="/brand/mascot-service.webp"
              srcSet="/brand/mascot-service-sm.webp 450w, /brand/mascot-service.webp 900w"
              sizes="220px"
              alt=""
              width={900}
              height={890}
              loading="lazy"
              className="pointer-events-none absolute -bottom-4 -right-6 hidden w-56 drop-shadow-[0_18px_36px_rgb(5_15_38/0.6)] lg:block"
            />
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
          <h2 className="poster mt-4 text-[clamp(2rem,4.6vw,3.25rem)] text-white">
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
          <h2 className="poster mt-4 text-[clamp(2rem,4.6vw,3.25rem)]">
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
            src="/brand/mascot-bust.webp"
            srcSet="/brand/mascot-bust-sm.webp 400w, /brand/mascot-bust.webp 800w"
            sizes="(min-width: 1024px) 460px, 80vw"
            alt=""
            width={800}
            height={800}
            loading="lazy"
            className="relative mx-auto w-full max-w-md drop-shadow-[0_24px_48px_rgb(10_35_82/0.3)]"
          />
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
        <div className="text-center">
          <p className="eyebrow">Common questions</p>
          <h2 className="poster mt-4 text-[clamp(1.9rem,4.2vw,3rem)]">Answers Before You Call</h2>
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
