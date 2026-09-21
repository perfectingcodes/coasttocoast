import { Link } from "wouter";
import { Check, MapPin } from "lucide-react";
import {
  business,
  cleanAndTune,
  locations,
  process,
  region,
  serviceBySlug,
  services,
} from "@/content/site";
import { SiteLayout } from "@/components/layout/site-layout";
import { AnswerBlock } from "@/components/answer";
import { Icon } from "@/components/icon";
import { FaqList } from "@/components/faq-list";
import { QuoteForm } from "@/components/quote-form";
import { CtaBand } from "@/components/cta-band";
import { Seo, breadcrumbNode, faqNode, serviceNode } from "@/lib/seo";
import NotFound from "./not-found";

/**
 * Service detail page. Signature layout: sticky quote sidebar alongside the
 * copy, a numbered process strip, then the full city matrix — visually
 * distinct from the wide grid of a city page and the narrow column of a
 * service × city page.
 */
export default function ServicePage({ slug }: { slug: string }) {
  const service = serviceBySlug(slug);
  if (!service) return <NotFound />;

  const path = `/services/${service.slug}`;
  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const answer = `${business.name} provides ${service.name.toLowerCase()} across ${region} — ${locations
    .map((l) => l.city)
    .slice(0, 4)
    .join(", ")} and the rest of Lee, Collier and Charlotte counties. ${service.blurb} We hold Florida Mechanical Contractor licence #${business.license}, quote flat rates in writing before work begins, and answer 24/7 at ${business.phone}.`;

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.short, path },
  ];

  return (
    <>
      <Seo
        title={`${service.seoShort ?? service.name} in ${region} | ${business.name}`}
        description={`${service.short} across ${region}. Licensed #${business.license}, flat-rate pricing quoted before work begins, 24/7 emergency service. Call ${business.phone}.`}
        path={path}
        nodes={[
          serviceNode({
            name: service.name,
            description: answer,
            path,
            offers: service.slug === "repairs-maintenance",
          }),
          faqNode(path, service.faqs),
          breadcrumbNode(path, crumbs),
        ]}
      />

      <SiteLayout
        eyebrow={service.short}
        title={service.name}
        lead={service.blurb}
        crumbs={crumbs}
      >
        <section className="shell grid items-start gap-12 py-14 md:py-18 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <AnswerBlock>{answer}</AnswerBlock>

            <p className="mt-8 text-lg leading-relaxed text-navy/80">
              {service.intro}
            </p>

            <h2 className="mt-10 text-2xl">What is included</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {service.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-navy/10"
                >
                  <Check className="mt-0.5 size-5 shrink-0 text-cyan" aria-hidden="true" />
                  <span className="text-sm text-navy/80">{b}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-12 text-2xl">Common questions</h2>
            <FaqList faqs={service.faqs} />
          </div>

          <div className="lg:sticky lg:top-28">
            <QuoteForm defaultService={service.name} />
          </div>
        </section>

        {/* Numbered process strip — unique to this page type. */}
        <section className="band-navy py-14 text-white md:py-18">
          <div className="shell">
            <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.24em] text-cyan">
              How it works
            </p>
            <h2 className="mt-3 text-2xl text-white md:text-3xl">
              The same four steps, every job
            </h2>
            <ol className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {process.map((step, i) => (
                <li key={step.title} className="border-t-2 border-cyan/35 pt-4">
                  <span className="display text-3xl text-cyan">0{i + 1}</span>
                  <h3 className="mt-2 text-base text-white">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/65">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="shell py-14 md:py-18">
          <h2 className="text-2xl md:text-3xl">
            {service.short} by city
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-navy/65">
            Each city page covers the permitting office, ZIP codes and coastal
            conditions that change how this work is done locally.
          </p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {locations.map((l) => (
              <li key={l.slug}>
                <Link
                  href={`/locations/${l.slug}/${service.slug}`}
                  className="card card-hover flex h-full flex-col p-4"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-blue">
                    <MapPin className="size-3.5" aria-hidden="true" />
                    {l.county}
                  </span>
                  <span className="mt-2 font-display font-bold text-navy">
                    {service.short} in {l.city}
                  </span>
                  <span className="mt-1 text-xs text-navy/55">
                    {l.zips.slice(0, 3).join(" · ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-foam py-14 md:py-18">
          <div className="shell">
            <h2 className="text-2xl md:text-3xl">Related services</h2>
            <div className="mt-7 grid gap-5 md:grid-cols-3">
              {related.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="card card-hover group flex items-start gap-4 p-6"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue/10 text-blue">
                    <Icon name={s.icon} className="size-5" />
                  </span>
                  <span>
                    <span className="block font-display font-bold">{s.name}</span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-navy/65">
                      {s.blurb}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
            {service.slug !== "repairs-maintenance" && (
              <p className="mt-8 text-navy/70">
                Not sure this is the problem?{" "}
                <Link href="/services/repairs-maintenance" className="font-bold text-blue">
                  The {cleanAndTune.price} {cleanAndTune.name}
                </Link>{" "}
                often finds it for the price of a maintenance visit.
              </p>
            )}
          </div>
        </section>

        <CtaBand />
      </SiteLayout>
    </>
  );
}
