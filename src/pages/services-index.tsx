import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { business, region, services } from "@/content/site";
import { SiteLayout } from "@/components/layout/site-layout";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { Icon } from "@/components/icon";
import { CtaBand } from "@/components/cta-band";
import { Seo, breadcrumbJsonLd } from "@/lib/seo";

export default function ServicesIndex() {
  return (
    <>
      <Seo
        title={`HVAC Services in ${region} | ${business.name}`}
        description={`Repair, replacement, maintenance, air quality and 24/7 emergency service across ${region}. Flat-rate pricing quoted before work begins.`}
        path="/services"
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
        ]}
      />

      <SiteLayout
        eyebrow="Services"
        title="Everything we do, in plain terms"
        lead="Six services, one crew. Pick what you need or call and describe the problem — we will tell you which one it is."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
      >
        <Section>
          <div className="grid gap-5 md:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.05}>
                <Link
                  href={`/services/${s.slug}`}
                  className="card card-hover group flex h-full gap-5 p-6"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-blue/10 text-blue">
                    <Icon name={s.icon} className="size-6" />
                  </span>
                  <div>
                    <h2 className="text-lg">{s.name}</h2>
                    <p className="mt-2 text-navy/70 leading-relaxed">{s.blurb}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-blue">
                      Details and pricing
                      <ArrowRight
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>

        <CtaBand />
      </SiteLayout>
    </>
  );
}
