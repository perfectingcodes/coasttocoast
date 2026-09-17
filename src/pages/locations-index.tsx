import { Link } from "wouter";
import { ArrowRight, MapPin } from "lucide-react";
import { business, locations, region } from "@/content/site";
import { SiteLayout } from "@/components/layout/site-layout";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/cta-band";
import { Seo, breadcrumbJsonLd } from "@/lib/seo";

export default function LocationsIndex() {
  return (
    <>
      <Seo
        title={`Service Areas Across ${region} | ${business.name}`}
        description={`${business.name} covers ${locations
          .map((l) => l.city)
          .join(", ")} and the surrounding communities in Lee, Collier and Charlotte counties.`}
        path="/locations"
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Service Areas", path: "/locations" },
          ]),
        ]}
      />

      <SiteLayout
        eyebrow="Service areas"
        title="Coast to coast, county to county"
        lead={`Trucks run daily through Lee, Collier and Charlotte counties. If you are near any of these, you are in range.`}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Service Areas", path: "/locations" },
        ]}
      >
        <Section>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {locations.map((l, i) => (
              <Reveal key={l.slug} delay={i * 0.05}>
                <Link
                  href={`/locations/${l.slug}`}
                  className="card card-hover group flex h-full flex-col p-6"
                >
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-blue">
                    <MapPin className="size-4" aria-hidden="true" />
                    {l.county}
                  </span>
                  <h2 className="mt-3 text-xl">
                    {l.city}, {business.state}
                  </h2>
                  <p className="mt-2 flex-1 text-navy/70 leading-relaxed">{l.intro}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-blue">
                    {l.city} services
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
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
