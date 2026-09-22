import { Link } from "wouter";
import { ArrowRight, Check, Phone } from "lucide-react";
import { business, cleanAndTune, locations, region, services } from "@/content/site";
import { SiteLayout } from "@/components/layout/site-layout";
import { AnswerBlock } from "@/components/answer";
import { Reveal } from "@/components/reveal";
import { Icon } from "@/components/icon";
import { CtaBand } from "@/components/cta-band";
import { ButtonLink } from "@/components/ui/button";
import { Seo, breadcrumbNode, faqNode } from "@/lib/seo";
import { cn } from "@/lib/utils";

/**
 * Service index. Alternating full-width feature rows rather than a card grid,
 * so it does not read as the same page as the city index.
 */
export default function ServicesIndex() {
  const path = "/services";
  const answer = `${business.name} provides six HVAC services across ${region}: ${services
    .map((s) => s.short.toLowerCase())
    .join(", ")}. All work is performed under Florida Mechanical Contractor licence #${business.license}, priced flat before work begins, and available 24/7 for emergencies at ${business.phone}. Routine maintenance is the ${cleanAndTune.price} ${cleanAndTune.name}, a 10-point service.`;

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path },
  ];

  return (
    <>
      <Seo
        title={`HVAC Services in ${region} | ${business.name}`}
        description={`Heating, cooling, mechanical, repairs, commercial HVAC and indoor air quality across ${region}. Licensed #${business.license}, flat-rate pricing, 24/7 emergency service.`}
        path={path}
        nodes={[
          faqNode(
            path,
            services.map((s) => ({
              q: `What does ${s.name.toLowerCase()} include?`,
              a: `${s.blurb} ${s.bullets.join(". ")}.`,
            })),
          ),
          breadcrumbNode(path, crumbs),
        ]}
      />

      <SiteLayout
        eyebrow="Services"
        title="Everything we do, in plain terms"
        lead="Six services, one crew. Pick what you need, or call and describe the problem — we will tell you which one it is."
        crumbs={crumbs}
      >
        <section className="shell py-14 md:py-18">
          <AnswerBlock className="max-w-4xl">{answer}</AnswerBlock>
        </section>

        <div className="pb-6">
          {services.map((s, i) => {
            const flipped = i % 2 === 1;
            return (
              <section
                key={s.slug}
                className={cn("py-12 md:py-16", flipped ? "bg-foam" : "bg-white")}
              >
                <div className="shell">
                  <Reveal>
                    <div
                      className={cn(
                        "grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]",
                        flipped && "lg:[&>*:first-child]:order-2",
                      )}
                    >
                      <div className="flex items-center gap-5">
                        <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-blue text-white shadow-[0_12px_26px_-12px_rgb(11_37_69/0.7)] md:size-20">
                          <Icon name={s.icon} className="size-8 md:size-9" />
                        </span>
                        <div>
                          <p className="font-display text-[0.68rem] font-bold uppercase tracking-[0.2em] text-blue">
                            0{i + 1} — {s.short}
                          </p>
                          <h2 className="mt-1.5 text-2xl md:text-3xl">{s.name}</h2>
                        </div>
                      </div>

                      <div>
                        <p className="leading-relaxed text-navy/80 md:text-lg">
                          {s.intro}
                        </p>
                        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                          {s.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-2.5">
                              <Check
                                className="mt-1 size-4 shrink-0 text-cyan"
                                aria-hidden="true"
                              />
                              <span className="text-sm leading-relaxed text-navy/75">
                                {b}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                          <Link
                            href={`/services/${s.slug}`}
                            className="inline-flex min-h-10 items-center gap-1.5 font-display text-sm font-bold uppercase tracking-wide text-blue"
                          >
                            {s.short} details
                            <ArrowRight className="size-4" aria-hidden="true" />
                          </Link>
                          <span className="text-sm text-navy/50">
                            Available in {locations.length} cities
                          </span>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </section>
            );
          })}
        </div>

        <section className="shell pb-16">
          <div className="card flex flex-col items-start gap-5 p-7 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl">Not sure which one you need?</h2>
              <p className="mt-2 text-navy/65">
                Describe what the system is doing and we will tell you. Most
                calls are diagnosed on the phone in under two minutes.
              </p>
            </div>
            <ButtonLink href={business.phoneHref} className="shrink-0">
              <Phone className="size-4" aria-hidden="true" />
              {business.phone}
            </ButtonLink>
          </div>
        </section>

        <CtaBand />
      </SiteLayout>
    </>
  );
}
