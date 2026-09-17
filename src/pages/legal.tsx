import { business } from "@/content/site";
import { SiteLayout } from "@/components/layout/site-layout";
import { Section } from "@/components/section";
import { Seo } from "@/lib/seo";

type Slug = "privacy" | "terms";

const docs: Record<Slug, { title: string; sections: { h: string; p: string }[] }> = {
  privacy: {
    title: "Privacy Policy",
    sections: [
      {
        h: "What we collect",
        p: `When you submit a quote request we collect the name, phone number, email address, city and job details you provide. Our site does not use advertising trackers.`,
      },
      {
        h: "How we use it",
        p: `Only to respond to your request, schedule service and keep records of work performed. We do not sell or rent your information to anyone.`,
      },
      {
        h: "Who else sees it",
        p: `Only the service providers we need to operate — for example our scheduling and email tools. They are bound to use the data solely on our behalf.`,
      },
      {
        h: "Text messages and calls",
        p: `By giving us your phone number you agree we may call or text you about your request. Message frequency varies, and you can opt out at any time by replying STOP.`,
      },
      {
        h: "Your choices",
        p: `Email ${business.email} to request a copy of what we hold about you, correct it, or have it deleted.`,
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    sections: [
      {
        h: "Estimates and pricing",
        p: `Quotes are based on the conditions observed at the time of inspection and are valid for 30 days. If the work uncovers something the inspection could not reach, we stop and re-quote before continuing.`,
      },
      {
        h: "Scheduling and access",
        p: `Appointments require an adult present and safe access to the equipment. Repeated missed appointments may incur a trip charge.`,
      },
      {
        h: "Warranty",
        p: `Workmanship is warranted for one year from the date of service. Manufacturer warranties on parts and equipment are passed through per the manufacturer's terms and require registration, which we handle at installation.`,
      },
      {
        h: "Payment",
        p: `Payment is due on completion unless financing was arranged in advance. Financed work is subject to the lender's terms.`,
      },
      {
        h: "Limits",
        p: `We are not responsible for pre-existing conditions, code deficiencies present before our work, or damage caused by equipment we did not install or service.`,
      },
    ],
  },
};

export default function LegalPage({ slug }: { slug: Slug }) {
  const doc = docs[slug];
  const updated = "September 2026";

  return (
    <>
      <Seo
        title={`${doc.title} | ${business.name}`}
        description={`${doc.title} for ${business.formalName}, the licensed HVAC contractor serving Southwest Florida from ${business.city}. Last updated September 2026.`}
        noindex
        path={`/${slug}`}
      />

      <SiteLayout
        eyebrow="Legal"
        title={doc.title}
        lead={`Last updated ${updated}.`}
        crumbs={[
          { name: "Home", path: "/" },
          { name: doc.title, path: `/${slug}` },
        ]}
      >
        <Section>
          <div className="max-w-3xl space-y-10">
            {doc.sections.map((s) => (
              <div key={s.h}>
                <h2 className="text-2xl">{s.h}</h2>
                <p className="mt-3 text-navy/75 leading-relaxed">{s.p}</p>
              </div>
            ))}
            <p className="text-navy/60">
              Questions about this page? Email{" "}
              <a href={`mailto:${business.email}`} className="font-semibold text-blue">
                {business.email}
              </a>
              .
            </p>
          </div>
        </Section>
      </SiteLayout>
    </>
  );
}
