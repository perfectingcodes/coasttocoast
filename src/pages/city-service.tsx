import { Link } from "wouter";
import { ArrowRight, Phone } from "lucide-react";
import {
  business,
  locationBySlug,
  region,
  serviceBySlug,
  services,
} from "@/content/site";
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
 * Service × city landing page. There are 54 of these, which is most of the
 * site, so this template carries the brand rather than borrowing it: a
 * numbered run of sections down the reading column and a sticky rail beside
 * it with the booking panel, the other services in this city and the links
 * out. A lone text column in the middle of a wide viewport is what makes a
 * page look generated.
 *
 * The substance that differs city to city (permit office, salt exposure,
 * housing stock, ZIPs, storm history) comes from content/local.ts.
 */
function SectionHead({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-14 first:mt-0">
      <p className="flex items-center gap-3 font-display text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-navy/45">
        <span className="tabular-nums text-ember">
          {String(index).padStart(2, "0")}
        </span>
        <span className="h-px w-7 bg-ember/60" aria-hidden="true" />
      </p>
      <h2 className="poster mt-3 text-[clamp(1.4rem,2.4vw,1.85rem)]">{children}</h2>
    </div>
  );
}

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
        {/* Two columns, not one. 54 of these pages exist, and a lone text
            column in the middle of a 1440px viewport is what makes a page look
            generated rather than designed. The reading column keeps its
            measure; the rail beside it carries the things somebody on this
            page actually reaches for — the price of a visit, the facts, the
            other services in this city. */}
        <div className="shell grid items-start gap-12 py-14 md:py-18 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
          <article className="min-w-0 max-w-2xl">
            <AnswerBlock>{answer}</AnswerBlock>

            <SectionHead index={1}>
              {service.short} in {loc.city}, specifically
            </SectionHead>
            <p className="mt-5 leading-relaxed text-navy/80 md:text-lg">{angle}</p>

            <SectionHead index={2}>What the visit includes</SectionHead>
            <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
              {service.bullets.map((b, i) => (
                <li
                  key={b}
                  className="flex items-start gap-3 border-t border-navy/10 py-3.5 first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
                >
                  <span className="mt-0.5 font-mono text-[0.7rem] font-semibold tabular-nums text-ember">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.95rem] leading-relaxed text-navy/80">{b}</span>
                </li>
              ))}
            </ul>

            <SectionHead index={3}>{loc.city} service details</SectionHead>
            <FactTable
              className="mt-6"
              caption={`${service.name} coverage details for ${loc.city}, ${business.state}`}
              rows={cityFacts(loc)}
            />

            <SectionHead index={4}>Questions from {loc.city} homeowners</SectionHead>
            <FaqList faqs={faqs} />

            <div id="quote" className="mt-16 scroll-mt-28">
              <QuoteForm defaultService={service.name} defaultCity={loc.city} />
            </div>
          </article>

          {/* ------------------------------------------------------- rail */}
          <aside className="min-w-0 lg:sticky lg:top-28">
            <div className="band-navy grain edge-lit relative overflow-hidden rounded-card p-6 text-white">
              <p className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-cyan">
                Book it
              </p>
              <p className="poster mt-3 text-2xl">
                {service.short} in {loc.city}
                <span className="text-cyan">.</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/72">
                A flat price in writing before anything is opened, and a real
                person on the line around the clock.
              </p>
              <div className="mt-5 grid gap-2.5">
                <ButtonLink href="#quote" variant="onDark">
                  Request a quote
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href={business.phoneHref} variant="outline">
                  <Phone className="size-4" aria-hidden="true" />
                  {business.phone}
                </ButtonLink>
              </div>
              <p className="mt-4 max-w-[13rem] font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.12em] text-white/50">
                Lic. {business.license} · {business.emergency}
              </p>

              <img
                src="/brand/mascot-bust.webp"
                srcSet="/brand/mascot-bust-sm.webp 400w, /brand/mascot-bust.webp 800w"
                sizes="150px"
                alt=""
                width={800}
                height={849}
                loading="lazy"
                className="pointer-events-none absolute -bottom-7 -right-7 w-24 opacity-90 drop-shadow-[0_14px_28px_rgb(3_12_32/0.6)]"
              />
            </div>

            <p className="mt-8 font-display text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-navy/45">
              Other services in {loc.city}
            </p>
            <ul className="mt-3 grid gap-1.5">
              {others.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/locations/${loc.slug}/${s.slug}`}
                    className="group flex min-h-11 items-center justify-between gap-3 rounded-xl bg-white px-4 text-sm font-semibold text-navy/80 ring-1 ring-navy/10 transition-colors hover:text-blue hover:ring-blue/40"
                  >
                    {s.short}
                    <ArrowRight
                      className="size-4 shrink-0 text-blue transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-2 border-t border-navy/10 pt-5 text-sm">
              <Link href={cityPath} className="link-arrow min-h-9">
                Everything in {loc.city}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
              <Link href={`/services/${service.slug}`} className="link-arrow min-h-9">
                {service.short} across {region}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>

        <CtaBand title={`Need ${service.short.toLowerCase()} in ${loc.city} today?`} />
      </SiteLayout>
    </>
  );
}
