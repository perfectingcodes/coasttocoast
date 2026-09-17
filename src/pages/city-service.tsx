import { Link } from "wouter";
import { ArrowRight, Check, Phone } from "lucide-react";
import {
  business,
  locationBySlug,
  serviceBySlug,
  services,
} from "@/content/site";
import { SiteLayout } from "@/components/layout/site-layout";
import { Section } from "@/components/section";
import { FaqList } from "@/components/faq-list";
import { QuoteForm } from "@/components/quote-form";
import { CtaBand } from "@/components/cta-band";
import { ButtonLink } from "@/components/ui/button";
import { Seo, breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/seo";
import NotFound from "./not-found";

/** Service × city landing page — the long-tail SEO surface. */
export default function CityServicePage({
  city,
  service: serviceSlug,
}: {
  city: string;
  service: string;
}) {
  const loc = locationBySlug(city);
  const service = serviceBySlug(serviceSlug);
  if (!loc || !service) return <NotFound />;

  const path = `/locations/${loc.slug}/${service.slug}`;
  const title = `${service.name} in ${loc.city}, ${business.state}`;
  // Search engines truncate around 60 characters, so the tab title uses the
  // short service label while the on-page H1 keeps the full name.
  const seoTitle = `${service.seoShort ?? service.short} in ${loc.city}, ${business.state} | ${business.name}`;
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <>
      <Seo
        title={seoTitle}
        description={`${service.blurb} Serving ${loc.city} and ${loc.neighborhoods
          .slice(0, 2)
          .join(", ")}. Call ${business.phone} for same-day service.`}
        path={path}
        jsonLd={[
          serviceJsonLd({
            name: service.name,
            description: service.blurb,
            path,
            areaServed: loc.city,
          }),
          faqJsonLd(service.faqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Service Areas", path: "/locations" },
            { name: loc.city, path: `/locations/${loc.slug}` },
            { name: service.short, path },
          ]),
        ]}
      />

      <SiteLayout
        eyebrow={`${loc.city} · ${loc.county}`}
        title={title}
        lead={service.blurb}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Service Areas", path: "/locations" },
          { name: loc.city, path: `/locations/${loc.slug}` },
          { name: service.short, path },
        ]}
        hero={
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={business.phoneHref} variant="onDark">
              <Phone className="size-4" aria-hidden="true" />
              {business.phone}
            </ButtonLink>
            <ButtonLink href="#quote">Request a quote</ButtonLink>
          </div>
        }
      >
        <Section>
          <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <p className="text-lg text-navy/80 leading-relaxed">{service.intro}</p>

              <h2 className="mt-10 text-2xl">Why {loc.city} is different</h2>
              <p className="mt-3 text-navy/70 leading-relaxed">{loc.intro}</p>

              <h2 className="mt-10 text-2xl">What the visit includes</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {service.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-navy/10"
                  >
                    <Check className="mt-0.5 size-5 shrink-0 text-blue" aria-hidden="true" />
                    <span className="text-sm text-navy/80">{b}</span>
                  </li>
                ))}
              </ul>

              <h2 className="mt-12 text-2xl">Areas we cover in {loc.city}</h2>
              <p className="mt-3 text-navy/70 leading-relaxed">
                {loc.neighborhoods.join(", ")} — and the addresses in between.
              </p>

              <h2 className="mt-12 text-2xl">
                {service.short} questions, answered
              </h2>
              <FaqList faqs={service.faqs} />

              <h2 className="mt-12 text-2xl">Other services in {loc.city}</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {others.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/locations/${loc.slug}/${s.slug}`}
                      className="inline-flex rounded-full px-4 py-2 text-sm font-semibold text-navy/80 ring-1 ring-navy/15 transition-colors hover:bg-blue/5 hover:text-blue"
                    >
                      {s.short} in {loc.city}
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href={`/locations/${loc.slug}`}
                className="mt-8 inline-flex items-center gap-1.5 font-bold text-blue"
              >
                Everything we do in {loc.city}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            <div id="quote" className="lg:sticky lg:top-24">
              <QuoteForm defaultService={service.name} defaultCity={loc.city} />
            </div>
          </div>
        </Section>

        <CtaBand
          title={`Need ${service.short.toLowerCase()} in ${loc.city} today?`}
        />
      </SiteLayout>
    </>
  );
}
