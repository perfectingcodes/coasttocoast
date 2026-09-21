import { Link } from "wouter";
import { Phone } from "lucide-react";
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
import { Icon } from "@/components/icon";
import { CtaBand } from "@/components/cta-band";
import { ButtonLink } from "@/components/ui/button";
import {
  CityMatrix,
  CredentialBody,
  LifespanBody,
  OfferBody,
  SeasonalBody,
  SegmentsBody,
  SymptomsBody,
} from "@/components/service-sections";
import { Seo, breadcrumbNode, faqNode, serviceNode } from "@/lib/seo";
import NotFound from "./not-found";

/**
 * Service detail page.
 *
 * There is no single service layout: the body is chosen by `detail.kind`, so
 * heating, cooling, mechanical, maintenance, commercial and air quality each
 * get a structure built around what that service actually has to communicate.
 * Only the hero, the city matrix and the closing CTA are shared.
 */
export default function ServicePage({ slug }: { slug: string }) {
  const service = serviceBySlug(slug);
  if (!service) return <NotFound />;

  const path = `/services/${service.slug}`;
  const kind = service.detail.kind;
  const answer = `${business.name} provides ${service.name.toLowerCase()} across ${region} — ${locations
    .map((l) => l.city)
    .slice(0, 4)
    .join(", ")} and the rest of Lee, Collier and Charlotte counties. ${service.blurb} We hold Florida Mechanical Contractor licence #${business.license}, quote flat rates in writing before work begins, and answer 24/7 at ${business.phone}.`;

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.short, path },
  ];

  // Only the two pages where a first-time caller needs to know what happens
  // next carry the process strip; elsewhere the page body is the process.
  const showProcess = kind === "seasonal" || kind === "lifespan";
  // Commercial closes on a site visit, so it skips the consumer cross-sell.
  const showRelated = kind !== "segments";
  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  const body = { service, answer };

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
            offers: kind === "offer",
          }),
          faqNode(path, service.faqs),
          breadcrumbNode(path, crumbs),
        ]}
      />

      <SiteLayout
        eyebrow={heroEyebrow(service.short, kind)}
        title={service.name}
        lead={service.blurb}
        crumbs={crumbs}
        hero={
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={business.phoneHref} variant="onDark">
              <Phone className="size-4" aria-hidden="true" />
              {business.phone}
            </ButtonLink>
            <ButtonLink href="#quote">{heroCta(kind)}</ButtonLink>
          </div>
        }
      >
        {kind === "seasonal" && <SeasonalBody {...body} />}
        {kind === "lifespan" && <LifespanBody {...body} />}
        {kind === "credential" && <CredentialBody {...body} />}
        {kind === "offer" && <OfferBody {...body} />}
        {kind === "segments" && <SegmentsBody {...body} />}
        {kind === "symptoms" && <SymptomsBody {...body} />}

        {showProcess && (
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
        )}

        <CityMatrix service={service} />

        {showRelated && (
          <section className="bg-foam py-14 md:py-18">
            <div className="shell">
              <h2 className="text-2xl md:text-3xl">Related services</h2>
              <div className="mt-7 grid gap-5 md:grid-cols-3">
                {related.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="card card-hover flex items-start gap-4 p-6"
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
              {kind !== "offer" && (
                <p className="mt-8 text-navy/70">
                  Not sure this is the problem?{" "}
                  <Link
                    href="/services/repairs-maintenance"
                    className="font-bold text-blue"
                  >
                    The {cleanAndTune.price} {cleanAndTune.name}
                  </Link>{" "}
                  often finds it for the price of a maintenance visit.
                </p>
              )}
            </div>
          </section>
        )}

        <CtaBand {...ctaFor(kind, service.short)} />
      </SiteLayout>
    </>
  );
}

/* --------------------------------------------------------- hero variants */

function heroEyebrow(short: string, kind: string): string {
  switch (kind) {
    case "offer":
      return `${cleanAndTune.price} · 10-point service`;
    case "segments":
      return "Commercial & multi-building";
    case "credential":
      return `Licensed · ${business.license}`;
    case "symptoms":
      return "Humidity, mould & allergens";
    default:
      return short;
  }
}

function heroCta(kind: string): string {
  switch (kind) {
    case "offer":
      return "Book a Clean & Tune";
    case "segments":
      return "Request a site visit";
    default:
      return "Request a quote";
  }
}

function ctaFor(kind: string, short: string) {
  if (kind === "segments") {
    return {
      eyebrow: "Commercial enquiries",
      title: "Let's walk your equipment.",
      cta: "Request a site visit",
    };
  }
  if (kind === "offer") {
    return {
      eyebrow: `${cleanAndTune.price}, ten points, twice a year`,
      title: "Catch it before it strands you in August.",
      cta: "Book a Clean & Tune",
    };
  }
  return { title: `Need ${short.toLowerCase()} handled today?` };
}
