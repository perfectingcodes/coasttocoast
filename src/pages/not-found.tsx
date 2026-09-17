import { business, services } from "@/content/site";
import { SiteLayout } from "@/components/layout/site-layout";
import { Section } from "@/components/section";
import { ButtonLink } from "@/components/ui/button";
import { Link } from "wouter";
import { Seo } from "@/lib/seo";

export default function NotFound() {
  return (
    <>
      <Seo
        title={`Page not found | ${business.name}`}
        description={`That page does not exist. Browse HVAC services and service areas across Southwest Florida, or call ${business.phone}.`}
        path="/404"
        noindex
      />

      <SiteLayout
        eyebrow="404"
        title="That page drifted off"
        lead="The link is gone or was never here. These are the places people usually want."
      >
        <Section>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/">Back home</ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Contact us
            </ButtonLink>
          </div>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="card card-hover block p-5 font-semibold"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </SiteLayout>
    </>
  );
}
