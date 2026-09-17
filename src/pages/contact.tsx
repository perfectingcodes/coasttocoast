import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { business, locations, region } from "@/content/site";
import { SiteLayout } from "@/components/layout/site-layout";
import { Section } from "@/components/section";
import { QuoteForm } from "@/components/quote-form";
import { Seo, breadcrumbJsonLd, localBusinessJsonLd } from "@/lib/seo";

export default function Contact() {
  return (
    <>
      <Seo
        title={`Contact ${business.name} | Free Quotes in ${region}`}
        description={`Call ${business.phone} or send a request. Same-day appointments across ${region}, with 24/7 emergency service.`}
        path="/contact"
        jsonLd={[
          localBusinessJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />

      <SiteLayout
        eyebrow="Contact"
        title="Tell us what is going on"
        lead="Two minutes on the form, or call and talk to someone who actually works here. Either way you get a real price before any work starts."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      >
        <Section>
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <h2 className="text-2xl">Reach us directly</h2>
              <dl className="mt-6 space-y-5">
                <ContactRow icon={<Phone className="size-5" />} label="Phone">
                  <a href={business.phoneHref} className="text-lg font-bold text-blue">
                    {business.phone}
                  </a>
                </ContactRow>
                <ContactRow icon={<Mail className="size-5" />} label="Email">
                  <a href={`mailto:${business.email}`} className="hover:text-blue">
                    {business.email}
                  </a>
                </ContactRow>
                <ContactRow icon={<Clock className="size-5" />} label="Hours">
                  {business.hours}
                  <span className="block text-navy/60">{business.emergency}</span>
                </ContactRow>
                <ContactRow icon={<MapPin className="size-5" />} label="Based in">
                  {business.city}, {business.state} {business.zip}
                  <span className="block text-navy/60">
                    Serving {locations.map((l) => l.city).join(", ")}
                  </span>
                </ContactRow>
              </dl>

              <div className="card mt-10 p-6">
                <p className="eyebrow">Emergency?</p>
                <p className="mt-3 text-navy/75 leading-relaxed">
                  Call instead of using the form. The line is answered by a person
                  around the clock, and we will get a technician moving.
                </p>
              </div>
            </div>

            <QuoteForm />
          </div>
        </Section>
      </SiteLayout>
    </>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue/10 text-blue">
        {icon}
      </span>
      <div>
        <dt className="text-xs font-bold uppercase tracking-[0.12em] text-navy/50">
          {label}
        </dt>
        <dd className="mt-1">{children}</dd>
      </div>
    </div>
  );
}
