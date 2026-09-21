import { Link } from "wouter";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { business, cleanAndTune, locationBySlug, locations, services } from "@/content/site";
import { cityAnswer, cityFacts, cityFaqs, saltNote } from "@/content/local";
import { SiteLayout } from "@/components/layout/site-layout";
import { AnswerBlock, FactTable } from "@/components/answer";
import { Icon } from "@/components/icon";
import { FaqList } from "@/components/faq-list";
import { QuoteForm } from "@/components/quote-form";
import { CtaBand } from "@/components/cta-band";
import { ButtonLink } from "@/components/ui/button";
import { Seo, breadcrumbNode, faqNode, serviceNode } from "@/lib/seo";
import NotFound from "./not-found";

/**
 * City landing page. Layout is deliberately wide and matrix-led — a full-width
 * grid of every service in this city — where the service × city pages below it
 * are narrow and prose-led.
 */
export default function LocationPage({ slug }: { slug: string }) {
  const loc = locationBySlug(slug);
  if (!loc) return <NotFound />;

  const path = `/locations/${loc.slug}`;
  const answer = cityAnswer(loc);
  const faqs = cityFaqs(loc);
  const salt = saltNote(loc);
  const nearby = locations.filter((l) => l.slug !== loc.slug).slice(0, 4);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Service Areas", path: "/locations" },
    { name: loc.city, path },
  ];

  return (
    <>
      <Seo
        title={`HVAC in ${loc.city}, FL | ${business.name}`}
        description={`HVAC in ${loc.city}, ${business.state} — repair, replacement and 24/7 emergency service across ${loc.county}. ${cleanAndTune.price} Clean & Tune. Call ${business.phone}.`}
        path={path}
        geo={{ lat: loc.lat, lng: loc.lng, city: loc.city, county: loc.county }}
        nodes={[
          serviceNode({
            name: `HVAC services in ${loc.city}, ${business.state}`,
            description: answer,
            path,
            city: { city: loc.city, lat: loc.lat, lng: loc.lng, county: loc.county },
            offers: true,
          }),
          faqNode(path, faqs),
          breadcrumbNode(path, crumbs),
        ]}
      />

      <SiteLayout
        eyebrow={`${loc.county} · ${business.state}`}
        title={`HVAC services in ${loc.city}`}
        lead={loc.intro}
        crumbs={crumbs}
        hero={
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={business.phoneHref} variant="onDark">
              <Phone className="size-4" aria-hidden="true" />
              {business.phone}
            </ButtonLink>
            <ButtonLink href="#quote">Book a {cleanAndTune.price} Clean &amp; Tune</ButtonLink>
          </div>
        }
      >
        <section className="shell py-14 md:py-18">
          <AnswerBlock className="max-w-4xl">{answer}</AnswerBlock>

          {/* Full-width service matrix — the signature of this page type. */}
          <h2 className="mt-14 text-2xl md:text-3xl">
            What we handle in {loc.city}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/locations/${loc.slug}/${s.slug}`}
                  className="card card-hover group flex h-full items-start gap-4 p-5"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue/10 text-blue">
                    <Icon name={s.icon} className="size-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-display font-bold">
                      {s.short} in {loc.city}
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-navy/65">
                      {s.blurb}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-blue">
                      View
                      <ArrowRight
                        className="size-3.5 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-foam py-14 md:py-18">
          <div className="shell grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <h2 className="text-2xl md:text-3xl">
                What makes {loc.city} different
              </h2>
              <p className="mt-4 leading-relaxed text-navy/80">{salt.detail}</p>
              <p className="mt-3 leading-relaxed text-navy/80">
                {salt.cadence} Locally that means {loc.conditions.housing}, and
                permits for any system replacement run through{" "}
                {loc.permitAuthority}.
              </p>

              <h3 className="mt-9 font-display text-lg font-extrabold">
                Neighborhoods we cover
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {loc.neighborhoods.map((n) => (
                  <li
                    key={n}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy/75 ring-1 ring-navy/10"
                  >
                    <MapPin className="size-3.5 text-cyan" aria-hidden="true" />
                    {n}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-navy/60">
                Not sure whether you are in range? Call{" "}
                <a href={business.phoneHref} className="font-semibold text-blue">
                  {business.phone}
                </a>{" "}
                and ask.
              </p>
            </div>

            <FactTable
              caption={`Service details for ${loc.city}, ${business.state}`}
              rows={cityFacts(loc)}
            />
          </div>
        </section>

        <section className="shell grid items-start gap-12 py-14 md:py-18 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="text-2xl md:text-3xl">
              {loc.city} questions, answered
            </h2>
            <FaqList faqs={faqs} />

            <h3 className="mt-12 font-display text-lg font-extrabold">
              Nearby service areas
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {nearby.map((l) => (
                <li key={l.slug}>
                  <Link
                    href={`/locations/${l.slug}`}
                    className="inline-flex rounded-full px-4 py-2 text-sm font-semibold text-navy/80 ring-1 ring-navy/15 transition-colors hover:bg-blue/5 hover:text-blue"
                  >
                    {l.city}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/locations"
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-blue ring-1 ring-blue/30"
                >
                  All areas
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>

          <div id="quote" className="scroll-mt-28 lg:sticky lg:top-28">
            <QuoteForm defaultCity={loc.city} />
          </div>
        </section>

        <CtaBand title={`Need HVAC service in ${loc.city}?`} />
      </SiteLayout>
    </>
  );
}
