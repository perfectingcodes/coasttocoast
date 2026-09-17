import { Link } from "wouter";
import { ArrowRight, MapPin } from "lucide-react";
import { business, generalFaqs, locationBySlug, services } from "@/content/site";
import { SiteLayout } from "@/components/layout/site-layout";
import { Section } from "@/components/section";
import { Icon } from "@/components/icon";
import { FaqList } from "@/components/faq-list";
import { QuoteForm } from "@/components/quote-form";
import { CtaBand } from "@/components/cta-band";
import { Seo, breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/seo";
import NotFound from "./not-found";

export default function LocationPage({ slug }: { slug: string }) {
  const loc = locationBySlug(slug);
  if (!loc) return <NotFound />;

  const path = `/locations/${loc.slug}`;

  return (
    <>
      <Seo
        title={`HVAC in ${loc.city}, FL | ${business.name}`}
        description={`Licensed AC and home services in ${loc.city}, ${business.state}. Same-day repairs, flat-rate pricing, 24/7 emergency response. Call ${business.phone}.`}
        path={path}
        jsonLd={[
          serviceJsonLd({
            name: `Home services in ${loc.city}`,
            description: loc.intro,
            path,
            areaServed: loc.city,
          }),
          faqJsonLd(generalFaqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Service Areas", path: "/locations" },
            { name: loc.city, path },
          ]),
        ]}
      />

      <SiteLayout
        eyebrow={loc.county}
        title={`HVAC services in ${loc.city}`}
        lead={loc.intro}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Service Areas", path: "/locations" },
          { name: loc.city, path },
        ]}
      >
        <Section>
          <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <h2 className="text-2xl">What we handle in {loc.city}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/locations/${loc.slug}/${s.slug}`}
                    className="card card-hover group flex items-start gap-4 p-5"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue/10 text-blue">
                      <Icon name={s.icon} className="size-5" />
                    </span>
                    <span>
                      <span className="block font-bold">{s.short}</span>
                      <span className="mt-1 block text-sm text-navy/65">
                        in {loc.city}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>

              <h2 className="mt-12 text-2xl">Neighborhoods we cover</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {loc.neighborhoods.map((n) => (
                  <li
                    key={n}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy/75 ring-1 ring-navy/10"
                  >
                    <MapPin className="size-3.5 text-blue" aria-hidden="true" />
                    {n}
                  </li>
                ))}
              </ul>

              <h2 className="mt-12 text-2xl">Neighborhoods we cover</h2>
              <p className="mt-3 text-navy/70 leading-relaxed">
                {loc.neighborhoods.join(" · ")} — and the addresses in between.
                Not sure whether you are in range? Call {business.phone} and ask.
              </p>

              <h2 className="mt-12 text-2xl">Questions from {loc.city} homeowners</h2>
              <FaqList faqs={generalFaqs} />
            </div>

            <div className="lg:sticky lg:top-24">
              <QuoteForm defaultCity={loc.city} />
            </div>
          </div>
        </Section>

        <Section className="bg-foam" center title={`Nearby areas`}>
          <Link
            href="/locations"
            className="mt-6 inline-flex items-center gap-1.5 font-bold text-blue"
          >
            See every service area
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Section>

        <CtaBand />
      </SiteLayout>
    </>
  );
}
