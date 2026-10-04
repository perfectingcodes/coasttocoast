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

/** Stable anchor from a clause heading. */
const clauseId = (h: string) =>
  h.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

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
          <div className="grid items-start gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
            <nav
              aria-label="On this page"
              className="lg:sticky lg:top-28"
            >
              <p className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-navy/45">
                On this page
              </p>
              <ol className="mt-3 space-y-0.5">
                {doc.sections.map((sec, i) => (
                  <li key={sec.h}>
                    <a
                      href={`#${clauseId(sec.h)}`}
                      className="flex min-h-9 items-baseline gap-3 text-sm text-navy/65 transition-colors hover:text-blue"
                    >
                      <span className="font-mono text-[0.65rem] tabular-nums text-ember">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {sec.h}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="min-w-0 max-w-2xl">
              {doc.sections.map((sec, i) => (
                <section
                  key={sec.h}
                  id={clauseId(sec.h)}
                  className="scroll-mt-28 border-t border-navy/10 py-7 first:border-t-0 first:pt-0"
                >
                  <p className="font-mono text-[0.65rem] tabular-nums text-ember">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-2 font-display text-xl font-extrabold text-navy">
                    {sec.h}
                  </h2>
                  <p className="mt-3 leading-relaxed text-navy/75">{sec.p}</p>
                </section>
              ))}

              <p className="mt-6 border-t border-navy/10 pt-7 text-navy/60">
                Questions about this page? Email{" "}
                <a href={`mailto:${business.email}`} className="font-semibold text-blue">
                  {business.email}
                </a>
                .
              </p>
            </div>
          </div>
        </Section>
      </SiteLayout>
    </>
  );
}
