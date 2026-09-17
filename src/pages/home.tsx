import { Link } from "wouter";
import { ArrowRight, Check, MapPin, Phone } from "lucide-react";
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
import { CtaBand } from "@/components/cta-band";
import { FaqList } from "@/components/faq-list";
import { ButtonLink } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Seo, breadcrumbJsonLd, faqJsonLd, localBusinessJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

const accents: Record<Service["accent"], string> = {
  orange: "bg-orange",
  cyan: "bg-cyan",
  slate: "bg-slateish",
  blue: "bg-blue",
};

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Seo
        title={`HVAC in Southwest Florida | ${business.name}`}
        description={`Licensed, insured HVAC service across ${business.city}, Naples, Cape Coral and all of Southwest Florida. Repairs, replacement, ${cleanAndTune.price} Clean & Tune and 24/7 emergency service. Call ${business.phone}.`}
        path="/"
        jsonLd={[
          localBusinessJsonLd(),
          faqJsonLd(generalFaqs),
          breadcrumbJsonLd([{ name: "Home", path: "/" }]),
        ]}
      />
      <Navbar />

      <main className="flex-1">
        <Hero />
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
    <section className="relative isolate overflow-hidden bg-navy-deep">
      {/* Gulf-coast photography behind a navy wash, so white type stays legible
          while the image still reads. Sized down for phones — the hero is the
          largest asset on the page. */}
      <picture>
        <source media="(min-width: 1024px)" srcSet="/brand/hero-coast.webp" />
        <source media="(min-width: 640px)" srcSet="/brand/hero-coast-1200.webp" />
        <img
          src="/brand/hero-coast-760.webp"
          alt=""
          fetchPriority="high"
          className="absolute inset-0 -z-20 size-full object-cover object-center"
        />
      </picture>
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(4_16_29/0.95)_0%,rgb(8_29_54/0.9)_38%,rgb(11_37_69/0.66)_66%,rgb(16_54_94/0.5)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(4_16_29/0.8)_0%,transparent_42%)]"
        aria-hidden="true"
      />

      <div className="shell relative grid items-center gap-10 pb-24 pt-14 md:pb-32 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        <div>
          <p className="font-display text-[0.72rem] font-bold uppercase tracking-[0.3em] text-cyan md:text-sm">
            Florida Comfort. Coast to Coast.
          </p>

          <h1 className="display mt-5 text-[clamp(2.4rem,9.2vw,4.6rem)] text-white drop-shadow-[0_4px_24px_rgb(4_16_29/0.6)]">
            <span className="block">Heating</span>
            <span className="block text-chill">Cooling</span>
            <span className="block">Mechanical</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/85">
            Trusted HVAC experts keeping Southwest Florida comfortable — from
            coast to coast.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" size="lg">
              Schedule Service
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/contact#quote" variant="outline" size="lg">
              Get a Free Quote
            </ButtonLink>
          </div>

          <ul className="mt-11 flex flex-wrap gap-x-8 gap-y-5">
            {heroBadges.map((b) => (
              <li key={b.title} className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-cyan/45 bg-white/8 text-cyan backdrop-blur-sm">
                  <Icon name={b.icon} className="size-5" />
                </span>
                <span className="font-display text-[0.7rem] font-bold uppercase leading-tight tracking-[0.1em] text-white">
                  {b.title}
                  <span className="block font-semibold text-white/70">{b.sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ------------------------------------------------- brand lockup */}
        <div className="relative hidden lg:block">
          <img
            src="/brand/logo-mascot.webp"
            alt={`${business.name} — heating, cooling, mechanical and air quality`}
            width={1200}
            height={1034}
            fetchPriority="high"
            className="mx-auto w-full max-w-xl drop-shadow-[0_24px_48px_rgb(4_16_29/0.7)]"
          />
          <p className="script -mt-2 text-right text-4xl text-white drop-shadow-[0_3px_10px_rgb(4_16_29/0.8)] xl:text-5xl">
            {business.promise}
            <span className="mt-1 block h-1 w-44 rounded-full bg-gold/90 ml-auto" />
          </p>
        </div>
      </div>

      <Wave fill="white" swell="#22c7f2" height={80} className="relative -mb-px" />
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
            <h2 className="mt-3 text-3xl leading-tight md:text-[2.7rem]">
              Complete HVAC Solutions
              <span className="block text-blue-bright">for Homes &amp; Businesses</span>
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-navy/65">
            Whether you need a new system, a fast repair, or routine maintenance,{" "}
            {business.name} delivers reliable HVAC solutions backed by exceptional
            service and Florida values.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <li key={s.slug}>
              <Reveal delay={i * 0.05} className="h-full">
                <Link
                  href={`/services/${s.slug}`}
                  className="card card-hover group flex h-full flex-col p-7 text-center"
                >
                  <span
                    className={cn(
                      "mx-auto grid size-16 place-items-center rounded-full text-white shadow-[0_10px_22px_-10px_rgb(11_37_69/0.6)]",
                      accents[s.accent],
                    )}
                  >
                    <Icon name={s.icon} className="size-7" />
                  </span>
                  <h3 className="mt-5 text-xl">{s.name}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-navy/65">{s.blurb}</p>
                  <span className="mt-5 inline-flex items-center justify-center gap-2 font-display text-xs font-bold uppercase tracking-[0.14em] text-blue">
                    Learn More
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
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
      <Wave fill="#f4f8fc" swell="#22c7f2" flip height={56} className="relative -mt-px" />

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
