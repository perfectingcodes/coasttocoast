import { Link } from "wouter";
import { ArrowRight, Check, Phone } from "lucide-react";
import { business, locationBySlug, serviceBySlug, services } from "@/content/site";
import {
  cityFacts,
  cityFaqs,
  cityServiceAngle,
  cityServiceAnswer,
} from "@/content/local";
import { SiteLayout } from "@/components/layout/site-layout";
import { AnswerBlock, FactTable } from "@/components/answer";
import { FaqList } from "@/components/faq-list";
import { QuoteForm } from "@/components/quote-form";
import { CtaBand } from "@/components/cta-band";
import { ButtonLink } from "@/components/ui/button";
import { Seo, breadcrumbNode, faqNode, serviceNode } from "@/lib/seo";
import NotFound from "./not-found";

/**
 * Service × city landing page — 48 of these, so the layout is deliberately
 * unlike any other page type: one narrow reading column, answer first, the
 * local facts as a table, and the form at the end rather than in a sidebar.
 *
 * The substance that differs city to city (permit office, salt exposure,
 * housing stock, ZIPs, storm history) comes from content/local.ts.
 */
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
  const cityPath = `/locations/${loc.slug}`;
  const title = `${service.name} in ${loc.city}, ${business.state}`;
  // Search engines truncate around 60 characters, so the tab title uses the
  // short service label while the on-page H1 keeps the full name.
  const seoTitle = `${service.seoShort ?? service.short} in ${loc.city}, ${business.state} | ${business.name}`;
  const answer = cityServiceAnswer(loc, service);
  const angle = cityServiceAngle(loc, service);
  const faqs = [...service.faqs, ...cityFaqs(loc)];
  const others = services.filter((s) => s.slug !== service.slug);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Service Areas", path: "/locations" },
    { name: loc.city, path: cityPath },
    { name: service.short, path },
  ];

  return (
    <>
      <Seo
        title={seoTitle}
        description={`${service.short} in ${loc.city}, ${business.state}. Licensed #${business.license}, flat-rate pricing, 24/7 emergency service. ZIPs ${loc.zips.slice(0, 2).join(", ")}. Call ${business.phone}.`}
        path={path}
        geo={{ lat: loc.lat, lng: loc.lng, city: loc.city, county: loc.county }}
        nodes={[
          serviceNode({
            name: title,
            description: answer,
            path,
            city: { city: loc.city, lat: loc.lat, lng: loc.lng, county: loc.county },
            offers: service.slug === "repairs-maintenance",
          }),
          faqNode(path, faqs),
          breadcrumbNode(path, crumbs),
        ]}
      />

      <SiteLayout
        eyebrow={`${loc.county} · ${loc.zips.slice(0, 3).join(" · ")}`}
        title={title}
        lead={service.blurb}
        crumbs={crumbs}
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
        {/* Single narrow column — this page is read, not scanned. */}
        <article className="shell max-w-3xl py-14 md:py-18">
          <AnswerBlock>{answer}</AnswerBlock>

          <h2 className="mt-12 text-2xl">
            {service.short} in {loc.city}, specifically
          </h2>
          <p className="mt-4 leading-relaxed text-navy/80 md:text-lg">{angle}</p>

          <h2 className="mt-12 text-2xl">What the visit includes</h2>
          <ul className="mt-5 space-y-2.5">
            {service.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <Check className="mt-1 size-4 shrink-0 text-cyan" aria-hidden="true" />
                <span className="leading-relaxed text-navy/80">{b}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-2xl">{loc.city} service details</h2>
          <FactTable
            className="mt-5"
            caption={`${service.name} coverage details for ${loc.city}, ${business.state}`}
            rows={cityFacts(loc)}
          />

          <h2 className="mt-12 text-2xl">Questions from {loc.city} homeowners</h2>
          <FaqList faqs={faqs} />

          <h2 className="mt-12 text-2xl">Other services in {loc.city}</h2>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/locations/${loc.slug}/${s.slug}`}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-navy/80 ring-1 ring-navy/12 transition-colors hover:text-blue hover:ring-blue/40"
                >
                  {s.short} in {loc.city}
                  <ArrowRight className="size-4 shrink-0 text-blue" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href={cityPath} className="inline-flex items-center gap-1.5 font-bold text-blue">
              Everything we do in {loc.city}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href={`/services/${service.slug}`}
              className="inline-flex items-center gap-1.5 font-bold text-blue"
            >
              {service.name} across {business.state}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div id="quote" className="mt-14 scroll-mt-28">
            <QuoteForm defaultService={service.name} defaultCity={loc.city} />
          </div>
        </article>

        <CtaBand title={`Need ${service.short.toLowerCase()} in ${loc.city} today?`} />
      </SiteLayout>
    </>
  );
}
