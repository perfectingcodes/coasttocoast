import { Link } from "wouter";
import { ArrowRight, Check } from "lucide-react";
import { business, locations, region, serviceBySlug, services } from "@/content/site";
import { SiteLayout } from "@/components/layout/site-layout";
import { Section } from "@/components/section";
import { FaqList } from "@/components/faq-list";
import { QuoteForm } from "@/components/quote-form";
import { CtaBand } from "@/components/cta-band";
import { Seo, breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/seo";
import NotFound from "./not-found";

export default function ServicePage({ slug }: { slug: string }) {
  const service = serviceBySlug(slug);
  if (!service) return <NotFound />;

  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const path = `/services/${service.slug}`;

  return (
    <>
      <Seo
        title={`${service.seoShort ?? service.name} in ${region} | ${business.name}`}
        description={`${service.blurb} Licensed, insured and local to ${region} — call ${business.phone}.`}
        path={path}
        jsonLd={[
          serviceJsonLd({
            name: service.name,
            description: service.blurb,
            path,
          }),
          faqJsonLd(service.faqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.name, path },
          ]),
        ]}
      />

      <SiteLayout
        eyebrow={service.short}
        title={service.name}
        lead={service.blurb}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.short, path },
        ]}
      >
        <Section>
          <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <p className="text-lg text-navy/80 leading-relaxed">{service.intro}</p>

              <h2 className="mt-10 text-2xl">What is included</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {service.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-navy/10">
                    <Check className="mt-0.5 size-5 shrink-0 text-blue" aria-hidden="true" />
                    <span className="text-sm text-navy/80">{b}</span>
                  </li>
                ))}
              </ul>

              <h2 className="mt-12 text-2xl">
                {service.short} by city
              </h2>
              <p className="mt-3 text-navy/70 leading-relaxed">
                Local pages with the details that matter for each area:
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {locations.map((l) => (
                  <li key={l.slug}>
                    <Link
                      href={`/locations/${l.slug}/${service.slug}`}
                      className="inline-flex rounded-full px-4 py-2 text-sm font-semibold text-navy/80 ring-1 ring-navy/15 transition-colors hover:bg-blue/5 hover:text-blue"
                    >
                      {service.short} in {l.city}
                    </Link>
                  </li>
                ))}
              </ul>

              <h2 className="mt-12 text-2xl">Common questions</h2>
              <FaqList faqs={service.faqs} />
            </div>

            <div className="lg:sticky lg:top-24">
              <QuoteForm defaultService={service.name} />
            </div>
          </div>
        </Section>

        <Section className="bg-foam" eyebrow="Also from us" title="Related services">
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {related.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="card card-hover group p-6"
              >
                <h3 className="text-lg">{s.name}</h3>
                <p className="mt-2 text-navy/70 leading-relaxed">{s.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-blue">
                  Learn more
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </div>
        </Section>

        <CtaBand />
      </SiteLayout>
    </>
  );
}
